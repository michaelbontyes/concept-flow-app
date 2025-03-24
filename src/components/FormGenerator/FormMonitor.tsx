'use client';

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import GeneratedFormsList from "./GeneratedFormsList";

interface FormMonitorProps {
  jobId?: string;
}

export default function FormMonitor({ jobId }: FormMonitorProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    const checkStatus = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use environment variable for API URL instead of hardcoded URL
        const apiUrl = process.env.NEXT_PUBLIC_FORM_GENERATOR_API_URL || 'http://localhost:8000/api/v1/form-generator';
        const response = await fetch(`${apiUrl}/status/${jobId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch job status");
        }
        
        const data = await response.json();
        
        setStatus(data.status);
        setProgress(data.progress || 0);
        
        // If job is still running, check again in a few seconds
        if (data.status === 'queued' || data.status === 'processing') {
          setTimeout(checkStatus, 3000);
        }
      } catch (error) {
        console.error("Error checking job status:", error);
        setError("Failed to check job status");
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [jobId]);

  if (!jobId) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Job Status</h3>
      
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
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="capitalize">{status}</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      <GeneratedFormsList compact={true} onRefresh={() => {}} />
    </div>
  );
}
