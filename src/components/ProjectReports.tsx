'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/utils/supabase'
import { Button } from '@/components/ui/button'

export default function ProjectReports() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReports() {
      try {
        const supabase = createBrowserClient()
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setReports(data || [])
      } catch (err: any) {
        setError('Failed to load reports. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  if (loading) return <div className="p-8">Loading reports...</div>
  
  if (error) return (
    <div className="p-8 bg-red-50 text-red-700 rounded-lg">
      <p>{error}</p>
      <Button onClick={() => window.location.reload()} className="mt-4">
        Try Again
      </Button>
    </div>
  )

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Project Reports</h1>
      
      {reports.length === 0 ? (
        <div className="bg-foreground/5 p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-4">No Reports Found</h2>
          <p>There are no reports available for your projects yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reports.map((report: any) => (
            <div key={report.id} className="border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-medium">{report.project_id}</h3>
              <p className="text-sm text-muted-foreground">
                Created: {new Date(report.created_at).toLocaleString()}
              </p>
              <Button className="mt-4" variant="outline">
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
