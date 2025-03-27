import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Loader2, User, Clock } from 'lucide-react';
import { useGetTasksQuery } from '@/lib/features/tasks/tasksApi';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeadsFilter } from '../leads/leads-filter';
import { LeadsPagination } from '../leads/leads-pagination';
import { DateRange } from 'react-day-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const taskTypeColors: Record<string, { bg: string, text: string, icon: string }> = {
  'Proposal': { 
    bg: 'bg-[#90C418]', 
    text: 'text-[#90C418]',
    icon: '📝'
  },
  'Audit': { 
    bg: 'bg-[#6366F1]', 
    text: 'text-[#6366F1]',
    icon: '📊'
  },
  'Meeting': { 
    bg: 'bg-[#F59E0B]', 
    text: 'text-[#F59E0B]',
    icon: '🤝'
  },
  'Follow-up': { 
    bg: 'bg-[#EC4899]', 
    text: 'text-[#EC4899]',
    icon: '📞'
  },
};

export function TasksList() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'completed' | 'pending'>('all');

  const { data, isLoading, error } = useGetTasksQuery({
    limit,
    pageNumber: page,
    search,
    status: status === 'all' ? undefined : status,
    startDate: dateRange?.from ? 
      new Date(Date.UTC(
        dateRange.from.getFullYear(),
        dateRange.from.getMonth(),
        dateRange.from.getDate()
      )).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    endDate: dateRange?.to ? 
      new Date(Date.UTC(
        dateRange.to.getFullYear(),
        dateRange.to.getMonth(),
        dateRange.to.getDate()
      )).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  });

  const totalPages = Math.ceil((data?.data?.total || 0) / limit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[200px] text-red-400">
        Failed to load tasks
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4 overflow-x-auto -mx-6 px-6 pb-2">
        <LeadsFilter
          dateRange={dateRange}
          limit={limit}
          search={search}
          onDateRangeChange={(range) => {
            setDateRange(range);
            setPage(1);
          }}
          onLimitChange={(value) => {
            setLimit(Number(value));
            setPage(1);
          }}
          onSearchChange={setSearch}
        />
        <Select
          value={status}
          onValueChange={(value: 'all' | 'completed' | 'pending') => {
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[140px] bg-[#2F304D]/50 border-[#2F304D]/20 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-[#242744] border-[#2F304D]/20">
            <SelectItem value="all" className="text-white hover:bg-[#2F304D]/50">All</SelectItem>
            <SelectItem value="completed" className="text-white hover:bg-[#2F304D]/50">Completed</SelectItem>
            <SelectItem value="pending" className="text-white hover:bg-[#2F304D]/50">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!data?.data.tasks?.length ? (
        <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg">No tasks found</p>
          <p className="text-sm mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6">
          <div className="min-w-full w-max md:w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-6">
            {data.data.tasks.map((task) => {
              const typeConfig = taskTypeColors[task.taskTypeName] || { 
                bg: 'bg-gray-500', 
                text: 'text-gray-500',
                icon: '📌'
              };
              
              return (
                <Card 
                  key={task.id} 
                  className="bg-[#2F304D]/50 border-[#2F304D]/20 p-4 hover:bg-[#2F304D]/70 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-purple-500" />
                  
                  <div className="relative flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-2xl",
                      "bg-gradient-to-br from-[#2F304D] to-[#242744] border border-[#2F304D]"
                    )}>
                      {typeConfig.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <Badge 
                            className={cn(
                              "rounded-full px-3 py-0.5 text-xs font-medium",
                              task.taskStatus === 'completed' 
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            )}
                          >
                            {task.taskStatus}
                          </Badge>
                          <h3 className="text-base font-semibold mt-1 text-white group-hover:text-blue-400 transition-colors">
                            {task.taskTypeName}
                          </h3>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "rounded-full px-3 py-1",
                            `${typeConfig.bg}/20 ${typeConfig.text} border-${typeConfig.bg}/30`
                          )}
                        >
                          {task.title}
                        </Badge>
                      </div>

                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <User className="w-4 h-4" />
                          <span className="truncate">
                            Assigned to: {task.assignedTo}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Created: {format(new Date(task.createdAt), 'd MMM yy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>
                            Deadline: {format(new Date(task.deadline), 'd MMM yy')}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {task.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="overflow-x-auto -mx-6">
          <div className="min-w-full w-max md:w-full px-6">
            <LeadsPagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
} 