"use client";

import { ChevronDown, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import FormDetails from './FormDetails';

interface FormRowProps {
  formName: string;
  environments: string[];
  report: any;
  isExpanded: boolean;
  toggleForm: (formName: string) => void;
  showOnlyFaulty: boolean;
  toggleFaultyFilter: () => void;
  expandedQuestions: Record<string, boolean>;
  toggleQuestion: (questionId: string) => void;
  formStats: Record<string, any>;
}

export default function FormRow({
  formName,
  environments,
  report,
  isExpanded,
  toggleForm,
  showOnlyFaulty,
  toggleFaultyFilter,
  expandedQuestions,
  toggleQuestion,
  formStats
}: FormRowProps) {
  return (
    <>
      <tr>
        <td 
          className="border p-3 font-semibold bg-gray-50 cursor-pointer" 
          onClick={() => toggleForm(formName)}
        >
          <div className="flex items-center">
            {isExpanded ? 
              <ChevronDown size={16} className="mr-2" /> : 
              <ChevronRight size={16} className="mr-2" />}
            <span>{formName}</span>
          </div>
        </td>
        
        {environments.map(env => {
          const stats = formStats[env];
          if (!stats) return <td key={env} className="border p-3 text-center">N/A</td>;
          
          const cellColorClass = stats.percentage === 100 ? 'bg-green-100' : 
                               stats.percentage >= 80 ? 'bg-yellow-100' : 'bg-red-100';
          
          return (
            <td key={env} className={`border p-3 text-center ${cellColorClass}`}>
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold">{`${stats.percentage}%`}</span>
                <span className="text-sm">
                  {stats.missingFields > 0 ? (
                    <span className="flex items-center text-red-600">
                      <AlertCircle size={14} className="mr-1" />
                      {`${stats.missingFields} missing`}
                    </span>
                  ) : (
                    <span className="flex items-center text-green-600">
                      <CheckCircle size={14} className="mr-1" />
                      All found
                    </span>
                  )}
                </span>
              </div>
            </td>
          );
        })}
      </tr>
      
      {isExpanded && (
        <tr>
          <td colSpan={environments.length + 1} className="p-0 border">
            <FormDetails
              formName={formName}
              environments={environments}
              report={report}
              showOnlyFaulty={showOnlyFaulty}
              toggleFaultyFilter={toggleFaultyFilter}
              expandedQuestions={expandedQuestions}
              toggleQuestion={toggleQuestion}
            />
          </td>
        </tr>
      )}
    </>
  );
}
