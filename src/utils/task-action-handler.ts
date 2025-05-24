import { toast } from 'sonner';

// context: { openAuditModal?: (task) => void, openModal?: (task) => void }
export const handleTaskCardClick = (
  task: any,
  context: {
    openAuditModal?: (task: any) => void;
    openModal?: (task: any) => void;
    // ...other modals as needed
  }
) => {
  const type = (task.taskTypeName || '').toLowerCase();
  if (type === 'audit' && context.openAuditModal) {
    context.openAuditModal(task);
    return;
  }
  if ((type === 'call' || type === 'follow-up') && context.openModal) {
    context.openModal(task);
    return;
  }
  toast.info('This functionality is under development');
}; 