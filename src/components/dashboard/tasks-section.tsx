"use client";

import { useEffect, useState } from 'react';
import { getTasks, type Task } from '@/services/tasks';
import { format } from 'date-fns';
import { IconChecklist, IconSearch, IconChevronLeft, IconChevronRight, IconUser, IconPhone, IconCalendar, IconClock } from '@tabler/icons-react';
import { toast } from 'sonner';
import { TaskActionModal } from '@/components/ui/task-action-modal';

export const TasksSection = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'pending' | 'completed'>('pending');
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks({
        pageNumber: pagination.current,
        limit: pagination.pageSize,
        status,
        startDate,
        endDate
      });

      if (response.status && response.code === 200) {
        setTasks(response.data.tasks);
        setPagination(prev => ({
          ...prev,
          total: response.data.total
        }));
      } else {
        toast.error(response.message || 'Failed to fetch tasks');
      }
    } catch (error) {
      toast.error('An error occurred while fetching tasks');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [pagination.current, status, startDate, endDate]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleStatusChange = (newStatus: 'pending' | 'completed') => {
    setStatus(newStatus);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    setPagination(prev => ({
      ...prev,
      current: direction === 'prev' ? Math.max(1, prev.current - 1) : Math.min(Math.ceil(prev.total / prev.pageSize), prev.current + 1)
    }));
  };

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

  return (
    <div className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-neutral-700/30 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
            <IconChecklist className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            Tasks
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex gap-2">
            <button
              onClick={() => handleStatusChange('pending')}
              className={`px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                status === 'pending'
                  ? 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-500/20 dark:border-yellow-500/30'
                  : 'bg-white/50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 border-neutral-200/50 dark:border-neutral-700/50'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusChange('completed')}
              className={`px-4 py-2.5 rounded-xl border transition-all duration-200 ${
                status === 'completed'
                  ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 border-green-500/20 dark:border-green-500/30'
                  : 'bg-white/50 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 border-neutral-200/50 dark:border-neutral-700/50'
              }`}
            >
              Completed
            </button>
          </div>
          
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange(e, 'start')}
              className="px-4 py-2.5 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 backdrop-blur-sm transition-all duration-200"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleDateChange(e, 'end')}
              className="px-4 py-2.5 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 backdrop-blur-sm transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
            <IconChecklist className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">No tasks found</h3>
          <p className="text-neutral-500 dark:text-neutral-500 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="group relative bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 overflow-hidden cursor-pointer"
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

          <div className="flex justify-between items-center mt-8">
            <p className="text-neutral-600 dark:text-neutral-400">
              Showing {tasks.length} of {pagination.total} tasks
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange('prev')}
                disabled={pagination.current === 1}
                className="p-2 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 transition-all duration-200"
              >
                <IconChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-neutral-600 dark:text-neutral-400">
                Page {pagination.current} of {Math.ceil(pagination.total / pagination.pageSize)}
              </span>
              <button
                onClick={() => handlePageChange('next')}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                className="p-2 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 transition-all duration-200"
              >
                <IconChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}

      {selectedTask && (
        <TaskActionModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
        />
      )}
    </div>
  );
}; 