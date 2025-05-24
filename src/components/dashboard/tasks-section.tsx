"use client";

import { useEffect, useState } from 'react';
import { getTasks, type Task, completeTask, getTaskTypes, getMembers, TaskType, Member, createTask } from '@/services/tasks';
import { format } from 'date-fns';
import { IconChecklist, IconSearch, IconChevronLeft, IconChevronRight, IconUser, IconPhone, IconCalendar, IconClock, IconPlus } from '@tabler/icons-react';
import { toast } from 'sonner';
import { TaskActionModal } from '@/components/ui/task-action-modal';
import { handleTaskCardClick } from '@/utils/task-action-handler';
import { CallFollowUpTaskOptionsModal } from '@/components/ui/call-followup-task-options-modal';
import { AddNoteModal } from '@/components/lead-details/add-note-modal';
import { useRouter } from 'next/navigation';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { getLeads, type Lead } from '@/services/leads';
import { AddAuditModal } from '@/components/lead-details/add-audit-modal';

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
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [optionsTask, setOptionsTask] = useState<Task | null>(null);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [addNoteTask, setAddNoteTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalLead, setModalLead] = useState<{ leadId: string | number; leadName: string; phoneNumber: string } | null>(null);
  const [taskTypes, setTaskTypes] = useState<TaskType[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    taskTypeId: '',
    deadline: '',
    priority: 'Medium',
    description: '',
    assignedTo: '',
    createdFor: '',
    leadId: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditTask, setAuditTask] = useState<Task | null>(null);
  const router = useRouter();

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

  const handleTaskCompleted = () => {
    fetchTasks();
  };

  const openModal = (task: Task) => {
    const type = (task.taskTypeName || '').toLowerCase();
    if (type === 'call' || type === 'follow-up') {
      setOptionsTask(task);
      setShowOptionsModal(true);
    } else {
      setSelectedTask(task);
    }
  };

  const openAuditModal = (task: Task) => {
    setAuditTask(task);
    setShowAuditModal(true);
  };

  const handleMarkComplete = async () => {
    if (!optionsTask) return;
    try {
      await completeTask(optionsTask.id, optionsTask.leadId);
      toast.success('Task marked as complete');
      setShowOptionsModal(false);
      setOptionsTask(null);
      fetchTasks();
    } catch (err) {
      toast.error('Failed to mark task as complete');
    }
  };

  const handleAddNotes = () => {
    setAddNoteTask(optionsTask);
    setShowAddNoteModal(true);
    setShowOptionsModal(false);
  };

  const handleCreateFollowupTask = () => {
    setShowOptionsModal(false);
    if (optionsTask) {
      handleOpenCreateModal(optionsTask.leadId, optionsTask.leadName, optionsTask.phoneNumber);
    }
  };

  const handleViewLead = () => {
    if (optionsTask) {
      router.push(`/dashboard/leads/${optionsTask.leadId}`);
      setShowOptionsModal(false);
    }
  };

  const handleOpenCreateModal = async (leadId: string | number, leadName: string, phoneNumber: string) => {
    setCreateError(null);
    setCreateLoading(true);
    setModalLead({ leadId, leadName, phoneNumber });
    try {
      const [taskTypeRes, memberRes] = await Promise.all([
        getTaskTypes(),
        getMembers(),
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
      setShowCreateModal(true);
    } catch (err) {
      setCreateError('Failed to fetch task types or members');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleTaskCardCreateClick = (task: Task) => {
    handleOpenCreateModal(task.leadId, task.leadName, task.phoneNumber);
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
                onClick={() => handleTaskCardClick(task, { openAuditModal, openModal })}
                className="group relative bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 overflow-hidden cursor-pointer"
                tabIndex={0}
                aria-label={`View task: ${task.title}`}
                onKeyDown={(e) => { if (e.key === 'Enter') handleTaskCardClick(task, { openAuditModal, openModal }); }}
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
          onTaskCompleted={handleTaskCompleted}
        />
      )}

      {/* Options Modal for Call/Follow-Up */}
      <CallFollowUpTaskOptionsModal
        isOpen={showOptionsModal}
        onClose={() => { setShowOptionsModal(false); setOptionsTask(null); }}
        task={optionsTask}
        onViewLead={handleViewLead}
        onCreateFollowupTask={handleCreateFollowupTask}
        onAddNotes={handleAddNotes}
        onMarkComplete={handleMarkComplete}
      />
      <AddNoteModal
        isOpen={showAddNoteModal}
        onClose={() => setShowAddNoteModal(false)}
        leadId={Number(addNoteTask?.leadId)}
        onNoteAdded={() => {
          setShowAddNoteModal(false);
          fetchTasks();
        }}
      />

      {/* Create Task Modal */}
      {showCreateModal && modalLead && (
        <ModalPortal>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <form
              className="bg-white/95 dark:bg-neutral-900/95 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative"
              onSubmit={async (e) => {
                e.preventDefault();
                setCreateLoading(true);
                setCreateError(null);
                try {
                  const payload = {
                    ...form,
                    leadId: modalLead.leadId,
                  };
                  const res = await createTask(payload);
                  if (res.status && res.code === 201) {
                    setShowCreateModal(false);
                    setForm({ title: '', taskTypeId: '', deadline: '', priority: 'Medium', description: '', assignedTo: '', createdFor: '', leadId: '' });
                    setModalLead(null);
                    fetchTasks();
                    toast.success('Task created successfully');
                  } else {
                    setCreateError(res.message || 'Failed to create task');
                  }
                } catch (err) {
                  setCreateError('Failed to create task');
                } finally {
                  setCreateLoading(false);
                }
              }}
            >
              <button
                className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-xl font-bold focus:outline-none hover:bg-blue-100/60 dark:hover:bg-blue-900/40 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                onClick={() => { setShowCreateModal(false); setModalLead(null); }}
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
                    <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">Lead</label>
                    <div className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100">
                      <span className="font-semibold">{modalLead.leadName}</span> <span className="text-xs text-neutral-500">({modalLead.phoneNumber})</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-neutral-700 dark:text-neutral-200">Task Type</label>
                    <select
                      name="taskTypeId"
                      value={form.taskTypeId}
                      onChange={e => setForm({ ...form, taskTypeId: e.target.value })}
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
                        onChange={e => setForm({ ...form, deadline: e.target.value })}
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
                        onChange={e => setForm({ ...form, createdFor: e.target.value })}
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
                        onChange={e => setForm({ ...form, priority: e.target.value })}
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
                        onChange={e => setForm({ ...form, assignedTo: e.target.value })}
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
                      onChange={e => setForm({ ...form, description: e.target.value })}
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

      {showAuditModal && auditTask && (
        <AddAuditModal
          isOpen={showAuditModal}
          onClose={() => { setShowAuditModal(false); setAuditTask(null); }}
          leadId={auditTask.leadId}
          onAuditAdded={async () => {
            try {
              await completeTask(auditTask.id, auditTask.leadId);
              toast.success('Audit added and task completed successfully');
              setShowAuditModal(false);
              setAuditTask(null);
              fetchTasks();
            } catch (err) {
              toast.error('Failed to complete task after audit');
            }
          }}
        />
      )}
    </div>
  );
}; 