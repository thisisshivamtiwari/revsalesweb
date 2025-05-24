"use client";

import { useEffect, useState } from 'react';
import {
  getLeadScriptQuestions,
  addOrUpdateScriptAnswers,
  ScriptStep,
  ScriptQuestion,
} from '@/services/leads';
import {
  IconChevronLeft,
  IconChevronRight,
  IconMessageQuestion,
  IconCheck,
  IconX,
  IconDeviceFloppy,
} from '@tabler/icons-react';

interface ScriptQuestionsTabProps {
  leadId: string | number;
}

type AnswersState = { [questionId: string]: string };

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

const ScriptQuestionsTab = ({ leadId }: ScriptQuestionsTabProps) => {
  const [steps, setSteps] = useState<ScriptStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [wizardName, setWizardName] = useState<string>('');
  const [wizardId, setWizardId] = useState<string>('');

  // Fetch script questions and initialize answers
  const fetchScriptQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLeadScriptQuestions(leadId);
      if (response.status && response.code === 200) {
        setSteps(response.data.wizard.steps);
        setWizardName(response.data.wizard.name);
        setWizardId(response.data.wizard.id);
        // Initialize answers from API
        const initialAnswers: AnswersState = {};
        response.data.wizard.steps.forEach((step) => {
          step.questions.forEach((q) => {
            initialAnswers[q.id] = q.answer || '';
          });
        });
        setAnswers(initialAnswers);
        setCurrentStep(0);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setSaveStatus('idle');
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!steps[currentStep]) return;
    setSaveStatus('saving');
    setSaveError(null);
    try {
      // Build the full wizard object with all steps and all questions/answers
      const wizard = {
        id: wizardId,
        name: wizardName,
        steps: steps.map((step) => ({
          id: step.id,
          name: step.name,
          stepNumber: step.stepNumber,
          questions: step.questions.map((q) => ({
            id: q.id,
            question: q.question,
            answer: answers[q.id] !== undefined ? answers[q.id] : q.answer || '',
          })),
        })),
      };
      const payload = {
        leadId,
        wizard,
      };
      const res = await addOrUpdateScriptAnswers(payload);
      if (res.status && res.code === 201) {
        // Update the answer field in steps for the current step's questions
        setSteps((prevSteps) => {
          const updatedSteps = prevSteps.map((step) => ({
            ...step,
            questions: step.questions.map((q) => ({
              ...q,
              answer: answers[q.id] !== undefined ? answers[q.id] : q.answer || '',
            })),
          }));
          return updatedSteps;
        });
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 1500);
      } else {
        setSaveStatus('error');
        setSaveError(res.message || 'Failed to save answers');
      }
    } catch (err) {
      setSaveStatus('error');
      setSaveError('Failed to save answers');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((i) => i - 1);
  };
  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep((i) => i + 1);
  };

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // Check if there are unsaved changes for the current step
  const hasUnsaved = step
    ? step.questions.some((q) => answers[q.id] !== q.answer)
    : false;

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
        <div className="max-w-2xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Step {currentStep + 1} of {steps.length}: <span className="font-semibold text-neutral-800 dark:text-neutral-100">{step.name}</span>
            </span>
            {saveStatus === 'success' && (
              <span className="flex items-center text-green-600 text-sm font-medium gap-1"><IconCheck className="w-4 h-4" /> Saved</span>
            )}
            {saveStatus === 'error' && (
              <span className="flex items-center text-red-600 text-sm font-medium gap-1"><IconX className="w-4 h-4" /> {saveError}</span>
            )}
          </div>
          {/* Questions Form */}
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            aria-label={`Questions for step ${step.name}`}
          >
            {step.questions.map((q, idx) => (
              <div key={q.id} className="flex flex-col gap-2">
                <label htmlFor={`question-${q.id}`} className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  Q{q.questionNumber}: {q.question}
                </label>
                <input
                  id={`question-${q.id}`}
                  type="text"
                  className="px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white/80 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={answers[q.id] !== undefined ? answers[q.id] : q.answer || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  aria-label={`Answer for question ${q.questionNumber}`}
                  tabIndex={0}
                />
              </div>
            ))}
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={handlePrev}
                disabled={isFirstStep || saveStatus === 'saving'}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous Step"
                tabIndex={0}
              >
                <IconChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={isLastStep || saveStatus === 'saving'}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next Step"
                tabIndex={0}
              >
                Next <IconChevronRight className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={saveStatus === 'saving' || !hasUnsaved}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow"
                aria-label="Save Answers"
                tabIndex={0}
              >
                {saveStatus === 'saving' ? (
                  <span className="flex items-center gap-1"><IconDeviceFloppy className="w-4 h-4 animate-spin" /> Saving...</span>
                ) : (
                  <span className="flex items-center gap-1"><IconDeviceFloppy className="w-4 h-4" /> Save</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ScriptQuestionsTab; 