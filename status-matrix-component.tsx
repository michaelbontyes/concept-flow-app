import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Download, 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Plus,
  FileText
} from 'lucide-react';

const StatusMatrix = () => {
  // Sample project information
  const [activeProject, setActiveProject] = useState({
    id: '6d9cddc4-802f-48a6-bddc-7d2038c5fa92',
    name: 'Iraq MHPSS Project'
  });
  
  // Combined report data from the provided JSON
  const [combinedReport, setCombinedReport] = useState({
    data: {},
    stats: {
      "OCL-Source": {
        "totalForms": 4,
        "formsCounted": 2,
        "missingExternalIds": 2
      },
      "OpenMRS-UAT": {
        "totalForms": 4,
        "formsCounted": 2,
        "missingExternalIds": 2
      }
    },
    mergedMeta: {
      "OCL-Source": "2025-03-20T02:57:52.533Z",
      "OpenMRS-UAT": "2025-03-20T02:57:52.729Z"
    },
    mergedReport: [
      {
        "datatype": {
          "value": "Text",
          "OpenMRS-UAT": "Missing"
        },
        "formName": "F00-Registration",
        "question": {
          "value": "First Name"
        },
        "dhis2DeUid": {
          "value": "fa7uwpCKIwa",
          "DHIS2-UAT": "Found"
        },
        "externalId": {
          "value": "c404d489-dcb9-44d9-9c30-c5a64ea0df25",
          "OCL-Source": "Found",
          "OpenMRS-UAT": "Missing"
        },
        "translation": {
          "value": "الاسم الأول",
          "OpenMRS-UAT": "Missing"
        }
      },
      {
        "datatype": {
          "value": "Text",
          "OpenMRS-UAT": "Found"
        },
        "formName": "F00-Registration",
        "question": {
          "value": "Middle Name (optional)"
        },
        "dhis2DeUid": {
          "value": "NA"
        },
        "externalId": {
          "value": "12342763-36db-42c0-998f-ae2226ad6a88",
          "OCL-Source": "Missing",
          "OpenMRS-UAT": "Missing"
        },
        "translation": {
          "value": "الاسم الأوسط (اختياري)",
          "OpenMRS-UAT": "Found"
        }
      },
      {
        "datatype": {
          "value": "Text",
          "OpenMRS-UAT": "Found"
        },
        "formName": "F00-Registration",
        "question": {
          "value": "Family Name"
        },
        "dhis2DeUid": {
          "value": "Jt9BhFZkvP2"
        },
        "externalId": {
          "value": "38ef5485-e67f-4a10-bf36-08304fe63877",
          "OCL-Source": "Found",
          "OpenMRS-UAT": "Found"
        },
        "translation": {
          "value": "اسم العائلة",
          "OpenMRS-UAT": "Found"
        }
      },
      {
        "answers": [
          {
            "answer": {
              "value": "Male",
              "OpenMRS-UAT": "Missing"
            },
            "externalId": {
              "value": "625baaf5-ba75-4c23-bdef-283fd47c34db",
              "OCL-Source": "Found"
            },
            "translation": {
              "value": "ذكر",
              "OpenMRS-UAT": "Missing"
            },
            "dhis2OptionUid": {
              "value": "eQkRH9GTjBN",
              "DHIS2-UAT": "Found"
            }
          },
          {
            "answer": {
              "value": "Female",
              "OpenMRS-UAT": "Found"
            },
            "externalId": {
              "value": "2ded9cfb-c089-4e1c-b032-7aa4a17882f7"
            },
            "translation": {
              "value": "انثى",
              "OpenMRS-UAT": "Found"
            },
            "dhis2OptionUid": {
              "value": "H61UkMHyNku",
              "DHIS2-UAT": "Missing"
            }
          },
          {
            "answer": {
              "value": "Other",
              "OpenMRS-UAT": "Found"
            },
            "externalId": {
              "value": "790b41ce-e1e7-11e8-b02f-0242ac130002"
            },
            "translation": {
              "value": "آخر",
              "OpenMRS-UAT": "Missing"
            },
            "dhis2OptionUid": {
              "value": "NA",
              "OpenMRS-UAT": "Missing"
            }
          },
          {
            "answer": {
              "value": "Unknown",
              "OpenMRS-UAT": "Found"
            },
            "externalId": {
              "value": "ccb4c50d-13e0-46a2-bd5e-51c86d042ad8",
              "OCL-Source": "Found"
            },
            "translation": {
              "value": "غير معروف ",
              "OpenMRS-UAT": "Found"
            },
            "dhis2OptionUid": {
              "value": "YJw3CPNftrE",
              "DHIS2-UAT": "Missing"
            }
          }
        ],
        "datatype": {
          "value": "Coded",
          "OpenMRS-UAT": "Found"
        },
        "formName": "F00-Registration",
        "question": {
          "value": "Sex",
          "OpenMRS-UAT": "Found"
        },
        "dhis2DeUid": {
          "value": "qptKDiv9uPl",
          "OpenMRS-UAT": "Found"
        },
        "externalId": {
          "value": "ec42d68d-3e23-43de-b8c5-a03bb538e7c7",
          "OCL-Source": "Missing",
          "OpenMRS-UAT": "Missing"
        },
        "translation": {
          "value": "الجنس",
          "OpenMRS-UAT": "Missing"
        },
        "optionSetName": {
          "value": "Sex - Male/Female/Other"
        }
      }
    ],
    missingExternalIds: {
      "OCL-Source": [
        "12342763-36db-42c0-998f-ae2226ad6a88",
        "ec42d68d-3e23-43de-b8c5-a03bb538e7c7"
      ],
      "OpenMRS-UAT": [
        "12342763-36db-42c0-998f-ae2226ad6a88",
        "ec42d68d-3e23-43de-b8c5-a03bb538e7c7"
      ]
    }
  });
  
  // State for expandable sections and selection
  const [expandedForms, setExpandedForms] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [selectedItems, setSelectedItems] = useState({
    questions: [],
    answers: []
  });
  
  const [activeTab, setActiveTab] = useState('deploy');
  
  // Helper functions to determine which environments to show based on the active tab
  const getEnvironmentsByTab = (tabKey) => {
    switch (tabKey) {
      case 'deploy':
        return Object.keys(combinedReport.stats).filter(env => env.includes('OpenMRS'));
      case 'metadata':
        return Object.keys(combinedReport.stats).filter(env => env.includes('OCL'));
      case 'integration':
        return Object.keys(combinedReport.mergedMeta).filter(env => env.includes('DHIS2'));
      default:
        return [];
    }
  };

  // Get unique form names from the combined report
  const getFormNames = () => {
    const formNames = combinedReport.mergedReport.map(item => item.formName);
    return [...new Set(formNames)];
  };

  // Calculate form statistics
  const calculateFormStats = (formName, environments) => {
    const formItems = combinedReport.mergedReport.filter(item => item.formName === formName);
    
    const stats = environments.reduce((acc, env) => {
      let totalFields = 0;
      let foundFields = 0;
      
      formItems.forEach(item => {
        // Check question fields
        ['externalId', 'question', 'translation', 'datatype', 'dhis2DeUid'].forEach(field => {
          if (item[field] && (item[field].value !== 'NA' && item[field].value !== '')) {
            if (env.includes('DHIS2') && field === 'dhis2DeUid') {
              totalFields++;
              if (item[field][env] === 'Found') foundFields++;
            } else if (!env.includes('DHIS2') && field !== 'dhis2DeUid') {
              // Skip DHIS2 specific fields for non-DHIS2 environments
              totalFields++;
              if (item[field][env] === 'Found') foundFields++;
            }
          }
        });
        
        // Check answer fields
        if (item.answers) {
          item.answers.forEach(answer => {
            ['externalId', 'answer', 'translation', 'dhis2OptionUid'].forEach(field => {
              if (answer[field] && (answer[field].value !== 'NA' && answer[field].value !== '')) {
                if (env.includes('DHIS2') && field === 'dhis2OptionUid') {
                  totalFields++;
                  if (answer[field][env] === 'Found') foundFields++;
                } else if (!env.includes('DHIS2') && field !== 'dhis2OptionUid') {
                  totalFields++;
                  if (answer[field][env] === 'Found') foundFields++;
                }
              }
            });
          });
        }
      });
      
      const percentage = totalFields > 0 ? Math.round((foundFields / totalFields) * 100) : 100;
      acc[env] = {
        totalFields,
        foundFields,
        missingFields: totalFields - foundFields,
        percentage,
        foundPercentage: `${percentage}% ${percentage === 100 ? '✅' : '❌'}`,
        missingPercentage: `${100 - percentage}% ${percentage === 100 ? '✅' : '❌'}`
      };
      
      return acc;
    }, {});
    
    return stats;
  };

  // Toggle form expansion
  const toggleForm = (formName) => {
    setExpandedForms({
      ...expandedForms,
      [formName]: !expandedForms[formName]
    });
  };

  // Toggle question/answer expansion
  const toggleQuestion = (questionId) => {
    setExpandedQuestions({
      ...expandedQuestions,
      [questionId]: !expandedQuestions[questionId]
    });
  };

  // Selection handling functions
  const toggleQuestionSelection = (questionId) => {
    if (selectedItems.questions.includes(questionId)) {
      setSelectedItems({
        ...selectedItems,
        questions: selectedItems.questions.filter(id => id !== questionId)
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        questions: [...selectedItems.questions, questionId]
      });
    }
  };

  const toggleAnswerSelection = (answerId) => {
    if (selectedItems.answers.includes(answerId)) {
      setSelectedItems({
        ...selectedItems,
        answers: selectedItems.answers.filter(id => id !== answerId)
      });
    } else {
      setSelectedItems({
        ...selectedItems,
        answers: [...selectedItems.answers, answerId]
      });
    }
  };

  // Select all missing items for an environment
  const selectAllMissingItems = (formName, env) => {
    const formItems = combinedReport.mergedReport.filter(item => item.formName === formName);
    
    const missingQuestionIds = formItems
      .filter(item => {
        return ['externalId', 'question', 'translation', 'datatype', 'dhis2DeUid'].some(field => 
          item[field] && item[field][env] === 'Missing'
        );
      })
      .map(item => item.externalId.value);
    
    let missingAnswerIds = [];
    formItems.forEach(item => {
      if (item.answers) {
        const answerIds = item.answers
          .filter(answer => 
            ['externalId', 'answer', 'translation', 'dhis2OptionUid'].some(field => 
              answer[field] && answer[field][env] === 'Missing'
            )
          )
          .map(answer => answer.externalId.value);
        
        missingAnswerIds = [...missingAnswerIds, ...answerIds];
      }
    });
    
    setSelectedItems({
      questions: [...new Set([...selectedItems.questions, ...missingQuestionIds])],
      answers: [...new Set([...selectedItems.answers, ...missingAnswerIds])]
    });
  };

  // Clear selected items
  const clearSelection = () => {
    setSelectedItems({
      questions: [],
      answers: []
    });
  };

  // Action handlers
  const handleTriggerReport = (environment) => {
    console.log(`Triggering new verification for ${environment}`);
  };

  const handleAddToSource = () => {
    console.log(`Adding ${selectedItems.questions.length} questions and ${selectedItems.answers.length} answers to OCL Source`);
  };

  const handleAddToCollection = () => {
    console.log(`Adding ${selectedItems.questions.length} questions and ${selectedItems.answers.length} answers to OCL Collection`);
  };

  const handleCloneUUID = (uuid) => {
    console.log(`Cloning UUID ${uuid}`);
  };

  const handleCreateUUID = () => {
    console.log(`Creating new UUID`);
  };

  // Render environment summary header
  const renderEnvironmentHeader = (environments) => {
    return (
      <tr>
        <th className="border p-3 bg-gray-100 w-1/4">Form Name</th>
        {environments.map(env => {
          const stats = combinedReport.stats[env];
          const syncedAt = new Date(combinedReport.mergedMeta[env]).toLocaleString();
          const foundPercentage = stats ? 
            Math.round((stats.formsCounted / stats.totalForms) * 100) : 0;
          
          return (
            <th key={env} className="border p-3 bg-gray-100">
              <div className="flex flex-col items-center">
                <span className="font-bold">{env}</span>
                <span className="text-sm">{foundPercentage}% {foundPercentage === 100 ? '✅' : '❌'}</span>
                <span className="text-xs text-gray-500">Updated: {syncedAt}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="mt-2 flex items-center"
                  onClick={() => handleTriggerReport(env)}
                >
                  <RefreshCw size={14} className="mr-1" />
                  Refresh
                </Button>
              </div>
            </th>
          );
        })}
      </tr>
    );
  };

  // Render form row with stats
  const renderFormRow = (formName, environments) => {
    const formStats = calculateFormStats(formName, environments);
    
    return (
      <>
        <tr>
          <td 
            className="border p-3 font-semibold bg-gray-50 cursor-pointer" 
            onClick={() => toggleForm(formName)}
          >
            <div className="flex items-center">
              {expandedForms[formName] ? 
                <ChevronDown size={16} className="mr-2" /> : 
                <ChevronRight size={16} className="mr-2" />}
              <span>{formName}</span>
            </div>
          </td>
          
          {environments.map(env => {
            const stats = formStats[env];
            if (!stats) return <td key={env} className="border p-3 text-center">N/A</td>;
            
            const cellColorClass = stats.percentage >= 90 ? 'bg-green-100' : 
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
                  {stats.missingFields > 0 && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-1 text-xs"
                      onClick={() => selectAllMissingItems(formName, env)}
                    >
                      Select Missing
                    </Button>
                  )}
                </div>
              </td>
            );
          })}
        </tr>
        
        {expandedForms[formName] && renderFormDetails(formName, environments)}
      </>
    );
  };

  // Render expanded form details
  const renderFormDetails = (formName, environments) => {
    const formItems = combinedReport.mergedReport.filter(item => item.formName === formName);
    
    return (
      <tr>
        <td colSpan={environments.length + 1} className="p-0">
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <h4 className="font-bold">{formName} Questions</h4>
                <span className="ml-2 text-sm text-gray-500">({formItems.length} items)</span>
              </div>
              <div className="flex gap-2">
                {(selectedItems.questions.length > 0 || selectedItems.answers.length > 0) && (
                  <>
                    <Button 
                      size="sm" 
                      onClick={handleAddToSource}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Add selected to OCL Source
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleAddToCollection}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Add selected to OCL Collection
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={clearSelection}
                    >
                      Clear Selection
                    </Button>
                  </>
                )}
                <Button 
                  size="sm" 
                  onClick={handleCreateUUID}
                  className="flex items-center ml-2"
                >
                  <Plus size={14} className="mr-1" />
                  Create New
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 w-8 text-center">
                      <Checkbox 
                        checked={formItems.length > 0 && 
                          formItems.every(item => selectedItems.questions.includes(item.externalId.value))}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedItems({
                              ...selectedItems,
                              questions: [...selectedItems.questions, ...formItems.map(item => item.externalId.value)]
                            });
                          } else {
                            setSelectedItems({
                              ...selectedItems,
                              questions: selectedItems.questions.filter(id => 
                                !formItems.find(item => item.externalId.value === id)
                              )
                            });
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
                  {formItems.map((item, idx) => {
                    const questionId = item.externalId.value;
                    const itemHasMissing = environments.some(env => {
                      return ['externalId', 'question', 'translation', 'datatype', 'dhis2DeUid'].some(
                        field => item[field] && item[field][env] === 'Missing'
                      );
                    });
                    
                    // Determine if this item has answers with problems
                    const hasAnswerProblems = item.answers && item.answers.some(answer => {
                      return environments.some(env => {
                        return ['externalId', 'answer', 'translation', 'dhis2OptionUid'].some(
                          field => answer[field] && answer[field][env] === 'Missing'
                        );
                      });
                    });
                    
                    return (
                      <React.Fragment key={questionId}>
                        <tr className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
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
                              <span>{item.question.value}</span>
                              {(itemHasMissing || hasAnswerProblems) && (
                                <AlertCircle size={16} className="ml-2 text-red-500" />
                              )}
                            </div>
                          </td>
                          <td className="p-2 font-mono text-xs">{questionId}</td>
                          
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
                            
                            const hasAllFields = missingFields.length === 0;
                            
                            return (
                              <td key={env} className="p-2 text-center">
                                {hasAllFields ? (
                                  <CheckCircle size={16} className="mx-auto text-green-500" />
                                ) : (
                                  <div className="flex flex-col items-center">
                                    <AlertCircle size={16} className="mx-auto text-red-500" />
                                    <span className="text-xs text-red-500 mt-1">
                                      Missing: {missingFields.join(', ')}
                                    </span>
                                  </div>
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
                                  navigator.clipboard.writeText(questionId);
                                }}
                              >
                                <Copy size={14} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0" 
                                title="Clone UUID" 
                                onClick={() => handleCloneUUID(questionId)}
                              >
                                <Copy size={14} className="rotate-90" />
                              </Button>
                              {itemHasMissing && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-8 w-8 p-0" 
                                    title="Add to OCL Source" 
                                    onClick={() => handleAddToSource([questionId])}
                                  >
                                    <Plus size={14} className="text-blue-600" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                        
                        {/* Render answers if expanded and there are answers */}
                        {expandedQuestions[questionId] && item.answers && renderAnswerRows(item.answers, environments)}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  // Render answer rows for a question
  const renderAnswerRows = (answers, environments) => {
    return answers.map((answer, idx) => {
      const answerId = answer.externalId.value;
      
      return (
        <tr key={answerId} className="bg-blue-50">
          <td className="p-2 text-center border-t">
            <Checkbox 
              checked={selectedItems.answers.includes(answerId)}
              onCheckedChange={() => toggleAnswerSelection(answerId)}
            />
          </td>
          <td className="p-2 border-t pl-8">
            <div className="flex items-center">
              <FileText size={14} className="mr-2 text-blue-600" />
              <span className="text-blue-800">Answer: {answer.answer.value}</span>
            </div>
          </td>
          <td className="p-2 border-t font-mono text-xs">{answerId}</td>
          
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
            
            const hasAllFields = missingFields.length === 0;
            
            return (
              <td key={env} className="p-2 border-t text-center">
                {hasAllFields ? (
                  <CheckCircle size={16} className="mx-auto text-green-500" />
                ) : (
                  <div className="flex flex-col items-center">
                    <AlertCircle size={16} className="mx-auto text-red-500" />
                    <span className="text-xs text-red-500 mt-1">
                      Missing: {missingFields.join(', ')}
                    </span>
                  </div>
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
                  navigator.clipboard.writeText(answerId);
                }}
              >
                <Copy size={14} />
              </Button>
              {environments.some(env => 
                ['externalId', 'answer', 'translation', 'dhis2OptionUid'].some(
                  field => answer[field] && answer[field][env] === 'Missing'
                )
              ) && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0" 
                  title="Add to OCL Source" 
                  onClick={() => handleAddToSource([], [answerId])}
                >
                  <Plus size={14} className="text-blue-600" />
                </Button>
              )}
            </div>