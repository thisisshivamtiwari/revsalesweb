import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { IconX, IconCheck, IconLoader2 } from '@tabler/icons-react';
import { completeTask } from '@/services/tasks';

interface TaskActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: {
    id: string;
    leadId: number;
    taskType: string;
    title: string;
  };
}

export const TaskActionModal = ({ isOpen, onClose, task }: TaskActionModalProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);

  if (!isOpen) return null;

  const handleAction = async () => {
    switch (task.taskType.toLowerCase()) {
      case 'proposal':
        router.push(`/create-proposal?leadId=${task.leadId}&taskId=${task.id}`);
        break;
      case 'audit':
        router.push(`/complete-audit?leadId=${task.leadId}&taskId=${task.id}`);
        break;
      case 'meeting':
      case 'intro meeting':
        router.push(`/create-meeting?leadId=${task.leadId}&taskId=${task.id}`);
        break;
      case 'call':
      case 'follow-up call':
        if (!showNotesInput) {
          setShowNotesInput(true);
          return;
        }
        await handleCompleteTask();
        break;
      default:
        await handleCompleteTask();
    }
  };

  const handleCompleteTask = async () => {
    try {
      setIsLoading(true);
      const response = await completeTask(task.id, task.leadId, notes);
      if (response.status) {
        toast.success('Task completed successfully');
        onClose();
      } else {
        toast.error(response.message || 'Failed to complete task');
      }
    } catch (error) {
      toast.error('An error occurred while completing the task');
    } finally {
      setIsLoading(false);
    }
  };

  const getActionButtonText = () => {
    if (isLoading) return 'Processing...';
    switch (task.taskType.toLowerCase()) {
      case 'proposal':
        return 'Create Proposal';
      case 'audit':
        return 'Complete Audit';
      case 'meeting':
      case 'intro meeting':
        return 'Schedule Meeting';
      case 'call':
      case 'follow-up call':
        return showNotesInput ? 'Complete Task' : 'Add Notes';
      default:
        return 'Complete Task';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
        >
          <IconX className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
          {task.title}
        </h2>

        {showNotesInput && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 backdrop-blur-sm transition-all duration-200"
              rows={4}
              placeholder="Add any notes about this task..."
            />
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleAction}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
          >
            {isLoading ? (
              <IconLoader2 className="w-4 h-4 animate-spin" />
            ) : (
              <IconCheck className="w-4 h-4" />
            )}
            {getActionButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}; 