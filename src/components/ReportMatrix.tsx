"use client";

import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type EntityType = 'forms' | 'attributes' | 'identifiers';

interface EntityStatus {
  total: number;
  missing: number;
  missingIds?: string[];
  formName?: string; // Add this field
}

interface ReportMatrixProps {
  reportsByType: Record<string, any[]>;
  entityData: {
    forms: Record<string, EntityStatus>;
    attributes: Record<string, EntityStatus>;
    identifiers: Record<string, EntityStatus>;
  };
}

export default function ReportMatrix({ reportsByType, entityData }: ReportMatrixProps) {
  const [selectedCell, setSelectedCell] = useState<{
    reportType: string;
    entityType: EntityType;
    entityName: string;
    status: EntityStatus;
  } | null>(null);

  const reportTypes = Object.keys(reportsByType);
  
  // Group entities by form name
  const groupedEntities = {
    forms: Object.entries(entityData.forms).reduce((acc, [name, status]) => {
      if (!acc[status.formName || 'Ungrouped']) acc[status.formName || 'Ungrouped'] = [];
      acc[status.formName || 'Ungrouped'].push({ name, status });
      return acc;
    }, {} as Record<string, { name: string; status: EntityStatus }[]>),
    attributes: Object.entries(entityData.attributes).reduce((acc, [name, status]) => {
      if (!acc[status.formName || 'Ungrouped']) acc[status.formName || 'Ungrouped'] = [];
      acc[status.formName || 'Ungrouped'].push({ name, status });
      return acc;
    }, {} as Record<string, { name: string; status: EntityStatus }[]>),
    identifiers: Object.entries(entityData.identifiers).reduce((acc, [name, status]) => {
      if (!acc[status.formName || 'Ungrouped']) acc[status.formName || 'Ungrouped'] = [];
      acc[status.formName || 'Ungrouped'].push({ name, status });
      return acc;
    }, {} as Record<string, { name: string; status: EntityStatus }[]>),
  };

  const getCompletionPercentage = (status: EntityStatus) => {
    if (status.total === 0) return 100;
    return Math.round(((status.total - status.missing) / status.total) * 100);
  };

  const getCellColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-500/20 text-green-700";
    if (percentage >= 70) return "bg-yellow-500/20 text-yellow-700";
    return "bg-red-500/20 text-red-700";
  };

  return (
    <div className="overflow-x-auto">
      <Table className="border-collapse w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="border p-2 font-bold bg-foreground/5 sticky left-0 z-10">Entity</TableHead>
            {reportTypes.map(reportType => (
              <TableHead key={reportType} className="border p-2 font-bold bg-foreground/5 text-center">
                {reportType}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Forms Section - Grouped by form name */}
          <TableRow className="bg-foreground/10">
            <TableCell colSpan={reportTypes.length + 1} className="border p-2 font-bold">
              Forms
            </TableCell>
          </TableRow>
          {Object.entries(groupedEntities.forms).map(([formGroup, entities]) => (
            <React.Fragment key={`form-group-${formGroup}`}>
              <TableRow className="bg-foreground/5">
                <TableCell colSpan={reportTypes.length + 1} className="border p-2 font-semibold pl-4">
                  {formGroup}
                </TableCell>
              </TableRow>
              {entities.map(({ name, status }) => (
                <TableRow key={`form-${name}`}>
                  <TableCell className="border p-2 sticky left-0 bg-background z-10 pl-6">
                    {name}
                  </TableCell>
                  {reportTypes.map(reportType => {
                    const percentage = getCompletionPercentage(status);
                    const cellClass = getCellColor(percentage);
                    
                    return (
                      <Dialog key={`form-${name}-${reportType}`}>
                        <DialogTrigger asChild>
                          <TableCell 
                            className={`border p-2 text-center cursor-pointer hover:opacity-80 ${cellClass}`}
                            onClick={() => setSelectedCell({
                              reportType,
                              entityType: 'forms',
                              entityName: name,
                              status
                            })}
                          >
                            {percentage}%
                          </TableCell>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {name} - {reportType} Report
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <p className="mb-2">
                              <span className="font-semibold">Completion:</span> {percentage}% 
                              ({status.total - status.missing}/{status.total})
                            </p>
                            {status.missing > 0 && status.missingIds && (
                              <>
                                <p className="font-semibold mb-2">Missing IDs:</p>
                                <div className="max-h-96 overflow-y-auto border rounded p-2 bg-foreground/5">
                                  <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {status.missingIds.map(id => (
                                      <li key={id} className="text-sm font-mono">{id}</li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    );
                  })}
                </TableRow>
              ))}
            </React.Fragment>
          ))}

          {/* Attributes Section */}
          <TableRow className="bg-foreground/10">
            <TableCell colSpan={reportTypes.length + 1} className="border p-2 font-bold">
              Attributes
            </TableCell>
          </TableRow>
          {Object.entries(groupedEntities.attributes).map(([formGroup, entities]) => (
            <React.Fragment key={`attr-group-${formGroup}`}>
              <TableRow className="bg-foreground/5">
                <TableCell colSpan={reportTypes.length + 1} className="border p-2 font-semibold pl-4">
                  {formGroup}
                </TableCell>
              </TableRow>
              {entities.map(({ name, status }) => (
                <TableRow key={`attr-${name}`}>
                  <TableCell className="border p-2 sticky left-0 bg-background z-10 pl-6">
                    {name}
                  </TableCell>
                  {reportTypes.map(reportType => {
                    const percentage = getCompletionPercentage(status);
                    const cellClass = getCellColor(percentage);
                    
                    return (
                      <Dialog key={`attr-${name}-${reportType}`}>
                        <DialogTrigger asChild>
                          <TableCell 
                            className={`border p-2 text-center cursor-pointer hover:opacity-80 ${cellClass}`}
                            onClick={() => setSelectedCell({
                              reportType,
                              entityType: 'attributes',
                              entityName: name,
                              status
                            })}
                          >
                            {percentage}%
                          </TableCell>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {name} - {reportType} Report
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <p className="mb-2">
                              <span className="font-semibold">Completion:</span> {percentage}% 
                              ({status.total - status.missing}/{status.total})
                            </p>
                            {status.missing > 0 && status.missingIds && (
                              <>
                                <p className="font-semibold mb-2">Missing IDs:</p>
                                <div className="max-h-96 overflow-y-auto border rounded p-2 bg-foreground/5">
                                  <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {status.missingIds.map(id => (
                                      <li key={id} className="text-sm font-mono">{id}</li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    );
                  })}
                </TableRow>
              ))}
            </React.Fragment>
          ))}

          {/* Identifiers Section */}
          <TableRow className="bg-foreground/10">
            <TableCell colSpan={reportTypes.length + 1} className="border p-2 font-bold">
              Identifiers
            </TableCell>
          </TableRow>
          {Object.entries(groupedEntities.identifiers).map(([formGroup, entities]) => (
            <React.Fragment key={`id-group-${formGroup}`}>
              <TableRow className="bg-foreground/5">
                <TableCell colSpan={reportTypes.length + 1} className="border p-2 font-semibold pl-4">
                  {formGroup}
                </TableCell>
              </TableRow>
              {entities.map(({ name, status }) => (
                <TableRow key={`id-${name}`}>
                  <TableCell className="border p-2 sticky left-0 bg-background z-10 pl-6">
                    {name}
                  </TableCell>
                  {reportTypes.map(reportType => {
                    const percentage = getCompletionPercentage(status);
                    const cellClass = getCellColor(percentage);
                    
                    return (
                      <Dialog key={`id-${name}-${reportType}`}>
                        <DialogTrigger asChild>
                          <TableCell 
                            className={`border p-2 text-center cursor-pointer hover:opacity-80 ${cellClass}`}
                            onClick={() => setSelectedCell({
                              reportType,
                              entityType: 'identifiers',
                              entityName: name,
                              status
                            })}
                          >
                            {percentage}%
                          </TableCell>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {name} - {reportType} Report
                            </DialogTitle>
                          </DialogHeader>
                          <div className="mt-4">
                            <p className="mb-2">
                              <span className="font-semibold">Completion:</span> {percentage}% 
                              ({status.total - status.missing}/{status.total})
                            </p>
                            {status.missing > 0 && status.missingIds && (
                              <>
                                <p className="font-semibold mb-2">Missing IDs:</p>
                                <div className="max-h-96 overflow-y-auto border rounded p-2 bg-foreground/5">
                                  <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {status.missingIds.map(id => (
                                      <li key={id} className="text-sm font-mono">{id}</li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    );
                  })}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
