'use client';

import { useState, useEffect, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import GeneratedFormsList from "./GeneratedFormsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FormMonitorProps {
  jobId?: string;
}

interface FormStatus {
  name: string;
  form_url?: string;
  translation_url?: string;
  preview?: boolean;
  form_data?: any;
  translation_data?: any;
  reason?: string;
}

interface JobStatus {
  status: string;
  progress?: number;
  total_forms: number;
  completed_forms: FormStatus[];
  failed_forms: FormStatus[];
  preview_mode: boolean;
  processed_sheets?: number;
  start_time?: string;
  end_time?: string;
  error?: string;
}

export default function FormMonitor({ jobId }: FormMonitorProps) {
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollingFrequency = 500; // Poll every 500ms for very responsive updates

  // Function to calculate progress percentage
  const calculateProgress = (status: JobStatus | null): number => {
    if (!status) return 0;
    
    const totalForms = status.total_forms || status.processed_sheets || 0;
    if (totalForms === 0) return 0;
    
    const completedCount = status.completed_forms.length;
    const failedCount = status.failed_forms.length;
    const processedCount = completedCount + failedCount;
    
    return Math.min(100, Math.round((processedCount / totalForms) * 100));
  };

  const checkStatus = async () => {
    if (!jobId) return;
    
    try {
      // Don't set loading state for subsequent polls to avoid UI flicker
      if (!status) {
        setIsLoading(true);
      }
      
      // Use environment variable for API URL with cache-busting query parameter
      const apiUrl = process.env.NEXT_PUBLIC_FORM_GENERATOR_API_URL || 'http://localhost:8000/api/v1/form-generator';
      const timestamp = new Date().getTime();
      const response = await fetch(`${apiUrl}/status/${jobId}?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch job status");
      }
      
      const data = await response.json();
      
      // Always calculate progress client-side to ensure consistency
      const calculatedProgress = calculateProgress(data);
      data.progress = calculatedProgress;
      
      setStatus(data);
      setLastUpdated(new Date());
      
      // Continue polling if job is still in progress
      if (data.status === 'queued' || data.status === 'processing') {
        // Poll frequently for better real-time updates
        if (pollingIntervalRef.current) {
          clearTimeout(pollingIntervalRef.current);
        }
        pollingIntervalRef.current = setTimeout(checkStatus, pollingFrequency);
      }
    } catch (error) {
      console.error("Error checking job status:", error);
      setError("Failed to check job status");
      
      // Retry after a short delay even on error
      if (pollingIntervalRef.current) {
        clearTimeout(pollingIntervalRef.current);
      }
      pollingIntervalRef.current = setTimeout(checkStatus, 2000); // Longer retry on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRefresh = () => {
    if (pollingIntervalRef.current) {
      clearTimeout(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    checkStatus();
  };

  useEffect(() => {
    // Clear any existing polling interval when jobId changes
    if (pollingIntervalRef.current) {
      clearTimeout(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    
    // Reset state when jobId changes
    if (jobId) {
      setStatus(null);
      setError(null);
      setLastUpdated(null);
      checkStatus();
    }
    
    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearTimeout(pollingIntervalRef.current);
      }
    };
  }, [jobId]);

  if (!jobId) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Job Status</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleManualRefresh} 
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isLoading && !status && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {status && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                {status.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : status.status === 'failed' ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}
                Job {jobId.substring(0, 8)}...
                <Badge variant={status.preview_mode ? "outline" : "default"}>
                  {status.preview_mode ? "Preview" : "Production"}
                </Badge>
              </CardTitle>
              <div className="text-sm text-muted-foreground flex flex-col items-end">
                <span>{status.progress}% Complete</span>
                {lastUpdated && (
                  <span className="text-xs">
                    Updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={status.progress} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{status.status}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Forms</p>
                <p className="font-medium">
                  {status.completed_forms.length + status.failed_forms.length} / {status.total_forms || status.processed_sheets || '?'} processed
                </p>
              </div>
            </div>
            
            {status.completed_forms.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Completed Forms ({status.completed_forms.length})</h4>
                <div className="max-h-40 overflow-y-auto space-y-1 border rounded-md p-2">
                  {status.completed_forms.map((form, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="truncate">{form.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {status.failed_forms.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2 text-red-500">Failed Forms ({status.failed_forms.length})</h4>
                <div className="max-h-40 overflow-y-auto space-y-1 border rounded-md p-2">
                  {status.failed_forms.map((form, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <span className="truncate">{form.name}</span>
                      {form.reason && (
                        <span className="text-xs text-red-400 truncate">({form.reason})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {status.status === 'completed' && (
              <div className="mt-4">
                <GeneratedFormsList compact={true} onRefresh={() => {}} />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
