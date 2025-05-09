import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/utils/supabase';
import MatrixView from './report/MatrixView';
import RawView from './report/RawView';
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle, Copy, RefreshCw } from 'lucide-react';
import { Fragment } from 'react';
import EnvironmentStats, { calculateEnvironmentStats } from './report/EnvironmentStats';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

interface ReportMatrixProps {
  projectId: string | null;
}

interface Report {
  id: string;
  project_id: string;
  content: any;
  created_at: string;
}

export default function ReportMatrix({ projectId }: ReportMatrixProps) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'matrix' | 'raw'>('matrix');
  const [activeTab, setActiveTab] = useState<'matrix' | 'raw'>('matrix');
  const [expandedForms, setExpandedForms] = useState<Record<string, boolean>>({});
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [showOnlyFaulty, setShowOnlyFaulty] = useState(false);
  const [verificationResults, setVerificationResults] = useState<any[] | null>(null);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  
  // Add the triggerVerificationForAll function
  const triggerVerificationForAll = async (environments: string[]) => {
    try {
      // Show loading message
      console.log(`Triggering verification for ${environments.length} environments...`);
      
      // Make a single API call with all environments
      const response = await fetch('https://app.openfn.org/i/de51f57b-87c2-4b7d-837a-6b2b978f31f7', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          environments: environments,
          timestamp: new Date().toISOString(),
          action: 'trigger-verification'
        }),
      });
      
      // Create a single result object
      const results = [{
        environments: environments.join(', '),
        success: response.ok,
        status: response.status
      }];
      
      // Store results and show dialog
      setVerificationResults(results);
      setShowResultsDialog(true);
      
    } catch (error) {
      console.error('Error triggering verification:', error);
    }
  };

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

  // Toggle question expansion
  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions({
      ...expandedQuestions,
      [questionId]: !expandedQuestions[questionId]
    });
  };

  // Toggle faulty filter
  const toggleFaultyFilter = () => {
    setShowOnlyFaulty(!showOnlyFaulty);
  };

  // Get unique form names from the report
  const getFormNames = () => {
    if (!report?.content?.mergedReport) return [];
    const formNames = report.content.mergedReport.map((item: any) => item.formName);
    return [...new Set(formNames)].filter(Boolean); // Remove duplicates and empty values
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

  // Render form details when expanded
  const renderFormDetails = (formName: string, environments: string[]) => {
    if (!report?.content?.mergedReport) return null;
    
    const formItems = report.content.mergedReport.filter((item: any) => item.formName === formName);
    
    return (
      <tr>
        <td colSpan={environments.length + 1} className="border p-0">
          <div className="p-4 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 text-left">Question</th>
                    <th className="p-2 text-left">UUID</th>
                    {environments.map(env => (
                      <th key={env} className="p-2 text-center">{env}</th>
                    ))}
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formItems.map((item: any, idx: number) => {
                    const questionId = item.externalId?.value;
                    const itemHasMissing = environments.some(env => {
                      return ['externalId', 'question', 'translation', 'datatype', 'dhis2DeUid'].some(
                        field => item[field] && item[field][env] === 'Missing'
                      );
                    });
                    
                    // Determine if this item has answers with problems
                    const hasAnswerProblems = item.answers && item.answers.some((answer: any) => {
                      return environments.some(env => {
                        return ['externalId', 'answer', 'translation', 'dhis2OptionUid'].some(
                          field => answer[field] && answer[field][env] === 'Missing'
                        );
                      });
                    });
                    
                    return (
                      <Fragment key={questionId || idx}>
                        <tr className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="p-2 relative cursor-pointer" onClick={() => toggleQuestion(questionId)}>
                            <div className="flex items-center">
                              {(item.answers && item.answers.length > 0) ? (
                                <>
                                  {expandedQuestions[questionId] ? (
                                    <ChevronDown size={16} className="mr-2" />
                                  ) : (
                                    <ChevronRight size={16} className="mr-2" />
                                  )}
                                </>
                              ) : (
                                <span className="w-6"></span>
                              )}
                              <span>{item.question?.value || 'Unnamed Question'}</span>
                              {(itemHasMissing || hasAnswerProblems) && (
                                <AlertCircle size={16} className="ml-2 text-red-500" />
                              )}
                            </div>
                          </td>
                          <td className="p-2 font-mono text-xs">{questionId || 'No UUID'}</td>
                          
                          {environments.map(env => {
                            const missingFields = [];
                            
                            // Check which fields are missing for this environment
                            ['externalId', 'question', 'translation', 'datatype'].forEach(field => {
                              if (item[field] && item[field][env] === 'Missing') {
                                missingFields.push(field);
                              }
                            });
                            
                            // For DHIS2 environments, check DHIS2-specific fields
                            if (env.includes('DHIS2') && item.dhis2DeUid && item.dhis2DeUid[env] === 'Missing') {
                              missingFields.push('dhis2DeUid');
                            }
                            
                            return (
                              <td key={env} className="p-2 text-center">
                                {missingFields.length > 0 ? (
                                  <div className="text-red-500 text-sm">
                                    <span className="flex items-center justify-center">
                                      <AlertCircle size={14} className="mr-1" />
                                      Missing
                                    </span>
                                    <div className="text-xs mt-1">
                                      {missingFields.map(field => (
                                        <div key={field}>{field}</div>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-green-500 flex items-center justify-center">
                                    <CheckCircle size={14} className="mr-1" />
                                    Found
                                  </span>
                                )}
                              </td>
                            );
                          })}
                          
                          <td className="p-2">
                            <div className="flex justify-center gap-1">
                              <button 
                                className="p-1 hover:bg-gray-100 rounded"
                                title="Copy UUID" 
                                onClick={() => {
                                  if (questionId) navigator.clipboard.writeText(questionId);
                                }}
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Render answers if this question has them and is expanded */}
                        {item.answers && item.answers.length > 0 && expandedQuestions[questionId] && (
                          <>
                            {item.answers.map((answer: any, answerIdx: number) => {
                              const answerId = answer.externalId?.value;
                              
                              return (
                                <tr key={answerId || `answer-${answerIdx}`} className="bg-gray-50/50">
                                  <td className="p-2 pl-8 border-t">
                                    <div className="flex items-center">
                                      <span className="text-gray-500">↳</span>
                                      <span className="ml-2">{answer.answer?.value || 'Unnamed Answer'}</span>
                                    </div>
                                  </td>
                                  <td className="p-2 font-mono text-xs border-t">{answerId || 'No UUID'}</td>
                                  
                                  {environments.map(env => {
                                    const missingFields = [];
                                    
                                    // Check which fields are missing for this environment
                                    ['externalId', 'answer', 'translation'].forEach(field => {
                                      if (answer[field] && answer[field][env] === 'Missing') {
                                        missingFields.push(field);
                                      }
                                    });
                                    
                                    // For DHIS2 environments, check DHIS2-specific fields
                                    if (env.includes('DHIS2') && answer.dhis2OptionUid && answer.dhis2OptionUid[env] === 'Missing') {
                                      missingFields.push('dhis2OptionUid');
                                    }
                                    
                                    return (
                                      <td key={env} className="p-2 text-center border-t">
                                        {missingFields.length > 0 ? (
                                          <div className="text-red-500 text-sm">
                                            <span className="flex items-center justify-center">
                                              <AlertCircle size={14} className="mr-1" />
                                              Missing
                                            </span>
                                            <div className="text-xs mt-1">
                                              {missingFields.map(field => (
                                                <div key={field}>{field}</div>
                                              ))}
                                            </div>
                                          </div>
                                        ) : (
                                          <span className="text-green-500 flex items-center justify-center">
                                            <CheckCircle size={14} className="mr-1" />
                                            Found
                                          </span>
                                        )}
                                      </td>
                                    );
                                  })}
                                  
                                  <td className="p-2 border-t">
                                    <div className="flex justify-center gap-1">
                                      <button 
                                        className="p-1 hover:bg-gray-100 rounded"
                                        title="Copy UUID" 
                                        onClick={() => {
                                          if (answerId) navigator.clipboard.writeText(answerId);
                                        }}
                                      >
                                        <Copy size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </td>
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
            
            const cellColorClass = stats.percentage === 100 ? 'bg-green-100' : 
                                 stats.percentage >= 80 ? 'bg-yellow-100' : 'bg-red-100';
            
            return (
              <td key={env} className={`border p-3 text-center ${cellColorClass}`}>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-bold">{`${stats.percentage}%`}</span>
                  <span className="text-sm">
                    {stats.missingFields > 0 ? (
                      <span className="flex items-center text-red-600">
                        <AlertCircle size={14} className="mr-1" />
                        {`${stats.missingFields} missing`}
                      </span>
                    ) : (
                      <span className="flex items-center text-green-600">
                        <CheckCircle size={14} className="mr-1" />
                        All found
                      </span>
                    )}
                  </span>
                </div>
              </td>
            );
          })}
        </tr>
        
        {expandedForms[formName] && renderFormDetails(formName, environments)}
      </>
    );
  };

  // Render the matrix view
  const renderMatrixView = () => {
    if (!report?.content?.mergedReport) return <p>No report data available.</p>;
    
    const formNames = [...new Set(report.content.mergedReport.map((item: any) => item.formName))];
    const environments = Object.keys(report.content.mergedMeta || {});
    
    return (
      <div>
        <div className="mb-4 flex justify-end">
          <label className="flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={showOnlyFaulty} 
              onChange={() => setShowOnlyFaulty(!showOnlyFaulty)}
              className="mr-2"
            />
            <span>Show only items with issues</span>
          </label>
        </div>
        <MatrixView
          report={report}
          formNames={formNames}
          environments={environments}
          expandedForms={expandedForms}
          toggleForm={toggleForm}
          showOnlyFaulty={showOnlyFaulty}
          toggleFaultyFilter={() => setShowOnlyFaulty(!showOnlyFaulty)}
          expandedQuestions={expandedQuestions}
          toggleQuestion={toggleQuestion}
          calculateFormStats={calculateFormStats}
        />
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
    <>
      <div className="w-full bg-foreground/5 p-6 rounded-lg mt-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">Latest Report</h2>
            <div className="text-sm text-foreground/60 mt-1">
              Generated: {new Date(report.created_at).toLocaleString()}
            </div>
          </div>
          <Button 
            onClick={() => triggerVerificationForAll(Object.keys(report.content.stats))}
            className="flex items-center gap-2"
            size="sm"
          >
            <RefreshCw size={16} />
            <span>Trigger Verification</span>
          </Button>
        </div>

        {/* Summary stats section */}
        {report?.content?.mergedReport && (
          <EnvironmentStats environmentStats={calculateEnvironmentStats(report)} />
        )}

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

      {/* Results Dialog */}
      <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verification Results</DialogTitle>
            <DialogDescription>
              Results from triggering verification for {verificationResults?.length || 0} environments
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Environment</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {verificationResults?.map((result, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{result.environment}</td>
                    <td className="py-2">
                      <span className={`inline-flex items-center ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                        {result.success ? (
                          <><CheckCircle size={16} className="mr-1" /> Success</>
                        ) : (
                          <><AlertCircle size={16} className="mr-1" /> Failed ({result.status})</>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <Button onClick={() => setShowResultsDialog(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </>
  );
} 
