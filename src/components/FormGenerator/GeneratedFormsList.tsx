'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw, Download, Eye, Copy, FileText, Languages } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import JsonViewerModal from "./JsonViewerModal";

interface GeneratedFormsListProps {
  compact?: boolean;
  onRefresh?: () => void;
}

export default function GeneratedFormsList({ compact = false, onRefresh }: GeneratedFormsListProps) {
  const [forms, setForms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [formContent, setFormContent] = useState<string>("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerTitle, setViewerTitle] = useState<string>("");
  const [isTranslation, setIsTranslation] = useState(false);
  const [copiedForm, setCopiedForm] = useState<string | null>(null);

  const fetchForms = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_FORM_GENERATOR_API_URL;
      const response = await fetch(`${apiUrl}/forms`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch forms: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setForms(data.forms || []);
    } catch (error) {
      console.error("Error fetching forms:", error);
      setError(`Failed to fetch generated forms: ${error.message}`);
    } finally {
      setIsLoading(false);
      if (onRefresh) onRefresh();
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleViewForm = async (formName: string, isTranslation = false) => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_FORM_GENERATOR_API_URL || 'http://localhost:8000/api/v1/form-generator';
      const endpoint = isTranslation 
        ? `${apiUrl}/forms/${formName}/translation` 
        : `${apiUrl}/forms/${formName}`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${isTranslation ? 'translation' : 'form'} content`);
      }
      
      const data = await response.json();
      setFormContent(JSON.stringify(data));
      setSelectedForm(formName);
      setViewerTitle(isTranslation ? `${formName} Translation` : formName);
      setIsTranslation(isTranslation);
      setIsViewerOpen(true);
    } catch (error) {
      console.error(`Error fetching ${isTranslation ? 'translation' : 'form'} content:`, error);
      setError(`Failed to fetch ${isTranslation ? 'translation' : 'form'} content`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadForm = async (formName: string, isTranslation = false) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_FORM_GENERATOR_API_URL || 'http://localhost:8000/api/v1/form-generator';
      const endpoint = isTranslation 
        ? `${apiUrl}/forms/${formName}/translation?download=true` 
        : `${apiUrl}/forms/${formName}?download=true`;
      
      window.open(endpoint, '_blank');
    } catch (error) {
      console.error(`Error downloading ${isTranslation ? 'translation' : 'form'}:`, error);
      setError(`Failed to download ${isTranslation ? 'translation' : 'form'}`);
    }
  };

  const handleCopyForm = async (formName: string, isTranslation = false) => {
    try {
      setIsLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_FORM_GENERATOR_API_URL || 'http://localhost:8000/api/v1/form-generator';
      const endpoint = isTranslation 
        ? `${apiUrl}/forms/${formName}/translation` 
        : `${apiUrl}/forms/${formName}`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${isTranslation ? 'translation' : 'form'} content for copying`);
      }
      
      const data = await response.json();
      const jsonString = JSON.stringify(data, null, 2);
      
      await navigator.clipboard.writeText(jsonString);
      
      // Set copied form to show feedback
      setCopiedForm(`${formName}${isTranslation ? '-translation' : ''}`);
      setTimeout(() => setCopiedForm(null), 2000);
    } catch (error) {
      console.error(`Error copying ${isTranslation ? 'translation' : 'form'}:`, error);
      setError(`Failed to copy ${isTranslation ? 'translation' : 'form'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !forms.length) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !forms.length) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!forms.length) {
    return (
      <Alert>
        <AlertDescription>No generated forms found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className={compact ? "text-md font-medium" : "text-lg font-medium"}>
          Generated Forms ({forms.length})
        </h3>
        <Button variant="outline" size="sm" onClick={fetchForms}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form Name</TableHead>
              <TableHead className="w-[300px]">Form Actions</TableHead>
              <TableHead className="w-[300px]">Translation Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form}>
                <TableCell className="font-medium">{form}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewForm(form, false)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadForm(form, false)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopyForm(form, false)}
                    >
                      {copiedForm === form ? (
                        <>Copied!</>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewForm(form, true)}
                    >
                      <Languages className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadForm(form, true)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopyForm(form, true)}
                    >
                      {copiedForm === `${form}-translation` ? (
                        <>Copied!</>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <JsonViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        title={viewerTitle}
        jsonContent={formContent}
      />
    </div>
  );
}
