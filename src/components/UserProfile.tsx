"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import ReportMatrix from './ReportMatrix';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Settings, User as UserIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Organization {
  id: string;
  name: string;
  description?: string;
  members: string[];
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
  created_at: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orgProjectCounts, setOrgProjectCounts] = useState<Record<string, number>>({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const supabase = createBrowserClient();
  
  // Fetch user and organizations
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        setUser(user);
        
        if (!user) {
          setLoading(false);
          return;
        }
        
        // Get user's organizations with project counts
        const { data: orgs, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('members', user.id)
          .order('created_at', { ascending: false });
        
        if (orgError) throw orgError;
        
        if (orgs && orgs.length > 0) {
          setOrganizations(orgs as Organization[]);
          // Select the most recent organization by default
          setSelectedOrg(orgs[0] as Organization);
          
          // Get project counts for each organization
          const counts: Record<string, number> = {};
          for (const org of orgs) {
            const { count, error: countError } = await supabase
              .from('projects')
              .select('*', { count: 'exact', head: true })
              .eq('organization_id', org.id);
            
            if (!countError) {
              counts[org.id] = count || 0;
            }
          }
          setOrgProjectCounts(counts);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    }
    
    fetchUserData();
  }, []);
  
  // Fetch projects when organization is selected
  useEffect(() => {
    async function fetchProjects() {
      if (!selectedOrg) return;
      
      try {
        setLoading(true);
        const { data: projectsData, error: projError } = await supabase
          .from('projects')
          .select(`
            id, 
            name, 
            description,
            organization_id,
            created_at
          `)
          .eq('organization_id', selectedOrg.id)
          .order('created_at', { ascending: false });
        
        if (projError) throw projError;
        
        if (projectsData && projectsData.length > 0) {
          setProjects(projectsData as Project[]);
          // Select the most recent project by default
          setSelectedProject(projectsData[0] as Project);
        } else {
          setProjects([]);
          setSelectedProject(null);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, [selectedOrg]);
  
  if (loading && !user) {
    return <div className="w-full text-center py-8">Loading user profile...</div>;
  }
  
  if (!user) {
    return (
      <div className="w-full text-center py-8 bg-foreground/5 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Please sign in</h2>
        <p>You need to be signed in to view your profile and organizations.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full space-y-4">
      {/* Header with current selections and settings button */}
      <div className="flex justify-between items-center bg-foreground/5 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          {selectedOrg && (
            <div className="flex items-center">
              <span className="font-medium">{selectedOrg.name}</span>
              {selectedProject && (
                <>
                  <span className="mx-2 text-foreground/30">/</span>
                  <span className="font-medium">{selectedProject.name}</span>
                </>
              )}
            </div>
          )}
          {!selectedOrg && (
            <span className="text-foreground/50">No organization selected</span>
          )}
        </div>
        
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Settings size={16} />
              <span>Settings</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Project Settings</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="organizations" className="mt-4">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="user">User Profile</TabsTrigger>
                <TabsTrigger value="organizations">Organizations</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>
              
              <TabsContent value="user" className="space-y-4">
                <div className="bg-foreground/5 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">{user.email}</h3>
                      <p className="text-xs text-foreground/50">User ID: {user.id.substring(0, 8)}...</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="organizations" className="space-y-4">
                {organizations.length === 0 ? (
                  <p className="text-foreground/70">No organizations found. Create one to get started.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1">
                    {organizations.map(org => (
                      <div 
                        key={org.id} 
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedOrg?.id === org.id 
                            ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20' 
                            : 'border-foreground/10 bg-foreground/5 hover:bg-foreground/10'
                        }`}
                        onClick={() => {
                          setSelectedOrg(org);
                          if (selectedOrg?.id !== org.id) {
                            setSelectedProject(null);
                          }
                        }}
                      >
                        <div className="flex items-center mb-1">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs mr-2">
                            {org.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-medium truncate">{org.name}</p>
                        </div>
                        {org.description && (
                          <p className="text-xs text-foreground/70 mb-2 line-clamp-1">{org.description}</p>
                        )}
                        <div className="text-xs text-foreground/50">
                          {orgProjectCounts[org.id] || 0} project(s)
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="projects" className="space-y-4">
                {!selectedOrg ? (
                  <p className="text-foreground/70">Please select an organization first.</p>
                ) : loading ? (
                  <p>Loading projects...</p>
                ) : projects.length === 0 ? (
                  <p className="text-foreground/70">No projects found for this organization.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto p-1">
                    {projects.map(project => (
                      <div 
                        key={project.id} 
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedProject?.id === project.id 
                            ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20' 
                            : 'border-foreground/10 bg-foreground/5 hover:bg-foreground/10'
                        }`}
                        onClick={() => setSelectedProject(project)}
                      >
                        <div className="flex items-center mb-1">
                          <div className="w-6 h-6 rounded-full bg-secondary/30 flex items-center justify-center text-secondary-foreground text-xs mr-2">
                            {project.name.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-medium truncate">{project.name}</p>
                        </div>
                        {project.description && (
                          <p className="text-xs text-foreground/70 mb-2 line-clamp-1">{project.description}</p>
                        )}
                        <div className="text-xs text-foreground/50">
                          Created: {new Date(project.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end mt-4">
              <Button onClick={() => setSettingsOpen(false)}>
                Done
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Report Matrix Section - Main focus */}
      {selectedProject ? (
        <ReportMatrix projectId={selectedProject.id} />
      ) : (
        <div className="bg-foreground/5 p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">No Project Selected</h2>
          <p className="mb-4">Please select an organization and project to view reports.</p>
          <Button onClick={() => setSettingsOpen(true)}>
            Open Settings
          </Button>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
    </div>
  );
}
