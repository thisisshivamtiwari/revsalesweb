import { useEffect, useState } from 'react';
import { getLeadNotes, LeadNote } from '@/services/leads';
import { IconNote, IconUser, IconCalendar, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { format } from 'date-fns';

interface NotesTabProps {
  leadId: string | number;
}

export const NotesTab = ({ leadId }: NotesTabProps) => {
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalNotes, setTotalNotes] = useState(0);

  const fetchNotes = async (page = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLeadNotes(leadId, page, pageSize);
      if (response.status && response.code === 200) {
        setNotes(response.data.notes);
        setTotalNotes(response.data.total);
      } else {
        setError(response.message || 'Failed to fetch notes');
      }
    } catch (err) {
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes(1);
    setCurrentPage(1);
    // eslint-disable-next-line
  }, [leadId]);

  useEffect(() => {
    fetchNotes(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  const totalPages = Math.max(1, Math.ceil(totalNotes / pageSize));

  return (
    <div className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-neutral-700/30 p-4 md:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
          <IconNote className="w-6 h-6 text-blue-500" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Notes
        </h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
            <IconNote className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">{error}</h3>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
            <IconNote className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">No notes found</h3>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-neutral-600 dark:text-neutral-400">
              Showing {notes.length} of {totalNotes} notes
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 transition-all duration-200"
              >
                <IconChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-neutral-600 dark:text-neutral-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 transition-all duration-200"
              >
                <IconChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group relative bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 line-clamp-2">
                      {note.title}
                    </h3>
                    <span className="flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500">
                      <IconUser className="w-4 h-4" />
                      {note.createdBy}
                    </span>
                  </div>
                  <div className="mb-2 text-neutral-700 dark:text-neutral-200">
                    {note.description}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <IconCalendar className="w-4 h-4" />
                    {format(new Date(note.createdAt), 'PP, p')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}; 