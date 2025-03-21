"use client";

import FormRow from './FormRow';

interface MatrixViewProps {
  report: any;
  formNames: string[];
  environments: string[];
  expandedForms: Record<string, boolean>;
  toggleForm: (formName: string) => void;
  showOnlyFaulty: boolean;
  toggleFaultyFilter: () => void;
  expandedQuestions: Record<string, boolean>;
  toggleQuestion: (questionId: string) => void;
  calculateFormStats: (formName: string, environments: string[]) => Record<string, any>;
}

export default function MatrixView({
  report,
  formNames,
  environments,
  expandedForms,
  toggleForm,
  showOnlyFaulty,
  toggleFaultyFilter,
  expandedQuestions,
  toggleQuestion,
  calculateFormStats
}: MatrixViewProps) {
  if (formNames.length === 0 || environments.length === 0) {
    return <p>No form data available in the report.</p>;
  }

  const renderEnvironmentHeader = () => {
    return (
      <tr>
        <th className="border p-3 bg-gray-100 w-1/4">Form Name</th>
        {environments.map(env => {
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
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          {renderEnvironmentHeader()}
        </thead>
        <tbody>
          {formNames.map(formName => (
            <FormRow
              key={formName}
              formName={formName}
              environments={environments}
              report={report}
              isExpanded={expandedForms[formName] || false}
              toggleForm={toggleForm}
              showOnlyFaulty={showOnlyFaulty}
              toggleFaultyFilter={toggleFaultyFilter}
              expandedQuestions={expandedQuestions}
              toggleQuestion={toggleQuestion}
              formStats={calculateFormStats(formName, environments)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
