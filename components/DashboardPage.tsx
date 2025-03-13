'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { authApi, projectApi, metadataApi } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';
import ProjectCard from '@/components/ProjectCard';
import MetadataSummaryTable from '@/components/MetadataSummaryTable';
import { useRouter } from 'next/navigation';
import { Project } from '@/types/project';
import { Metadata } from '@/types/metadata';
import { AxiosError } from 'axios';

export default function DashboardPage() {
  const { user } = useUser();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [metadata, setMetadata] = useState<Metadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadataError, setMetadataError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      if (!user?.organization_id) {
        setError('No organization assigned. Please contact your administrator.');
        setLoading(false);
        return;
      }

      try {
        console.log('Loading projects for organization:', user.organization_id);
        const data = await projectApi.getProjects(user.organization_id);
        setProjects(data);
        
        // Select the most recent project by default
        if (data.length > 0) {
          const sortedProjects = [...data].sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
          setSelectedProject(sortedProjects[0]);
        }
      } catch (err) {
        console.error('Error loading projects:', err);
        
        // Provide more specific error messages based on the error type
        if (err instanceof AxiosError) {
          if (!err.response) {
            setError('Network error. Please check your connection and try again.');
          } else if (err.response.status === 401 || err.response.status === 403) {
            setError('Authentication error. Please sign in again.');
            // Force logout and redirect to login
            authApi.logout();
            router.push('/login');
          } else if (err.response.status === 404) {
            setError(`Organization not found (ID: ${user.organization_id}). Please contact support.`);
          } else if (err.response.status >= 500) {
            setError('Server error. Please try again later or contact support.');
          } else {
            setError(`Failed to load projects: ${err.response.data?.detail || 'Unknown error'}`);
          }
        } else {
          setError('Failed to load projects. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    // Only load projects if user is available and authenticated
    if (user && isAuthenticated) {
      loadProjects();
    }
  }, [user, isAuthenticated, router]);

  useEffect(() => {
    const loadMetadata = async () => {
      if (!selectedProject) return;

      setMetadataLoading(true);
      setMetadataError(null);

      try {
        const data = await metadataApi.listMetadata(selectedProject.id);
        // Sort by created_at to get the most recent metadata
        const sortedMetadata = data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setMetadata(sortedMetadata);
      } catch (err) {
        setMetadataError('Failed to load metadata');
        console.error('Error loading metadata:', err);
      } finally {
        setMetadataLoading(false);
      }
    };

    loadMetadata();
  }, [selectedProject]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleLogout = () => {
    authApi.logout();
    router.push('/login');
  };

  const handleCreateProject = () => {
    if (!user?.organization_id) {
      alert('No organization assigned. Please contact your administrator.');
      return;
    }
    router.push(`/organizations/${user.organization_id}/projects/new`);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">Concept Flow</h1>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <span className="mr-4 text-sm font-medium text-gray-500">
                      {user?.name} ({user?.email})
                    </span>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
              {/* User Info Card */}
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Welcome, {user?.name}!</h2>
                <p className="text-gray-600">You are now signed in to the Concept Flow application.</p>
                <div className="mt-6">
                  <h3 className="text-md font-medium text-gray-900 mb-2">User Information:</h3>
                  <ul className="mt-2 list-disc list-inside text-gray-600">
                    <li>Name: {user?.name}</li>
                    <li>Email: {user?.email}</li>
                    <li>Role: {user?.role}</li>
                    <li>Organization ID: {user?.organization_id || 'Not assigned'}</li>
                  </ul>
                </div>
              </div>

              {/* Projects Section */}
              <div className="bg-white shadow rounded-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">Your Projects</h2>
                  <button
                    onClick={handleCreateProject}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Create New Project
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading projects...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">{error}</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No projects found. Create your first project!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => handleProjectClick(project)}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedProject?.id === project.id
                            ? 'ring-2 ring-blue-500'
                            : 'hover:ring-2 hover:ring-blue-200'
                        }`}
                      >
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Metadata Section */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Project Metadata
                    {selectedProject && (
                      <span className="ml-2 text-sm text-gray-500">
                        for {selectedProject.name}
                      </span>
                    )}
                  </h2>
                </div>

                {!selectedProject ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Select a project to view its metadata</p>
                  </div>
                ) : metadataLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading metadata...</p>
                  </div>
                ) : metadataError ? (
                  <div className="text-center py-8">
                    <p className="text-red-600">{metadataError}</p>
                  </div>
                ) : metadata.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No metadata found for this project</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Form Concept Coverage Summary */}
                    <MetadataSummaryTable metadata={metadata[0].content} />
                    
                    {/* Raw Metadata (Collapsed by Default) */}
                    <details className="mt-8">
                      <summary className="text-md font-medium text-gray-900 cursor-pointer hover:text-blue-600">
                        View Raw Metadata JSON
                      </summary>
                      <div className="mt-4 bg-gray-50 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                          {JSON.stringify(metadata[0].content, null, 2)}
                        </pre>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
} 