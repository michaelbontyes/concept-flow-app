'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface JsonViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  jsonContent: string;
}

export default function JsonViewerModal({ isOpen, onClose, title, jsonContent }: JsonViewerModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Format JSON for display
  const formatJson = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return jsonString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>{title}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy JSON</span>
                </>
              )}
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto flex-grow">
          <pre className="p-4 bg-gray-50 rounded text-sm whitespace-pre-wrap">
            {formatJson(jsonContent)}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}