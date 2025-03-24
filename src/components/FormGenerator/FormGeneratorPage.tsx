'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiHealthStatus from "./ApiHealthStatus";
import FormUploader from "./FormUploader";
import FormMonitor from "./FormMonitor";
import GeneratedFormsList from "./GeneratedFormsList";

export default function FormGeneratorPage() {
  const [activeJobId, setActiveJobId] = useState<string | undefined>(undefined);

  const handleJobCreated = (jobId: string) => {
    setActiveJobId(jobId);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Form Generator</h1>
      
      <ApiHealthStatus />
      
      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload & Generate</TabsTrigger>
          <TabsTrigger value="manage">Manage Forms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <FormUploader onJobCreated={handleJobCreated} />
          <FormMonitor jobId={activeJobId} />
        </TabsContent>
        
        <TabsContent value="manage">
          <GeneratedFormsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
