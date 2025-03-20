"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/utils/supabase';

interface ReportMatrixProps {
  projectId: string | null;
}

interface Report {
  id: string;
  project_id: string;
  content: any; // This will store the JSON report content
  created_at: string;
}

export default function ReportMatrix({ projectId }: ReportMatrixProps) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createBrowserClient();
  
  useEffect(() => {
    async function fetchLatestReport() {
      if (!projectId) {
        setReport(null);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch the latest report for the selected project
        const { data, error: reportError } = await supabase
          .from('reports')
          .select('*')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (reportError) throw reportError;
        
        if (data && data.length > 0) {
          setReport(data[0] as Report);
        } else {
          // If no report found in database, use the sample report from the local file
          // This is just for demonstration purposes
          const response = await fetch('/api/sample-report');
          if (!response.ok) throw new Error('Failed to fetch sample report');
          const sampleReport = await response.json();
          
          setReport({
            id: 'sample-report',
            project_id: projectId,
            content: sampleReport,
            created_at: new Date().toISOString()
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchLatestReport();
  }, [projectId]);
  
  if (!projectId) {
    return null;
  }
  
  if (loading) {
    return (
      <div className="w-full bg-foreground/5 p-6 rounded-lg mt-4">
        <h2 className="text-2xl font-bold mb-4">Latest Report</h2>
        <p>Loading report data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full bg-red-100 border border-red-300 text-red-700 p-4 rounded-lg mt-4">
        <h2 className="text-2xl font-bold mb-4">Latest Report</h2>
        <p><strong>Error:</strong> {error}</p>
      </div>
    );
  }
  
  if (!report) {
    return (
      <div className="w-full bg-foreground/5 p-6 rounded-lg mt-4">
        <h2 className="text-2xl font-bold mb-4">Latest Report</h2>
        <p>No report data available for this project.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full bg-foreground/5 p-6 rounded-lg mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Latest Report</h2>
        <div className="text-sm text-foreground/60">
          Generated: {new Date(report.created_at).toLocaleString()}
        </div>
      </div>
      
      <div className="bg-background border border-foreground/10 rounded-lg p-4 overflow-auto max-h-[500px]">
        <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(report.content, null, 2)}</pre>
      </div>
    </div>
  );
} 