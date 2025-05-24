import { useEffect, useState } from 'react';
import { getTasks, Task, getTaskTypes, createTask, TaskType, getMembers, Member } from '@/services/tasks';
import { format } from 'date-fns';
import { IconChecklist, IconUser, IconPhone, IconCalendar, IconClock, IconChevronLeft, IconChevronRight, IconPlus } from '@tabler/icons-react';
import { toast } from 'sonner';
import { TaskActionModal } from '@/components/ui/task-action-modal';
import { ModalPortal } from '@/components/ui/ModalPortal';
import React from 'react';

interface TasksTabProps {
  leadId: string | number;
}

// New: Modal for call/follow up task types
const CallFollowUpTaskModal = ({ isOpen, onClose, task }: { isOpen: boolean; onClose: () => void; task: Task | null }) => {
  if (!isOpen || !task) return null;
  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white/95 dark:bg-neutral-900/95 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
          <button
            className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-xl font-bold focus:outline-none hover:bg-blue-100/60 dark:hover:bg-blue-900/40 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            onClick={onClose}
            type="button"
            aria-label="Close call/follow up task modal"
          >
            ×
          </button>
          <h2 className="text-lg font-bold mb-4 text-neutral-800 dark:text-neutral-100">Task Options</h2>
          <div className="space-y-3">
            <button className="w-full py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition" onClick={() => toast.info('View Lead (not implemented)')}>View Lead</button>
            <button className="w-full py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition" onClick={() => toast.info('Create Followup Task (not implemented)')}>Create Followup Task</button>
            <button className="w-full py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 transition" onClick={() => toast.info('Add Notes (not implemented)')}>Add Notes</button>
            <button className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition" onClick={() => toast.info('Mark Task as Complete (not implemented)')}>Mark Task as Complete</button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export const TasksTab = ({ leadId }: TasksTabProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalTasks, setTotalTasks] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    taskTypeId: '',
    deadline: '',
    priority: 'Medium',
    description: '',
    assignedTo: '',
    createdFor: '',
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [showCallFollowUpModal, setShowCallFollowUpModal] = useState(false);
  const [callFollowUpTask, setCallFollowUpTask] = useState<Task | null>(null);

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

  const handleOpenCreateModal = async () => {
    setShowCreateModal(true);
    setCreateError(null);
    setCreateLoading(true);
    try {
      const [taskTypeRes, memberRes] = await Promise.all([
        getTaskTypes(),
        getMembers()
      ]);
      if (taskTypeRes.status && taskTypeRes.code === 200) {
        setTaskTypes(taskTypeRes.data.taskType);
      } else {
        setCreateError(taskTypeRes.message || 'Failed to fetch task types');
      }
      if (memberRes.status && memberRes.code === 200) {
        setMembers(memberRes.data.members);
      } else {
        setCreateError(memberRes.message || 'Failed to fetch members');
      }
    } catch (err) {
      setCreateError('Failed to fetch task types or members');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    try {
      const payload = {
        ...form,
        leadId,
      };
      const res = await createTask(payload);
      if (res.status && res.code === 201) {
        setShowCreateModal(false);
        setForm({ title: '', taskTypeId: '', deadline: '', priority: 'Medium', description: '', assignedTo: '', createdFor: '' });
        fetchTasks(1);
        setCurrentPage(1);
        toast.success('Task created successfully');
      } else {
        setCreateError(res.message || 'Failed to create task');
      }
    } catch (err) {
      setCreateError('Failed to create task');
    } finally {
      setCreateLoading(false);
    }
  };

  // Updated card click handler
  const handleTaskCardClick = (task: Task) => {
    const type = task.taskType?.toLowerCase();
    if (type === 'call' || type === 'follow up' || type === 'followup') {
      setCallFollowUpTask(task);
      setShowCallFollowUpModal(true);
      // setSelectedTask(task); // Commented out old code
    } else {
      toast.info('Under development');
    }
  };

  return (
    <div className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-neutral-700/30 p-4 md:p-6 relative">
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
                onClick={() => handleTaskCardClick(task)}
                className="group relative bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 overflow-hidden cursor-pointer"
                tabIndex={0}
                aria-label={`View task: ${task.title}`}
                onKeyDown={(e) => { if (e.key === 'Enter') handleTaskCardClick(task); }}
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
      {/* New: Call/Follow Up Task Modal */}
      <CallFollowUpTaskModal
        isOpen={showCallFollowUpModal}
        onClose={() => setShowCallFollowUpModal(false)}
        task={callFollowUpTask}
      />
      {/* Floating Create Task Button */}
      <button
        className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
        aria-label="Create Task"
        onClick={handleOpenCreateModal}
        type="button"
      >
        <IconPlus className="w-6 h-6" />
      </button>
      {/* Create Task Modal */}
      {showCreateModal && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <form
              className="bg-white/95 dark:bg-neutral-900/95 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative"
              onSubmit={handleCreateTask}
            >
              <button
                className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-xl font-bold focus:outline-none hover:bg-blue-100/60 dark:hover:bg-blue-900/40 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                onClick={() => setShowCreateModal(false)}
                type="button"
                aria-label="Close create task modal"
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-4 text-neutral-800 dark:text-neutral-100">Create Task</h2>
              {createLoading && taskTypes.length === 0 ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : createError ? (
                <div className="text-red-500 text-center py-4">{createError}</div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">Task Type</label>
                    <select
                      name="taskTypeId"
                      value={form.taskTypeId}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select type</option>
                      {taskTypes.map((type) => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">Deadline</label>
                      <input
                        type="datetime-local"
                        name="deadline"
                        value={form.deadline}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">Created For</label>
                      <input
                        type="datetime-local"
                        name="createdFor"
                        value={form.createdFor}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">Priority</label>
                      <select
                        name="priority"
                        value={form.priority}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">Assigned To</label>
                      <select
                        name="assignedTo"
                        value={form.assignedTo}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select member</option>
                        {members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.fullName} ({member.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-2 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all disabled:opacity-60"
                    disabled={createLoading}
                  >
                    {createLoading ? 'Creating...' : 'Create Task'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}; 