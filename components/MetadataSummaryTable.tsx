'use client';

import React, { useMemo, useState } from 'react';

interface FormSummary {
  formName: string;
  totalConcepts: number;
  emrCount: number;
  emrPercentage: number;
  oclCount: number;
  oclPercentage: number;
  notCheckedConcepts: string[];
}

interface MetadataSummaryProps {
  metadata: Record<string, any> | null;
}

export default function MetadataSummaryTable({ metadata }: MetadataSummaryProps) {
  // State to track expanded form rows (using form name as key)
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const toggleRow = (formName: string) => {
    setExpandedRows((prev) =>
      prev.includes(formName) ? prev.filter((n) => n !== formName) : [...prev, formName]
    );
  };

  // Compute forms summary
  const formsSummary: FormSummary[] = useMemo(() => {
    const summaries: FormSummary[] = [];
    if (metadata && metadata.forms && typeof metadata.forms === 'object') {
      if (Array.isArray(metadata.forms)) {
        // If forms are provided as an array
        metadata.forms.forEach((form: any, index: number) => {
          const formName = form.name || form.display || `Form ${index + 1}`;
          const formConcepts = form.concepts || [];
          const totalConcepts = formConcepts.length;
          if (totalConcepts === 0) return;
          const emrCount = formConcepts.filter(
            (c: any) => c.status === true || c.status === 'Checked'
          ).length;
          const oclCount = formConcepts.filter(
            (c: any) => c.oclStatus === true || c.oclStatus === 'Checked'
          ).length;
          const notCheckedConcepts = formConcepts
            .filter((c: any) =>
              c.status === 'Not Checked' ||
              c.status === 'Not Found' ||
              c.oclStatus === 'Not Checked' ||
              c.oclStatus === 'Not Found'
            )
            .map((c: any) => c.uuid);
          summaries.push({
            formName,
            totalConcepts,
            emrCount,
            emrPercentage: totalConcepts > 0 ? (emrCount / totalConcepts) * 100 : 0,
            oclCount,
            oclPercentage: totalConcepts > 0 ? (oclCount / totalConcepts) * 100 : 0,
            notCheckedConcepts,
          });
        });
      } else {
        // If forms are provided as an object with keys mapping to arrays of concepts
        for (const formKey in metadata.forms) {
          if (Object.prototype.hasOwnProperty.call(metadata.forms, formKey)) {
            const formItems = metadata.forms[formKey];
            if (!Array.isArray(formItems)) continue;
            const totalConcepts = formItems.length;
            if (totalConcepts === 0) continue;
            const emrCount = formItems.filter(
              (item: any) => item.status === true || item.status === 'Checked'
            ).length;
            const oclCount = formItems.filter(
              (item: any) => item.oclStatus === true || item.oclStatus === 'Checked'
            ).length;
            const notCheckedConcepts = formItems
              .filter((item: any) =>
                item.status === 'Not Checked' ||
                item.status === 'Not Found' ||
                item.oclStatus === 'Not Checked' ||
                item.oclStatus === 'Not Found'
              )
              .map((item: any) => item.uuid);
            summaries.push({
              formName: formKey,
              totalConcepts,
              emrCount,
              emrPercentage: totalConcepts > 0 ? (emrCount / totalConcepts) * 100 : 0,
              oclCount,
              oclPercentage: totalConcepts > 0 ? (oclCount / totalConcepts) * 100 : 0,
              notCheckedConcepts,
            });
          }
        }
      }
    }
    return summaries;
  }, [metadata]);

  // Compute totals for forms
  const formsTotals = useMemo(() => {
    if (formsSummary.length === 0) return null;
    const totalConcepts = formsSummary.reduce((sum, form) => sum + form.totalConcepts, 0);
    const totalEmrCount = formsSummary.reduce((sum, form) => sum + form.emrCount, 0);
    const totalOclCount = formsSummary.reduce((sum, form) => sum + form.oclCount, 0);
    return {
      totalConcepts,
      emrPercentage: totalConcepts > 0 ? (totalEmrCount / totalConcepts) * 100 : 0,
      oclPercentage: totalConcepts > 0 ? (totalOclCount / totalConcepts) * 100 : 0,
      totalEmrCount,
      totalOclCount,
    };
  }, [formsSummary]);

  // Compute attributes data – list each attribute individually
  const attributesData = useMemo(() => {
    if (metadata && Array.isArray(metadata.attributes)) {
      return metadata.attributes;
    }
    return [];
  }, [metadata]);

  // Compute totals for attributes
  const attributesTotals = useMemo(() => {
    if (attributesData.length === 0) return null;
    const total = attributesData.length;
    const totalEmrCount = attributesData.filter(
      (attr: any) => attr.status === true || attr.status === 'Checked'
    ).length;
    const totalOclCount = attributesData.filter(
      (attr: any) => attr.oclStatus === true || attr.oclStatus === 'Checked'
    ).length;
    return {
      total,
      emrPercentage: total > 0 ? (totalEmrCount / total) * 100 : 0,
      oclPercentage: total > 0 ? (totalOclCount / total) * 100 : 0,
      totalEmrCount,
      totalOclCount,
    };
  }, [attributesData]);

  // Compute identifiers data – use the "identifiers" array from metadata
  const identifierData = useMemo(() => {
    if (metadata && Array.isArray(metadata.identifiers)) {
      return metadata.identifiers;
    }
    return [];
  }, [metadata]);

  // Compute totals for identifiers
  const identifiersTotals = useMemo(() => {
    if (identifierData.length === 0) return null;
    const total = identifierData.length;
    const totalEmrCount = identifierData.filter(
      (id: any) => id.status === true || id.status === 'Checked'
    ).length;
    const totalOclCount = identifierData.filter(
      (id: any) => id.oclStatus === true || id.oclStatus === 'Checked'
    ).length;
    return {
      total,
      emrPercentage: total > 0 ? (totalEmrCount / total) * 100 : 0,
      oclPercentage: total > 0 ? (totalOclCount / total) * 100 : 0,
      totalEmrCount,
      totalOclCount,
    };
  }, [identifierData]);

  return (
    <div className="space-y-12">
      {/* Forms Summary Section */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-900">
          Forms Summary
          {formsTotals &&
            ` (Total Coverage: EMR: ${formsTotals.emrPercentage.toFixed(1)}%, OCL: ${formsTotals.oclPercentage.toFixed(1)}%)`}
        </h3>
        {formsSummary.length === 0 ? (
          <p className="text-gray-600">No forms or concepts found in metadata.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Form Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Concepts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Found in EMR
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Found in OCL
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formsSummary.map((row, index) => (
                  <React.Fragment key={index}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.notCheckedConcepts && row.notCheckedConcepts.length > 0 && (
                          <button
                            onClick={() => toggleRow(row.formName)}
                            className="mr-2 focus:outline-none"
                          >
                            {expandedRows.includes(row.formName) ? '▼' : '►'}
                          </button>
                        )}
                        {row.formName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row.totalConcepts}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm text-gray-900">
                            {row.emrPercentage.toFixed(1)}%
                          </div>
                          <div className="ml-2 w-24 bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${row.emrPercentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 ml-2">
                            ({row.emrCount}/{row.totalConcepts})
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm text-gray-900">
                            {row.oclPercentage.toFixed(1)}%
                          </div>
                          <div className="ml-2 w-24 bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-green-600 h-2.5 rounded-full"
                              style={{ width: `${row.oclPercentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 ml-2">
                            ({row.oclCount}/{row.totalConcepts})
                          </div>
                        </div>
                      </td>
                    </tr>
                    {row.notCheckedConcepts &&
                      row.notCheckedConcepts.length > 0 &&
                      expandedRows.includes(row.formName) && (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 bg-gray-50">
                            <strong>Concept UUIDs not checked/found:</strong>
                            <ul className="list-disc pl-5 mt-2">
                              {row.notCheckedConcepts.map((uuid) => (
                                <li key={uuid} className="text-sm text-gray-600">
                                  {uuid}
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      )}
                  </React.Fragment>
                ))}
                {formsTotals && (
                  <tr className="bg-gray-100 font-semibold">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Total for Forms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formsTotals.totalConcepts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formsTotals.emrPercentage.toFixed(1)}% ({formsTotals.totalEmrCount}/{formsTotals.totalConcepts})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formsTotals.oclPercentage.toFixed(1)}% ({formsTotals.totalOclCount}/{formsTotals.totalConcepts})
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Attributes Summary Section */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-900">
          Attributes Summary
          {attributesTotals &&
            ` (Total Coverage: EMR: ${attributesTotals.emrPercentage.toFixed(1)}%, OCL: ${attributesTotals.oclPercentage.toFixed(1)}%)`}
        </h3>
        {attributesData.length === 0 ? (
          <p className="text-gray-600">No attributes found in metadata.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attribute UUID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EMR Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OCL Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attributesData.map((attr: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {attr.uuid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attr.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attr.oclStatus}
                    </td>
                  </tr>
                ))}
                {attributesTotals && (
                  <tr className="bg-gray-100 font-semibold">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Total Attributes
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attributesTotals.emrPercentage.toFixed(1)}% ({attributesTotals.totalEmrCount}/{attributesTotals.total})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attributesTotals.oclPercentage.toFixed(1)}% ({attributesTotals.totalOclCount}/{attributesTotals.total})
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Identifiers Summary Section */}
      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-900">
          Identifiers Summary
          {identifiersTotals &&
            ` (Total Coverage: EMR: ${identifiersTotals.emrPercentage.toFixed(1)}%, OCL: ${identifiersTotals.oclPercentage.toFixed(1)}%)`}
        </h3>
        {identifierData.length === 0 ? (
          <p className="text-gray-600">No identifiers found in metadata.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Identifier UUID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EMR Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OCL Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {identifierData.map((id: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {id.uuid}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {id.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {id.oclStatus}
                    </td>
                  </tr>
                ))}
                {identifiersTotals && (
                  <tr className="bg-gray-100 font-semibold">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Total Identifiers
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {identifiersTotals.emrPercentage.toFixed(1)}% ({identifiersTotals.totalEmrCount}/{identifiersTotals.total})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {identifiersTotals.oclPercentage.toFixed(1)}% ({identifiersTotals.totalOclCount}/{identifiersTotals.total})
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
