"use client";

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/utils/supabase';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertCircle, ChevronRight, ChevronDown } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('matrix');
  const [expandedForms, setExpandedForms] = useState<Record<string, boolean>>({});
  
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
  
  // Toggle form expansion
  const toggleForm = (formName: string) => {
    setExpandedForms({
      ...expandedForms,
      [formName]: !expandedForms[formName]
    });
  };

  // Get unique form names from the report
  const getFormNames = () => {
    if (!report?.content?.mergedReport) return [];
    const formNames = report.content.mergedReport.map((item: any) => item.formName);
    return [...new Set(formNames)];
  };

  // Get environments from the report
  const getEnvironments = () => {
    if (!report?.content?.stats) return [];
    return Object.keys(report.content.stats);
  };

  // Calculate form statistics for each environment
  const calculateFormStats = (formName: string, environments: string[]) => {
    if (!report?.content?.mergedReport) return {};
    
    const formItems = report.content.mergedReport.filter((item: any) => item.formName === formName);
    
    const stats = environments.reduce((acc: any, env: string) => {
      let totalFields = 0;
      let foundFields = 0;
      
      formItems.forEach((item: any) => {
        ['externalId', 'question', 'translation', 'datatype', 'dhis2DeUid'].forEach(field => {
          if (item[field] && item[field][env] !== undefined) {
            totalFields++;
            if (item[field][env] === 'Found') {
              foundFields++;
            }
          }
        });
      });
      
      const percentage = totalFields > 0 ? Math.round((foundFields / totalFields) * 100) : 100;
      acc[env] = {
        totalFields,
        foundFields,
        missingFields: totalFields - foundFields,
        percentage,
        foundPercentage: `${percentage}% ${percentage === 100 ? '✅' : '❌'}`,
        missingPercentage: `${100 - percentage}% ${percentage === 100 ? '✅' : '❌'}`
      };
      
      return acc;
    }, {});
    
    return stats;
  };

  // Render environment header
  const renderEnvironmentHeader = (environments: string[]) => {
    return (
      <tr>
        <th className="border p-3 bg-gray-100 w-1/4">Form Name</th>
        {environments.map(env => {
          const stats = report?.content?.stats[env];
          const syncedAt = report?.content?.mergedMeta?.[env] ? 
            new Date(report.content.mergedMeta[env]).toLocaleString() : 'N/A';
          
          return (
            <th key={env} className="border p-3 bg-gray-100">
              <div className="flex flex-col items-center">
                <span className="font-bold">{env}</span>
                <span className="text-xs text-gray-500">Updated: {syncedAt}</span>
              </div>
            </th>
          );
        })}
      </tr>
    );
  };

  // Render form row with stats
  const renderFormRow = (formName: string, environments: string[]) => {
    const formStats = calculateFormStats(formName, environments);
    
    return (
      <>
        <tr>
          <td 
            className="border p-3 font-semibold bg-gray-50 cursor-pointer" 
            onClick={() => toggleForm(formName)}
          >
            <div className="flex items-center">
              {expandedForms[formName] ? 
                <ChevronDown size={16} className="mr-2" /> : 
                <ChevronRight size={16} className="mr-2" />}
              <span>{formName}</span>
            </div>
          </td>
          
          {environments.map(env => {
            const stats = formStats[env];
            if (!stats) return <td key={env} className="border p-3 text-center">N/A</td>;
            
            const cellColorClass = stats.percentage >= 90 ? 'bg-green-100' : 
                                 stats.percentage >= 80 ? 'bg-yellow-100' : 'bg-red-100';
            
            return (
              <td key={env} className={`border p-3 text-center ${cellColorClass}`}>
                <div className="flex flex-col items-center">
                  <span className="font-bold">{stats.percentage}%</span>
                  <span className="text-xs">
                    {stats.foundFields}/{stats.totalFields} fields
                  </span>
                </div>
              </td>
            );
          })}
        </tr>
      </>
    );
  };

  // Render the matrix view
  const renderMatrixView = () => {
    const formNames = getFormNames();
    const environments = getEnvironments();
    
    if (formNames.length === 0 || environments.length === 0) {
      return <p>No form data available in the report.</p>;
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {renderEnvironmentHeader(environments)}
          </thead>
          <tbody>
            {formNames.map(formName => renderFormRow(formName, environments))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render the raw JSON view
  const renderRawView = () => {
    return (
      <div className="bg-background border border-foreground/10 rounded-lg p-4 overflow-auto max-h-[500px]">
        <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(report?.content, null, 2)}</pre>
      </div>
    );
  };

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
      
      <div className="w-full">
        <div className="mb-4 border-b">
          <button 
            className={`px-4 py-2 ${activeTab === 'matrix' ? 'border-b-2 border-primary font-medium' : ''}`}
            onClick={() => setActiveTab('matrix')}
          >
            Matrix View
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'raw' ? 'border-b-2 border-primary font-medium' : ''}`}
            onClick={() => setActiveTab('raw')}
          >
            Raw JSON
          </button>
        </div>
        
        <div>
          {activeTab === 'matrix' && renderMatrixView()}
          {activeTab === 'raw' && renderRawView()}
        </div>
      </div>
    </div>
  );
} 
