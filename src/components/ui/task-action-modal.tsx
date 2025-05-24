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
    taskTypeName: string;
    title: string;
  };
  onTaskCompleted?: () => void;
}

export const TaskActionModal = ({ isOpen, onClose, task, onTaskCompleted }: TaskActionModalProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAction = async () => {
    switch (task.taskTypeName.toLowerCase()) {
      case 'proposal':
        router.push(`/create-proposal?leadId=${task.leadId}&taskId=${task.id}`);
        break;
      case 'audit':
        router.push(`/complete-audit?leadId=${task.leadId}&taskId=${task.id}`);
        break;
      default:
        if (task.taskTypeName.toLowerCase() === 'meeting' || task.taskTypeName.toLowerCase() === 'intro meeting') {
          toast.info('Meeting functionality is under development');
          break;
        }
        await handleCompleteTask();
    }
  };

  const handleCompleteTask = async () => {
    try {
      setIsLoading(true);
      const response = await completeTask(task.id, task.leadId);
      if (response.status) {
        toast.success('Task completed successfully');
        if (onTaskCompleted) onTaskCompleted();
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

  const isCallOrFollowUp = task.taskTypeName.toLowerCase() === 'call' || task.taskTypeName.toLowerCase() === 'follow-up call';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-label="Close modal background" tabIndex={0} />
      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-neutral-200 dark:border-neutral-700 focus:outline-none" role="dialog" aria-modal="true" aria-label={task.title}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close modal"
          tabIndex={0}
        >
          <IconX className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-6">
          {task.title}
        </h2>

        <div className="flex flex-row gap-3 justify-end items-center mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/70 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Cancel"
            tabIndex={0}
          >
            Cancel
          </button>

          {isCallOrFollowUp ? (
            <button
              onClick={handleCompleteTask}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Complete Task"
              tabIndex={0}
            >
              {isLoading ? (
                <IconLoader2 className="w-4 h-4 animate-spin" />
              ) : (
                <IconCheck className="w-4 h-4" />
              )}
              Complete Task
            </button>
          ) : (
            <button
              onClick={handleAction}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Action"
              tabIndex={0}
            >
              {isLoading ? (
                <IconLoader2 className="w-4 h-4 animate-spin" />
              ) : (
                <IconCheck className="w-4 h-4" />
              )}
              {task.taskTypeName.toLowerCase() === 'proposal' ? 'Create Proposal' :
                task.taskTypeName.toLowerCase() === 'audit' ? 'Complete Audit' :
                (task.taskTypeName.toLowerCase() === 'meeting' || task.taskTypeName.toLowerCase() === 'intro meeting') ? 'Schedule Meeting' :
                'Complete Task'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 