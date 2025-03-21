"use client";

import { Fragment } from 'react';
import { AlertCircle, CheckCircle, ChevronDown, ChevronRight, Copy } from 'lucide-react';

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
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">{formName} Details</h3>
        <div className="flex items-center">
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
              <th className="p-2 text-center">Actions</th>
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
                      
                      ['externalId', 'question', 'translation', 'datatype'].forEach(field => {
                        if (item[field] && item[field][env] === 'Missing') {
                          missingFields.push(field);
                        }
                      });
                      
                      if (env.includes('DHIS2') && item.dhis2DeUid && item.dhis2DeUid[env] === 'Missing') {
                        missingFields.push('dhis2DeUid');
                      }
                      
                      return (
                        <td key={env} className="p-2 text-center">
                          {missingFields.length > 0 ? (
                            <div className="text-red-500 text-sm">
                              <span className="flex items-center justify-center">
                                <AlertCircle size={14} className="mr-1" />
                                Missing
                              </span>
                              <div className="text-xs mt-1">
                                {missingFields.map(field => (
                                  <div key={field}>{field}</div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <span className="text-green-500 flex items-center justify-center">
                              <CheckCircle size={14} className="mr-1" />
                              Found
                            </span>
                          )}
                        </td>
                      );
                    })}
                    
                    <td className="p-2">
                      <div className="flex justify-center gap-1">
                        <button 
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Copy UUID" 
                          onClick={() => {
                            if (questionId) navigator.clipboard.writeText(questionId);
                          }}
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Render answers if this question has them and is expanded */}
                  {item.answers && item.answers.length > 0 && expandedQuestions[questionId] && (
                    <>
                      {item.answers.map((answer: any, answerIdx: number) => {
                        const answerId = answer.externalId?.value;
                        
                        return (
                          <tr key={answerId || `answer-${answerIdx}`} className="bg-gray-50/50">
                            <td className="p-2 pl-8 border-t">
                              <div className="flex items-center">
                                <span className="text-gray-500">↳</span>
                                <span className="ml-2">{answer.answer?.value || 'Unnamed Answer'}</span>
                              </div>
                            </td>
                            <td className="p-2 font-mono text-xs border-t">{answerId || 'No UUID'}</td>
                            
                            {environments.map(env => {
                              const missingFields = [];
                              
                              ['externalId', 'answer', 'translation'].forEach(field => {
                                if (answer[field] && answer[field][env] === 'Missing') {
                                  missingFields.push(field);
                                }
                              });
                              
                              if (env.includes('DHIS2') && answer.dhis2OptionUid && answer.dhis2OptionUid[env] === 'Missing') {
                                missingFields.push('dhis2OptionUid');
                              }
                              
                              return (
                                <td key={env} className="p-2 text-center">
                                  {missingFields.length > 0 ? (
                                    <div className="text-red-500 text-sm">
                                      <span className="flex items-center justify-center">
                                        <AlertCircle size={14} className="mr-1" />
                                        Missing
                                      </span>
                                      <div className="text-xs mt-1">
                                        {missingFields.map(field => (
                                          <div key={field}>{field}</div>
                                        ))}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-green-500 flex items-center justify-center">
                                      <CheckCircle size={14} className="mr-1" />
                                      Found
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                            
                            <td className="p-2">
                              <div className="flex justify-center gap-1">
                                <button 
                                  className="p-1 hover:bg-gray-100 rounded"
                                  title="Copy UUID" 
                                  onClick={() => {
                                    if (answerId) navigator.clipboard.writeText(answerId);
                                  }}
                                >
                                  <Copy size={14} />
                                </button>
                              </div>
                            </td>
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
