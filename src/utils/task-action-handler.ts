import { toast } from 'sonner';

// context: { openModal: (task) => void }
export const handleTaskCardClick = (task: any, context: { openModal: (task: any) => void }) => {
  const type = (task.taskTypeName || '').toLowerCase();
  if (type === 'call' || type === 'follow-up') {
    // Always open the options modal for call and follow-up
    context.openModal(task);
    return;
  }
  // For all other types, show under development toast
  toast.info('Under development');
}; 