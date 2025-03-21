"use client";

import { useState } from 'react';
import { AlertCircle, CheckCircle, ChevronDown, ChevronRight, Copy, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

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
  // Add state for selected items
  const [selectedItems, setSelectedItems] = useState<{
    questions: string[];
    answers: string[];
  }>({
    questions: [],
    answers: []
  });

  // Get form items from the report
  const formItems = report?.content?.mergedReport?.filter((item: any) => 
    item.formName === formName
  ) || [];
  
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

  // Toggle question selection
  const toggleQuestionSelection = (questionId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      questions: prev.questions.includes(questionId)
        ? prev.questions.filter(id => id !== questionId)
        : [...prev.questions, questionId]
    }));
  };

  // Toggle answer selection
  const toggleAnswerSelection = (answerId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      answers: prev.answers.includes(answerId)
        ? prev.answers.filter(id => id !== answerId)
        : [...prev.answers, answerId]
    }));
  };

  // Select all missing items for an environment
  const selectAllMissingItems = (env: string) => {
    const missingQuestionIds = formItems
      .filter(item => {
        return ['externalId', 'question', 'translation', 'datatype', 'dhis2DeUid'].some(field => 
          item[field] && item[field][env] === 'Missing'
        );
      })
      .map(item => item.externalId?.value)
      .filter(Boolean);
    
    let missingAnswerIds: string[] = [];
    formItems.forEach(item => {
      if (item.answers) {
        const answerIds = item.answers
          .filter(answer => 
            ['externalId', 'answer', 'translation', 'dhis2OptionUid'].some(field => 
              answer[field] && answer[field][env] === 'Missing'
            )
          )
          .map(answer => answer.externalId?.value)
          .filter(Boolean);
        
        missingAnswerIds = [...missingAnswerIds, ...answerIds];
      }
    });
    
    setSelectedItems({
      questions: [...new Set([...selectedItems.questions, ...missingQuestionIds])],
      answers: [...new Set([...selectedItems.answers, ...missingAnswerIds])]
    });
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedItems({
      questions: [],
      answers: []
    });
  };

  // Handle actions
  const handleAddToSource = (env: string) => {
    console.log(`Adding ${selectedItems.questions.length} questions and ${selectedItems.answers.length} answers to ${env} source`);
    // API call implementation
  };

  const handleCloneUUIDs = () => {
    console.log(`Cloning ${selectedItems.questions.length} questions and ${selectedItems.answers.length} answers`);
    // Implementation
  };

  return (
    <div className="p-4 bg-white">
      <div className="mb-2 flex justify-between items-center">
        <div className="flex items-center flex-wrap gap-2">
          {selectedItems.questions.length > 0 || selectedItems.answers.length > 0 ? (
            <>
              <span className="text-xs text-gray-600">
                {selectedItems.questions.length + selectedItems.answers.length} selected
              </span>
              <Button 
                size="xs" 
                variant="outline" 
                onClick={clearSelection}
                className="h-7 px-2 text-xs"
              >
                Clear
              </Button>
              <Button 
                size="xs" 
                variant="outline" 
                onClick={handleCloneUUIDs}
                className="h-7 px-2 text-xs"
              >
                Clone UUIDs
              </Button>
              <div className="flex flex-wrap gap-1">
                {environments.map(env => (
                  <Button 
                    key={env}
                    size="xs" 
                    variant="outline" 
                    onClick={() => handleAddToSource(env)}
                    className="h-7 px-2 text-xs"
                  >
                    {env}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <span className="text-xs text-gray-500">Select items to perform actions</span>
          )}
        </div>
        <div className="flex items-center">
          <Checkbox 
            id="show-faulty"
            checked={showOnlyFaulty} 
            onCheckedChange={toggleFaultyFilter}
            className="mr-1 h-3 w-3"
          />
          <label htmlFor="show-faulty" className="text-xs cursor-pointer">
            Show issues only
          </label>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 w-8 text-center">
                <Checkbox 
                  checked={filteredItems.length > 0 && 
                    filteredItems.every(item => selectedItems.questions.includes(item.externalId?.value))}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedItems(prev => ({
                        ...prev,
                        questions: [...new Set([
                          ...prev.questions, 
                          ...filteredItems
                            .map(item => item.externalId?.value)
                            .filter(Boolean)
                        ])]
                      }));
                    } else {
                      setSelectedItems(prev => ({
                        ...prev,
                        questions: prev.questions.filter(id => 
                          !filteredItems.find(item => item.externalId?.value === id)
                        )
                      }));
                    }
                  }}
                />
              </th>
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
                <>
                  <tr key={questionId || idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-2 text-center">
                      <Checkbox 
                        checked={selectedItems.questions.includes(questionId)}
                        onCheckedChange={() => toggleQuestionSelection(questionId)}
                      />
                    </td>
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
                        <span className="text-sm">{item.question?.value || 'Unnamed Question'}</span>
                        {(itemHasMissing || hasAnswerProblems) && (
                          <AlertCircle size={16} className="ml-2 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-2 font-mono text-xs text-gray-500 truncate max-w-[120px]">{questionId || 'No UUID'}</td>
                    
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
                    
                    <td className="p-2">
                      <div className="flex justify-center gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0" 
                          title="Copy UUID" 
                          onClick={() => {
                            if (questionId) navigator.clipboard.writeText(questionId);
                          }}
                        >
                          <Copy size={14} />
                        </Button>
                        {itemHasMissing && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0" 
                            title="Add to OCL Source" 
                            onClick={() => handleAddToSource('OCL')}
                          >
                            <Plus size={14} className="text-blue-600" />
                          </Button>
                        )}
                      </div>
                    </td>
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
                            <td className="p-2 text-center border-t">
                              <Checkbox 
                                checked={selectedItems.answers.includes(answerId)}
                                onCheckedChange={() => toggleAnswerSelection(answerId)}
                              />
                            </td>
                            <td className="p-2 pl-8 border-t">
                              <div className="flex items-center">
                                <span className="text-gray-500">↳</span>
                                <span className="ml-2 text-xs text-gray-700">{answer.answer?.value || 'Unnamed Answer'}</span>
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
                            
                            <td className="p-2 border-t">
                              <div className="flex justify-center gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-8 w-8 p-0" 
                                  title="Copy UUID" 
                                  onClick={() => {
                                    if (answerId) navigator.clipboard.writeText(answerId);
                                  }}
                                >
                                  <Copy size={14} />
                                </Button>
                                {answerHasMissing && (
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0" 
                                    title="Add to OCL Source" 
                                    onClick={() => handleAddToSource('OCL')}
                                  >
                                    <Plus size={14} className="text-blue-600" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
