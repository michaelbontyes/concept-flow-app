"use client";

import { Fragment } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';

interface FormDetailsProps {
  formName: string;
  environments: string[];
  report: any;
  showOnlyFaulty: boolean;
  toggleFaultyFilter: () => void;
  expandedQuestions: Record<string, boolean>;
  toggleQuestion: (questionId: string) => void;
}

export default function FormDetails({
  formName,
  environments,
  report,
  showOnlyFaulty,
  toggleFaultyFilter,
  expandedQuestions,
  toggleQuestion
}: FormDetailsProps) {
  if (!report?.content?.mergedReport) return null;
  
  const formItems = report.content.mergedReport.filter((item: any) => item.formName === formName);
  
  // Filter items based on showOnlyFaulty flag
  const filteredItems = showOnlyFaulty 
    ? formItems.filter((item: any) => {
        const hasMissingFields = environments.some(env => {
          return ['externalId', 'question', 'translation', 'datatype', 'dhis2DeUid'].some(
            field => item[field] && item[field][env] === 'Missing'
          );
        });
        
        const hasAnswerProblems = item.answers && item.answers.some((answer: any) => {
          return environments.some(env => {
            return ['externalId', 'answer', 'translation', 'dhis2OptionUid'].some(
              field => answer[field] && answer[field][env] === 'Missing'
            );
          });
        });
        
        return hasMissingFields || hasAnswerProblems;
      })
    : formItems;
  
  return (
    <div className="p-4 bg-white">
      <div className="mb-4 flex justify-end">
        <label className="flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={showOnlyFaulty} 
            onChange={toggleFaultyFilter}
            className="mr-2"
          />
          <span>Show only items with issues</span>
        </label>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Question</th>
              <th className="p-2 text-left">UUID</th>
              {environments.map(env => (
                <th key={env} className="p-2 text-center">{env}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item: any, idx: number) => {
              const questionId = item.externalId?.value;
              const itemHasMissing = environments.some(env => {
                return ['externalId', 'question', 'translation', 'datatype', 'dhis2DeUid'].some(
                  field => item[field] && item[field][env] === 'Missing'
                );
              });
              
              const hasAnswerProblems = item.answers && item.answers.some((answer: any) => {
                return environments.some(env => {
                  return ['externalId', 'answer', 'translation', 'dhis2OptionUid'].some(
                    field => answer[field] && answer[field][env] === 'Missing'
                  );
                });
              });
              
              return (
                <Fragment key={questionId || idx}>
                  <tr className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-2 relative cursor-pointer" onClick={() => toggleQuestion(questionId)}>
                      <div className="flex items-center">
                        {(item.answers && item.answers.length > 0) ? (
                          <>
                            {expandedQuestions[questionId] ? (
                              <ChevronDown size={16} className="mr-2" />
                            ) : (
                              <ChevronRight size={16} className="mr-2" />
                            )}
                          </>
                        ) : (
                          <span className="w-6"></span>
                        )}
                        <span>{item.question?.value || 'Unnamed Question'}</span>
                        {(itemHasMissing || hasAnswerProblems) && (
                          <AlertCircle size={16} className="ml-2 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-2 font-mono text-xs">{questionId || 'No UUID'}</td>
                    
                    {environments.map(env => {
                      const missingFields = [];
                      
                      // Check which fields are missing for this environment
                      ['externalId', 'question', 'translation', 'datatype'].forEach(field => {
                        if (item[field] && item[field][env] === 'Missing') {
                          missingFields.push(field);
                        }
                      });
                      
                      // For DHIS2 environments, check DHIS2-specific fields
                      if (env.includes('DHIS2') && item.dhis2DeUid && item.dhis2DeUid[env] === 'Missing') {
                        missingFields.push('dhis2DeUid');
                      }
                      
                      return (
                        <td key={env} className="p-2 text-center">
                          {missingFields.length > 0 ? (
                            <div className="flex flex-col items-center">
                              <AlertCircle size={16} className="text-red-500" />
                              <div className="text-xs text-red-500 mt-1">
                                {missingFields.map(field => (
                                  <div key={field}>{field}</div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <CheckCircle size={16} className="mx-auto text-green-500" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  
                  {item.answers && item.answers.length > 0 && expandedQuestions[questionId] && (
                    <>
                      {item.answers.map((answer: any, ansIdx: number) => {
                        const answerId = answer.externalId?.value;
                        const answerHasMissing = environments.some(env => {
                          return ['externalId', 'answer', 'translation', 'dhis2OptionUid'].some(
                            field => answer[field] && answer[field][env] === 'Missing'
                          );
                        });
                        
                        if (showOnlyFaulty && !answerHasMissing) return null;
                        
                        return (
                          <tr key={answerId || `answer-${ansIdx}`} className="bg-gray-50/50">
                            <td className="p-2 pl-8 border-t">
                              <div className="flex items-center">
                                <span className="text-gray-500">↳</span>
                                <span className="ml-2">{answer.answer?.value || 'Unnamed Answer'}</span>
                              </div>
                            </td>
                            <td className="p-2 font-mono text-xs border-t">{answerId || 'No UUID'}</td>
                            
                            {environments.map(env => {
                              const missingFields = [];
                              
                              // Check which fields are missing for this environment
                              ['externalId', 'answer', 'translation'].forEach(field => {
                                if (answer[field] && answer[field][env] === 'Missing') {
                                  missingFields.push(field);
                                }
                              });
                              
                              // For DHIS2 environments, check DHIS2-specific fields
                              if (env.includes('DHIS2') && answer.dhis2OptionUid && answer.dhis2OptionUid[env] === 'Missing') {
                                missingFields.push('dhis2OptionUid');
                              }
                              
                              return (
                                <td key={env} className="p-2 text-center border-t">
                                  {missingFields.length > 0 ? (
                                    <div className="flex flex-col items-center">
                                      <AlertCircle size={16} className="text-red-500" />
                                      <div className="text-xs text-red-500 mt-1">
                                        {missingFields.map(field => (
                                          <div key={field}>{field}</div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <CheckCircle size={16} className="mx-auto text-green-500" />
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
