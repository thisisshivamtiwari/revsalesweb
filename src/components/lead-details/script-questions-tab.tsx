"use client";

import { useEffect, useState } from 'react';
import { getLeadScriptQuestions, ScriptStep, ScriptQuestion } from '@/services/leads';
import { IconChevronDown, IconChevronUp, IconMessageQuestion, IconCheck, IconX } from '@tabler/icons-react';

interface ScriptQuestionsTabProps {
  leadId: string | number;
}

const ScriptQuestionsTab = ({ leadId }: ScriptQuestionsTabProps) => {
  const [steps, setSteps] = useState<ScriptStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const fetchScriptQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLeadScriptQuestions(leadId);
      if (response.status && response.code === 200) {
        setSteps(response.data.wizard.steps);
        // Expand the first step by default
        if (response.data.wizard.steps.length > 0) {
          setExpandedStep(response.data.wizard.steps[0].id);
        }
      } else {
        setError(response.message || 'Failed to fetch script questions');
      }
    } catch (err) {
      setError('Failed to fetch script questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScriptQuestions();
  }, [leadId]);

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const getAnswerStatus = (answer: string) => {
    if (!answer) return 'unanswered';
    return answer.toLowerCase() === 'yes' ? 'yes' : 'no';
  };

  const getAnswerIcon = (answer: string) => {
    const status = getAnswerStatus(answer);
    switch (status) {
      case 'yes':
        return <IconCheck className="w-5 h-5 text-green-500" />;
      case 'no':
        return <IconX className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-neutral-700/30 p-4 md:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
          <IconMessageQuestion className="w-6 h-6 text-blue-500" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Script Questions
        </h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
            <IconMessageQuestion className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">{error}</h3>
        </div>
      ) : steps.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
            <IconMessageQuestion className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">No script questions found</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className="bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 overflow-hidden"
            >
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-700/50 transition-colors duration-200"
                aria-expanded={expandedStep === step.id}
              >
                <div className="flex items-center space-x-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium">
                    {step.stepNumber}
                  </span>
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                    {step.name}
                  </h3>
                </div>
                {expandedStep === step.id ? (
                  <IconChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <IconChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </button>
              {expandedStep === step.id && (
                <div className="px-6 pb-4 space-y-4">
                  {step.questions.map((question) => (
                    <div
                      key={question.id}
                      className="p-4 rounded-lg bg-neutral-50/50 dark:bg-neutral-700/50 border border-neutral-200/50 dark:border-neutral-700/50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                              Q{question.questionNumber}:
                            </span>
                            <p className="text-neutral-800 dark:text-neutral-100">
                              {question.question}
                            </p>
                          </div>
                          {question.answer && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                Answer:
                              </span>
                              <div className="flex items-center gap-2">
                                {getAnswerIcon(question.answer)}
                                <span className="text-neutral-700 dark:text-neutral-300">
                                  {question.answer}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScriptQuestionsTab; 