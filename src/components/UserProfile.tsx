"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/utils/supabase';
import { User } from '@supabase/supabase-js';
import ReportMatrix from './ReportMatrix';

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
    <div className="w-full space-y-8">
      {/* User Profile Section */}
      <div className="bg-foreground/5 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
      </div>
      
      {/* Organizations Section */}
      <div className="bg-foreground/5 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Your Organizations</h2>
        
        {organizations.length === 0 ? (
          <p className="text-foreground/70">No organizations found. Create one to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {organizations.map(org => (
              <div 
                key={org.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedOrg?.id === org.id 
                    ? 'bg-primary/20 border-primary/50' 
                    : 'border-foreground/10 bg-foreground/5 hover:bg-foreground/10'
                }`}
                onClick={() => setSelectedOrg(org)}
              >
                <p className="text-lg font-semibold">{org.name || 'Unnamed Organization'}</p>
                {org.description && <p className="text-sm text-foreground/70">{org.description}</p>}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-foreground/50">
                    {orgProjectCounts[org.id] || 0} project(s)
                  </span>
                  {selectedOrg?.id === org.id && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Selected</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Projects Section - Only show if an organization is selected */}
      {selectedOrg && (
        <div className="bg-foreground/5 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Projects for {selectedOrg.name}</h2>
          
          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="text-foreground/70">No projects found for this organization.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map(project => (
                <div 
                  key={project.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedProject?.id === project.id 
                      ? 'bg-primary/20 border-primary/50' 
                      : 'border-foreground/10 bg-foreground/5 hover:bg-foreground/10'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <p className="text-lg font-semibold">{project.name || 'Unnamed Project'}</p>
                  {project.description && <p className="text-sm text-foreground/70">{project.description}</p>}
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-foreground/50">
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    {selectedProject?.id === project.id && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Selected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Report Matrix Section - Only show if a project is selected */}
      {selectedProject && (
        <ReportMatrix projectId={selectedProject.id} />
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
    </div>
  );
}
