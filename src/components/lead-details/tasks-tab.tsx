import { useEffect, useState } from 'react';
import { getTasks, Task } from '@/services/tasks';
import { format } from 'date-fns';
import { IconChecklist, IconUser, IconPhone, IconCalendar, IconClock, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { toast } from 'sonner';
import { TaskActionModal } from '@/components/ui/task-action-modal';

interface TasksTabProps {
  leadId: string | number;
}

export const TasksTab = ({ leadId }: TasksTabProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalTasks, setTotalTasks] = useState(0);

  const fetchTasks = async (page = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getTasks({ leadId, pageNumber: page, limit: pageSize });
      if (response.status && response.code === 200) {
        setTasks(response.data.tasks);
        setTotalTasks(response.data.total);
      } else {
        setError(response.message || 'Failed to fetch tasks');
        toast.error(response.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError('Failed to fetch tasks');
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(1);
    setCurrentPage(1);
    // eslint-disable-next-line
  }, [leadId]);

  useEffect(() => {
    fetchTasks(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-500/20 dark:border-yellow-500/30';
      case 'completed':
        return 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-green-500/20 dark:border-green-500/30';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400 border-gray-500/20 dark:border-gray-500/30';
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalTasks / pageSize));

  return (
    <div className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-neutral-700/30 p-4 md:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
          <IconChecklist className="w-6 h-6 text-blue-500" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Tasks
        </h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
            <IconChecklist className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">{error}</h3>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
            <IconChecklist className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">No tasks found</h3>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-neutral-600 dark:text-neutral-400">
              Showing {tasks.length} of {totalTasks} tasks
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
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="group relative bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 overflow-hidden cursor-pointer"
                tabIndex={0}
                aria-label={`View task: ${task.title}`}
                onKeyDown={(e) => { if (e.key === 'Enter') setSelectedTask(task); }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 line-clamp-2">
                      {task.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.taskStatus)}`}>
                      {task.taskStatus}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                      <IconUser className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">{task.leadName}</span>
                    </div>
                    <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                      <IconPhone className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">{task.phoneNumber}</span>
                    </div>
                    <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                      <IconCalendar className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">
                        Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                      <IconClock className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">
                        Deadline: {format(new Date(task.deadline), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-neutral-200/50 dark:border-neutral-700/50">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {selectedTask && (
        <TaskActionModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onTaskCompleted={() => fetchTasks(currentPage)}
        />
      )}
    </div>
  );
}; 