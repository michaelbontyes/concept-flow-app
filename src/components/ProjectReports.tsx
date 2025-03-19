'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/utils/supabase'
import ReportCard from './ReportCard'

export default function ProjectReports() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const supabase = createBrowserClient()
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) throw userError
        
        if (!user) {
          setLoading(false)
          return
        }
        
        // Get user's organizations
        const { data: orgs, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('members', user.id)
        
        if (orgError) throw orgError
        
        if (!orgs || orgs.length === 0) {
          setLoading(false)
          return
        }
        
        // Get projects for these organizations with their reports
        const orgIds = orgs.map(org => org.id)
        const { data: projectsData, error: projError } = await supabase
          .from('projects')
          .select(`
            id, 
            name, 
            description,
            organization_id,
            reports (*)
          `)
          .in('organization_id', orgIds)
          .order('created_at', { ascending: false })
        
        if (projError) throw projError
        
        // Add console logs to debug
        console.log('Projects data:', projectsData);
        
        // Process projects to get reports grouped by type
        const processedProjects = projectsData.map(project => {
          console.log(`Processing project ${project.id} with ${project.reports?.length || 0} reports`);
          
          // Group reports by type
          const reportsByType = project.reports?.reduce((acc, report) => {
            if (!acc[report.report_type]) {
              acc[report.report_type] = [];
            }
            acc[report.report_type].push(report);
            return acc;
          }, {}) || {};
          
          console.log(`Project ${project.id} reports by type:`, reportsByType);
          
          return {
            ...project,
            reportsByType
          }
        });
        
        setProjects(processedProjects)
        
        // Select the first project by default if available
        if (processedProjects.length > 0) {
          setSelectedProject(processedProjects[0])
          console.log('Selected project:', processedProjects[0]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Project Reports</h1>
      
      {projects.length === 0 ? (
        <p className="text-gray-400">No projects found</p>
      ) : (
        <div className="space-y-12">
          {/* Project selection */}
          <div className="flex flex-1 flex-col gap-6">
            <h2 className="mb-4 text-4xl font-bold">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-4">
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
                  <p className="text-lg font-semibold text-foreground/90">{project.name || 'Unnamed Project'}</p>
                  {project.description && (
                    <p className="text-sm text-foreground/80 mt-1">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Selected project reports by type */}
          {selectedProject && (
            <div className="flex flex-1 flex-col gap-6 mt-8">
              <h2 className="mb-4 text-4xl font-bold">
                Reports for {selectedProject.name || 'Selected Project'}
              </h2>
              
              {!selectedProject.reportsByType || Object.keys(selectedProject.reportsByType).length === 0 ? (
                <p className="mx-4 text-sm text-foreground/80">No reports found for this project</p>
              ) : (
                <div className="space-y-8">
                  {Object.entries(selectedProject.reportsByType).map(([type, reports]) => (
                    <div key={type} className="mx-4">
                      <h3 className="text-lg font-semibold text-foreground/90 mb-3">{type} Reports</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-6">
                        {Array.isArray(reports) ? reports.map(report => (
                          <ReportCard key={report.id} report={report} />
                        )) : (
                          <p className="text-sm text-foreground/80">Error: Reports data is not in expected format</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
