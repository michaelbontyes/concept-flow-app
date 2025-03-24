'use client';

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormUploaderProps {
  onJobCreated?: (jobId: string) => void;
}

export default function FormUploader({ onJobCreated }: FormUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [selectedSheets, setSelectedSheets] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setError(null);
    setSuccess(null);
    
    // If it's an Excel file, try to fetch sheet names
    if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_FORM_GENERATOR_API_URL}/sheets`, {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error response:", response.status, errorText);
          throw new Error(`Failed to get sheet names: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        console.log("API Response:", data);
        
        // Filter sheets that start with "F" followed by 2 digits
        const filteredSheets = (data.sheets || []).filter(
          (sheet: string) => {
            // Trim whitespace and check if it starts with F followed by 2 digits
            const trimmed = sheet.trim();
            return /^F\d{2}/.test(trimmed);
          }
        );

        // Add debugging to see what sheets are available
        console.log("All sheets:", data.sheets);
        console.log("Filtered sheets:", filteredSheets);
        
        setAvailableSheets(filteredSheets);
        setSelectedSheets(filteredSheets);
      } catch (error) {
        console.error("Error getting sheet names:", error);
        setError("Failed to read sheet names from the Excel file.");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    
    if (selectedSheets.length === 0 && availableSheets.length > 0) {
      setError("Please select at least one sheet to process");
      return;
    }
    
    setUploading(true);
    setError(null);
    setSuccess(null);
    
    const formData = new FormData();
    formData.append('metadata_file', file);
    
    // Add selected sheets to the request
    if (selectedSheets.length > 0) {
      formData.append('sheets', selectedSheets.join(','));
    }
    
    // Add preview mode parameter
    if (previewMode) {
      formData.append('preview_mode', 'true');
    }
    
    try {
      // Use environment variable instead of hardcoded URL
      const apiUrl = process.env.NEXT_PUBLIC_FORM_GENERATOR_API_URL || 'https://concept-flow-api.onrender.com/api/v1/form-generator';
      const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        body: formData,
      });
      
      console.log("Upload response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload error response:", response.status, errorText);
        throw new Error(`Upload failed: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Upload response data:", data);
      
      setSuccess("Form generation started successfully!");
      
      // If a job ID was returned and we have a callback, call it
      if (data.job_id && onJobCreated) {
        onJobCreated(data.job_id);
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFile(null);
      
    } catch (error) {
      console.error("Upload error:", error);
      setError(`Failed to upload file: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const toggleSheetSelection = (sheet: string) => {
    if (selectedSheets.includes(sheet)) {
      setSelectedSheets(selectedSheets.filter(s => s !== sheet));
    } else {
      setSelectedSheets([...selectedSheets, sheet]);
    }
  };

  const selectAllSheets = () => {
    setSelectedSheets([...availableSheets]);
  };

  const deselectAllSheets = () => {
    setSelectedSheets([]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file">Upload Excel File</Label>
        <Input
          ref={fileInputRef}
          id="file"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>
      
      {availableSheets.length > 0 && (
        <div className="space-y-2 border p-4 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <Label>Select Sheets to Process</Label>
            <div className="space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={selectAllSheets}
              >
                Select All
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={deselectAllSheets}
              >
                Deselect All
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2">
            {availableSheets.map(sheet => (
              <div key={sheet} className="flex items-center space-x-2">
                <Checkbox 
                  id={`sheet-${sheet}`}
                  checked={selectedSheets.includes(sheet)}
                  onCheckedChange={() => toggleSheetSelection(sheet)}
                />
                <Label 
                  htmlFor={`sheet-${sheet}`}
                  className="text-sm cursor-pointer"
                >
                  {sheet}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="preview-mode"
          checked={previewMode}
          onCheckedChange={(checked) => setPreviewMode(checked as boolean)}
        />
        <Label htmlFor="preview-mode">Preview Mode (Generate JSON without saving)</Label>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <Button 
        type="submit" 
        disabled={uploading || !file} 
        className="w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            {previewMode ? "Generate Preview" : "Upload and Generate Forms"}
          </>
        )}
      </Button>
    </form>
  );
}
