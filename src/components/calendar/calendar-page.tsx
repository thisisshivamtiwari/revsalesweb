import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isSameDay, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, Plus, User, LogOut } from 'lucide-react';
import { useGetMeetingsQuery } from '@/lib/features/meetings/meetingsApi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { VerticalNavigation } from '@/components/ui/vertical-navigation';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ViewType = 'day' | 'week' | 'month';

export function CalendarPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('week');
  const [search, setSearch] = useState('');
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const startDate = view === 'day' 
    ? date 
    : view === 'week'
    ? startOfWeek(date, { weekStartsOn: 1 })
    : startOfMonth(date);

  const endDate = view === 'day'
    ? date
    : view === 'week'
    ? endOfWeek(date, { weekStartsOn: 1 })
    : endOfMonth(date);

  const { data, isLoading } = useGetMeetingsQuery({
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    search,
  });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getMeetingsForDay = (day: Date) => {
    return data?.data.meetings.filter(meeting => 
      isSameDay(parseISO(meeting.startTime), day)
    ) || [];
  };

  return (
    <div className="min-h-screen bg-[#1C1D2E] text-white">
      <VerticalNavigation />
      <div className="ml-28 max-w-[calc(100vw-144px)] px-6 py-4">
        {/* User Info Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {user.profileImg ? (
              <img
                src={user.profileImg}
                alt={user.fullName}
                className="w-12 h-12 rounded-full border-2 border-[#2F304D]/20"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#242744] border-2 border-[#2F304D]/20 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">Welcome, {user.fullName}</h1>
              <p className="text-gray-400">Company ID: {user.companyId}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-[#242744]/50 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>

        {/* Calendar Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="bg-[#242744]/50 border-[#2F304D]/20 hover:bg-[#242744]/70 text-white"
              onClick={() => setDate(new Date())}
            >
              Today
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDate(d => addDays(d, -1))}
                className="hover:bg-[#242744]/50 text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDate(d => addDays(d, 1))}
                className="hover:bg-[#242744]/50 text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <h2 className="text-xl font-semibold text-white">
              {format(date, 'MMMM yyyy')}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search meetings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-[300px] bg-[#242744]/50 border-[#2F304D]/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Select
              value={view}
              onValueChange={(value: ViewType) => setView(value)}
            >
              <SelectTrigger className="w-[120px] bg-[#242744]/50 border-[#2F304D]/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#242744] border-[#2F304D]/20">
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-[#FF5A81] hover:bg-[#FF5A81]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-[#242744]/30 backdrop-blur-lg rounded-3xl border border-[#2F304D]/20 overflow-hidden">
          {/* Days Header */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-[#2F304D]/20">
            <div className="p-3 text-center text-sm text-gray-400" />
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-3 text-center border-l border-[#2F304D]/20",
                  isSameDay(day, new Date()) && "bg-[#242744]/50"
                )}
              >
                <div className="text-sm font-medium text-gray-300">
                  {format(day, 'EEE')}
                </div>
                <div className={cn(
                  "w-8 h-8 rounded-full mx-auto flex items-center justify-center text-sm",
                  isSameDay(day, new Date()) && "bg-[#FF5A81] text-white",
                  !isSameDay(day, new Date()) && "text-white"
                )}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)]">
            {hours.map((hour) => (
              <div key={hour} className="contents">
                <div className="p-2 text-xs text-gray-400 text-center border-r border-[#2F304D]/20">
                  {format(new Date().setHours(hour), 'ha')}
                </div>
                {days.map((day) => {
                  const meetings = getMeetingsForDay(day).filter(meeting => {
                    const meetingHour = new Date(meeting.startTime).getHours();
                    return meetingHour === hour;
                  });

                  return (
                    <div
                      key={`${day.toISOString()}-${hour}`}
                      className="p-1 border-b border-l border-[#2F304D]/20 min-h-[80px] relative group hover:bg-[#242744]/30 transition-colors"
                    >
                      {meetings.map((meeting) => (
                        <div
                          key={meeting._id}
                          className="absolute inset-x-1 bg-[#FF5A81]/20 border-l-4 border-[#FF5A81] rounded p-2 text-xs cursor-pointer hover:bg-[#FF5A81]/30 transition-colors"
                          style={{
                            top: '0',
                            height: '76px',
                          }}
                        >
                          <div className="font-medium truncate text-white">{meeting.title}</div>
                          <div className="text-gray-400 truncate">{meeting.location}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 