import { IconX, IconEye, IconPlus, IconNote, IconCheck } from '@tabler/icons-react';
import { ModalPortal } from './ModalPortal';
import { toast } from 'sonner';

interface CallFollowUpTaskOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: any;
  onViewLead?: () => void;
  onCreateFollowupTask?: () => void;
  onAddNotes?: () => void;
  onMarkComplete?: () => void;
}

export const CallFollowUpTaskOptionsModal = ({
  isOpen,
  onClose,
  task,
  onViewLead,
  onCreateFollowupTask,
  onAddNotes,
  onMarkComplete,
}: CallFollowUpTaskOptionsModalProps) => {
  if (!isOpen || !task) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white/95 dark:bg-neutral-900/95 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
          <button
            className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-xl font-bold focus:outline-none hover:bg-blue-100/60 dark:hover:bg-blue-900/40 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            onClick={onClose}
            type="button"
            aria-label="Close options modal"
          >
            <IconX className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold mb-6 text-neutral-800 dark:text-neutral-100">Task Options</h2>
          <div className="flex flex-col gap-4">
            <button
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 font-medium hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={onViewLead || (() => toast.info('View Lead'))}
              aria-label="View Lead"
            >
              <IconEye className="w-5 h-5" /> View Lead
            </button>
            <button
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 font-medium hover:bg-green-100 dark:hover:bg-green-800/50 transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
              onClick={onCreateFollowupTask || (() => toast.info('Create Followup Task'))}
              aria-label="Create Followup Task"
            >
              <IconPlus className="w-5 h-5" /> Create Followup Task
            </button>
            <button
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-200 font-medium hover:bg-yellow-100 dark:hover:bg-yellow-800/50 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400"
              onClick={onAddNotes || (() => toast.info('Add Notes'))}
              aria-label="Add Notes"
            >
              <IconNote className="w-5 h-5" /> Add Notes
            </button>
            <button
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={onMarkComplete || (() => toast.info('Mark as Complete'))}
              aria-label="Mark as Complete"
            >
              <IconCheck className="w-5 h-5" /> Mark as Complete
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}; 