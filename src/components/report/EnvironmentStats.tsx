import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface EnvironmentStatsProps {
  environmentStats: Record<string, any>;
}

// Function to determine logo URL based on environment name
function getEnvironmentLogo(env: string): string | null {
  if (env.includes('OCL')) {
    return 'https://avatars.githubusercontent.com/u/3497578?s=280&v=4';
  } else if (env.includes('OpenMRS')) {
    return 'https://avatars.githubusercontent.com/u/860776?s=280&v=4';
  } else if (env.includes('DHIS2')) {
    return 'https://avatars.githubusercontent.com/u/1089987?s=280&v=4';
  }
  return null;
}

export function calculateEnvironmentStats(report: any) {
  if (!report?.content?.mergedReport) return {};
  
  const environments = Object.keys(report.content.stats || {});
  const allFormNames = getFormNames(report);
  const envStats = {};
  
  environments.forEach(env => {
    // Initialize counters
    let totalQuestions = 0;
    let foundQuestions = 0;
    let totalAnswers = 0;
    let foundAnswers = 0;
    const formsWithData = new Set();
    
    // Process each item in the merged report
    report.content.mergedReport.forEach((item: any) => {
      if (!item.formName) return;
      
      let hasFieldsForEnv = false;
      
      // Count this as a question
      totalQuestions++;
      
      // Check if question is found (all required fields are present)
      let questionFound = true;
      ['externalId', 'question', 'translation', 'datatype'].forEach(field => {
        if (item[field] && item[field][env] !== undefined && item[field][env] === 'Missing') {
          questionFound = false;
        }
      });
      
      // For DHIS2 environments, check DHIS2-specific fields
      if (env.includes('DHIS2') && item.dhis2DeUid && item.dhis2DeUid[env] === 'Missing') {
        questionFound = false;
      }
      
      if (questionFound) {
        foundQuestions++;
        hasFieldsForEnv = true;
      }
      
      // Count answers
      if (item.answers && Array.isArray(item.answers)) {
        item.answers.forEach((answer: any) => {
          totalAnswers++;
          
          // Check if answer is found (all required fields are present)
          let answerFound = true;
          ['externalId', 'answer', 'translation'].forEach(field => {
            if (answer[field] && answer[field][env] !== undefined && answer[field][env] === 'Missing') {
              answerFound = false;
            }
          });
          
          // For DHIS2 environments, check DHIS2-specific fields
          if (env.includes('DHIS2') && answer.dhis2OptionUid && answer.dhis2OptionUid[env] === 'Missing') {
            answerFound = false;
          }
          
          if (answerFound) {
            foundAnswers++;
            hasFieldsForEnv = true;
          }
        });
      }
      
      // If this form has any fields for this environment, count it
      if (hasFieldsForEnv) {
        formsWithData.add(item.formName);
      }
    });
    
    // Calculate percentages and prepare stats
    const totalItems = totalQuestions + totalAnswers;
    const foundItems = foundQuestions + foundAnswers;
    const completionPercentage = totalItems > 0 ? Math.round((foundItems / totalItems) * 100) : 100;
    
    // Get form counts
    const totalForms = allFormNames.length;
    const formsCounted = formsWithData.size;
    const formCompletionPercentage = totalForms > 0 ? Math.round((formsCounted / totalForms) * 100) : 100;
    
    // Store stats for this environment
    envStats[env] = {
      totalQuestions,
      foundQuestions,
      questionCompletionPercentage: totalQuestions > 0 ? Math.round((foundQuestions / totalQuestions) * 100) : 100,
      totalAnswers,
      foundAnswers,
      answerCompletionPercentage: totalAnswers > 0 ? Math.round((foundAnswers / totalAnswers) * 100) : 100,
      totalItems,
      foundItems,
      completionPercentage,
      totalForms,
      formsCounted,
      formCompletionPercentage
    };
  });
  
  return envStats;
}

// Helper function to get unique form names
function getFormNames(report: any) {
  if (!report?.content?.mergedReport) return [];
  const formNames = report.content.mergedReport.map((item: any) => item.formName);
  return [...new Set(formNames)].filter(Boolean); // Remove duplicates and empty values
}

export default function EnvironmentStats({ environmentStats }: EnvironmentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {Object.entries(environmentStats).map(([env, stats]: [string, any]) => {
        const logoUrl = getEnvironmentLogo(env);
        
        return (
          <div key={env} className="bg-white p-4 rounded-lg shadow-sm border border-foreground/10">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              {logoUrl && (
                <Image 
                  src={logoUrl} 
                  alt={`${env} logo`} 
                  width={24} 
                  height={24} 
                  className="mr-2 rounded-sm"
                />
              )}
              {env}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Forms stat */}
              <div className="bg-foreground/5 p-3 rounded flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Forms</span>
                  <span className={`text-lg font-bold ${
                    stats.formCompletionPercentage === 100 ? 'text-green-600' : 
                    stats.formCompletionPercentage >= 80 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {stats.formCompletionPercentage}%
                  </span>
                </div>
                <p className="text-xs text-foreground/60 self-end">
                  {stats.formsCounted}/{stats.totalForms} forms found
                </p>
              </div>
              
              {/* Questions stat */}
              <div className="bg-foreground/5 p-3 rounded flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Questions</span>
                  <span className={`text-lg font-bold ${
                    stats.questionCompletionPercentage === 100 ? 'text-green-600' : 
                    stats.questionCompletionPercentage >= 80 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {stats.questionCompletionPercentage}%
                  </span>
                </div>
                <p className="text-xs text-foreground/60 self-end">
                  {stats.foundQuestions}/{stats.totalQuestions} complete
                </p>
              </div>
              
              {/* Answers stat */}
              <div className="bg-foreground/5 p-3 rounded flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Answers</span>
                  <span className={`text-lg font-bold ${
                    stats.answerCompletionPercentage === 100 ? 'text-green-600' : 
                    stats.answerCompletionPercentage >= 80 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {stats.answerCompletionPercentage}%
                  </span>
                </div>
                <p className="text-xs text-foreground/60 self-end">
                  {stats.foundAnswers}/{stats.totalAnswers} complete
                </p>
              </div>
              
              {/* Overall completion stat */}
              <div className={`p-3 rounded flex flex-col ${
                stats.completionPercentage === 100 ? 'bg-green-50' : 
                stats.completionPercentage >= 80 ? 'bg-amber-50' : 'bg-red-50'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Overall</span>
                  <span className={`text-lg font-bold ${
                    stats.completionPercentage === 100 ? 'text-green-600' : 
                    stats.completionPercentage >= 80 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {stats.completionPercentage}%
                  </span>
                </div>
                <p className="text-xs text-foreground/60 self-end">
                  {stats.foundItems}/{stats.totalItems} items complete
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
