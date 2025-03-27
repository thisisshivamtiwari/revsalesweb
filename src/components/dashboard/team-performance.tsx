import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, Target, Users, FileText, DollarSign, Loader2, Calendar } from 'lucide-react';
import { useGetTeamPerformanceQuery } from '@/lib/features/dashboard/dashboardApi';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export function UserPerformance() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const { data, isLoading } = useGetTeamPerformanceQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data?.data) {
    return null;
  }

  const metrics = [
    {
      title: 'Task Completion',
      value: `${data.data.tasks.completionPercentage.toFixed(1)}%`,
      subValue: `${data.data.tasks.completedTask}/${data.data.tasks.assignedTask} Tasks`,
      icon: Target,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20',
    },
    {
      title: 'Proposal Growth',
      value: `${Math.abs(data.data.proposal.growthPercentage)}%`,
      subValue: `${data.data.proposal.selectedPeriod} vs ${data.data.proposal.comparisonPeriod}`,
      icon: FileText,
      color: data.data.proposal.growthPercentage >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: data.data.proposal.growthPercentage >= 0 ? 'bg-green-400/20' : 'bg-red-400/20',
      trend: data.data.proposal.growthPercentage >= 0 ? ArrowUpRight : ArrowDownRight,
    },
    {
      title: 'Meeting Conversion',
      value: `${data.data.meetings.conversionPercentage}%`,
      subValue: `${data.data.meetings.convertedLead}/${data.data.meetings.meetingDone} Converted`,
      icon: Users,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20',
    },
    {
      title: 'Revenue Growth',
      value: formatCurrency(data.data.revenue.currentRevenue),
      subValue: `${data.data.revenue.revenueGrowth >= 0 ? '+' : ''}${data.data.revenue.revenueGrowth}% Growth`,
      icon: DollarSign,
      color: data.data.revenue.revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400',
      bgColor: data.data.revenue.revenueGrowth >= 0 ? 'bg-green-400/20' : 'bg-red-400/20',
      trend: data.data.revenue.revenueGrowth >= 0 ? ArrowUpRight : ArrowDownRight,
    },
  ];

  const chartData = data.data.graphData.map(item => ({
    date: format(new Date(item.label), 'MMM d'),
    count: item.count,
  }));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">User Performance</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal bg-[#242744] border-[#2F304D]/20",
                !date && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#242744] border-[#2F304D]/20" align="end">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              className="bg-[#242744]"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trend;

          return (
            <Card
              key={metric.title}
              className="bg-[#242744] border-[#2F304D]/20 p-4 hover:bg-[#2F304D]/70 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  metric.bgColor
                )}>
                  <Icon className={cn("w-5 h-5", metric.color)} />
                </div>
                {TrendIcon && (
                  <TrendIcon className={cn("w-5 h-5", metric.color)} />
                )}
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-medium text-gray-400">
                  {metric.title}
                </h3>
                <p className={cn(
                  "text-lg font-semibold mt-1",
                  metric.color
                )}>
                  {metric.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {metric.subValue}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="bg-[#242744] border-[#2F304D]/20 p-4">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Task Completion Trend</h3>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#242744',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Area 
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
} 