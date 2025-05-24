import { useState } from 'react';
import { IconX, IconLoader2 } from '@tabler/icons-react';
import { addLeadNotes } from '@/services/leads';
import { toast } from 'sonner';
import { ModalPortal } from '@/components/ui/ModalPortal';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: number;
  onNoteAdded: () => void;
}

export const AddNoteModal = ({ isOpen, onClose, leadId, onNoteAdded }: AddNoteModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await addLeadNotes({
        notes: [{
          leadId,
          title: title.trim(),
          description: description.trim()
        }]
      });
      toast.success('Note added successfully');
      onNoteAdded();
      onClose();
      setTitle('');
      setDescription('');
    } catch (error) {
      toast.error('Failed to add note');
      console.error('Error adding note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <form
          className="bg-white/95 dark:bg-neutral-900/95 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative"
          onSubmit={handleSubmit}
        >
          <button
            className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-xl font-bold focus:outline-none hover:bg-blue-100/60 dark:hover:bg-blue-900/40 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            onClick={onClose}
            type="button"
            aria-label="Close add note modal"
          >
            ×
          </button>

          <h2 className="text-lg font-bold mb-4 text-neutral-800 dark:text-neutral-100">Add New Note</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter note title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter note description"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Note'
              )}
            </button>
          </div>
        </form>
      </div>
    </ModalPortal>
  );
}; 