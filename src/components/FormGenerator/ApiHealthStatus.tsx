'use client';

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ApiHealthStatus() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const checkHealth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use environment variable for API URL
      const apiBaseUrl = process.env.NEXT_PUBLIC_CONCEPT_FLOW_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiBaseUrl}/health`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        setIsHealthy(true);
      } else {
        setIsHealthy(false);
        setError(`API returned status: ${response.status}`);
      }
    } catch (error) {
      console.error("Health check error:", error);
      setIsHealthy(false);
      setError("Failed to connect to API");
    } finally {
      setIsLoading(false);
      setIsStarting(false);
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleStartApi = async () => {
    setIsStarting(true);
    // Here you would typically call an endpoint to start the API
    // For now, we'll just re-check the health after a delay to simulate starting
    setTimeout(checkHealth, 2000);
  };

  return (
    <Alert variant={isHealthy ? "default" : "destructive"}>
      <div className="flex items-center gap-2">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isHealthy ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        
        <AlertDescription className="flex-grow">
          {isLoading
            ? "Checking API status..."
            : isHealthy
            ? "API is online and healthy"
            : `API is not responding: ${error || "Unknown error"}`}
        </AlertDescription>
        
        {!isLoading && !isHealthy && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleStartApi}
            disabled={isStarting}
            className="flex items-center gap-1"
          >
            {isStarting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Starting...</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                <span>Start API</span>
              </>
            )}
          </Button>
        )}
      </div>
    </Alert>
  );
}
