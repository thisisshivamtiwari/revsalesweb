import { toast } from 'sonner';

// context: { openModal: (task) => void }
export const handleTaskCardClick = (task: any, context: { openModal: (task: any) => void }) => {
  const type = (task.taskTypeName || '').toLowerCase();
  if (type === 'Call' || type === 'Follow-up') {
    // Open the custom modal with options (to be implemented in the component)
    context.openModal(task);
    // Commented out: previous code for handling call/follow up task types
    // ...
    return;
  }
  // For all other types, show under development toast
  toast.info('Under development');
}; 