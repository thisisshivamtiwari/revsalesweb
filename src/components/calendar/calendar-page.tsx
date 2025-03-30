import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachHourOfInterval,
  isSameDay,
  parseISO,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfDay,
  endOfDay,
  isWithinInterval,
  addHours,
  isSameHour,
  setHours,
  getHours,
  setMinutes,
} from "date-fns"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  MoreVertical,
  Clock,
  MapPin,
  Users,
} from "lucide-react"
import { useGetMeetingsQuery } from "@/lib/features/meetings/meetingsApi"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { VerticalNavigation } from "@/components/ui/vertical-navigation"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import toast from "react-hot-toast"
import type { Meeting } from "@/lib/features/meetings/meetingsApi"
import { MeetingDetailModal } from "@/components/meetings/meeting-detail-modal"

type ViewType = "day" | "week" | "month"

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const TIME_LABELS = HOURS.map(hour => format(setHours(new Date(), hour), 'h a'))

export function CalendarPage() {
  const navigate = useNavigate()
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState<ViewType>("week")
  const [search, setSearch] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged out successfully")
    navigate("/login")
  }

  const getDateRange = () => {
    switch (view) {
      case "day":
        return {
          start: format(startOfDay(date), "yyyy-MM-dd"),
          end: format(endOfDay(date), "yyyy-MM-dd"),
        }
      case "week":
        return {
          start: format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd"),
          end: format(endOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd"),
        }
      case "month":
        return {
          start: format(startOfMonth(date), "yyyy-MM-dd"),
          end: format(endOfMonth(date), "yyyy-MM-dd"),
        }
    }
  }

  const dateRange = getDateRange()
  const { data: meetingsData, isLoading } = useGetMeetingsQuery({
    startDate: dateRange.start,
    endDate: dateRange.end,
    search,
    limit: 100,
    pageNumber: 1,
  })

  const handlePrevious = () => {
    switch (view) {
      case "day":
        setDate(subDays(date, 1))
        break
      case "week":
        setDate(subWeeks(date, 1))
        break
      case "month":
        setDate(subMonths(date, 1))
        break
    }
  }

  const handleNext = () => {
    switch (view) {
      case "day":
        setDate(addDays(date, 1))
        break
      case "week":
        setDate(addWeeks(date, 1))
        break
      case "month":
        setDate(addMonths(date, 1))
        break
    }
  }

  const handleToday = () => {
    setDate(new Date())
    setSelectedDate(new Date())
  }

  const handleDateSelect = (day: Date) => {
    setSelectedDate(day)
    setDate(day)
  }

  const handleMeetingClick = (meeting: Meeting, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setSelectedMeeting(meeting)
  }

  const getMeetingsForTimeSlot = (day: Date, hour: number) => {
    if (!meetingsData?.data.meetings) return []
    
    const slotStart = setMinutes(setHours(startOfDay(day), hour), 0)
    const slotEnd = setMinutes(setHours(startOfDay(day), hour), 59)
    
    return meetingsData.data.meetings.filter((meeting) => {
      const meetingStart = new Date(meeting.startTime)
      const meetingEnd = new Date(meeting.endTime)
      
      const meetingStartHour = getHours(meetingStart)
      const meetingDay = startOfDay(meetingStart)
      
      // First check if this is the correct day
      if (!isSameDay(meetingDay, day)) {
        return false
      }
      
      // Then check if the meeting falls in this hour slot
      return meetingStartHour === hour
    })
  }

  const getMeetingsForDay = (day: Date) => {
    if (!meetingsData?.data.meetings) return []
    
    return meetingsData.data.meetings.filter((meeting) => {
      const meetingStart = new Date(meeting.startTime)
      return isSameDay(meetingStart, day)
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      case "completed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const renderMeetingCard = (meeting: Meeting) => {
    const startTime = parseISO(meeting.startTime)
    const endTime = parseISO(meeting.endTime)

    return (
      
      <div
        key={meeting._id}
        className="group bg-[#242744]/30 hover:bg-[#242744]/50 backdrop-blur-lg rounded-xl border border-[#2F304D]/20 p-4 transition-all duration-200 cursor-pointer"
        onClick={(e) => handleMeetingClick(meeting, e)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-white truncate">{meeting.title}</h3>
              <span className={cn("px-2 py-0.5 text-xs rounded-full text-white", getStatusColor(meeting.meetingStatus))}>
                {meeting.meetingStatus}
              </span>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">{meeting.description}</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}</span>
          </div>
          {meeting.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-[150px]">{meeting.location}</span>
            </div>
          )}
          {meeting.attendees && meeting.attendees.length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{meeting.attendees.length} attendees</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderTimeSlot = (day: Date, hour: number) => {
    const meetings = getMeetingsForTimeSlot(day, hour)
    const timeLabel = format(setHours(day, hour), "h a")
    
    return (
      <div
        key={`${day.toISOString()}-${hour}`}
        className={cn(
          "relative min-h-[60px] border-t border-[#2F304D]/20 group",
          "hover:bg-[#242744]/20 transition-colors"
        )}
      >
        {meetings.map((meeting) => (
          <div
            key={meeting._id}
            onClick={(e) => handleMeetingClick(meeting, e)}
            className="absolute inset-x-0 m-1 p-1 rounded bg-[#FF5A81]/10 text-[#FF5A81] text-xs truncate cursor-pointer hover:bg-[#FF5A81]/20"
          >
            {meeting.title}
          </div>
        ))}
      </div>
    )
  }

  const renderDayView = () => (
    <div className="flex flex-1 h-[600px] overflow-y-auto">
      <div className="w-16 flex-shrink-0 border-r border-[#2F304D]/20">
        {TIME_LABELS.map((label, i) => (
          <div key={label} className="h-[60px] text-xs text-gray-400 text-center pt-1">
            {label}
          </div>
        ))}
      </div>
      <div className="flex-1">
        {HOURS.map((hour) => renderTimeSlot(date, hour))}
      </div>
    </div>
  )

  const renderWeekView = () => {
    const days = eachDayOfInterval({
      start: startOfWeek(date, { weekStartsOn: 1 }),
      end: endOfWeek(date, { weekStartsOn: 1 }),
    })

    return (
      <div className="flex flex-1 h-[600px] overflow-y-auto">
        <div className="w-16 flex-shrink-0 border-r border-[#2F304D]/20">
          {TIME_LABELS.map((label, i) => (
            <div key={label} className="h-[60px] text-xs text-gray-400 text-center pt-1">
              {label}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7">
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className={cn(
                "border-r border-[#2F304D]/20",
                isSameDay(day, new Date()) && "bg-[#2F304D]/30"
              )}
            >
              <div className="sticky top-0 z-10 text-center py-2 text-sm font-medium bg-[#1C1D2E]">
                {format(day, "EEE d")}
              </div>
              {HOURS.map((hour) => renderTimeSlot(day, hour))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderMonthView = () => {
    const startDate = startOfMonth(date)
    const endDate = endOfMonth(date)
    const days = eachDayOfInterval({ start: startDate, end: endDate })
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-4">
          {days.map((day) => {
            const meetings = getMeetingsForDay(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const isToday = isSameDay(day, new Date())
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-[120px] p-3 rounded-lg border border-[#2F304D]/20",
                  "hover:bg-[#242744]/50 cursor-pointer transition-all duration-200",
                  isToday && "bg-[#2F304D]/30",
                  isSelected && "ring-2 ring-[#FF5A81]"
                )}
                onClick={() => handleDateSelect(day)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm",
                    isToday && "bg-[#FF5A81] text-white",
                    !isToday && "text-gray-400"
                  )}>
                    {format(day, "d")}
                  </span>
                  {meetings.length > 0 && (
                    <span className="text-xs text-[#FF5A81]">
                      {meetings.length} {meetings.length === 1 ? 'meeting' : 'meetings'}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {meetings.slice(0, 2).map((meeting) => (
                    <div
                      key={meeting._id}
                      onClick={(e) => handleMeetingClick(meeting, e)}
                      className="text-xs p-1.5 rounded bg-[#FF5A81]/10 text-[#FF5A81] truncate cursor-pointer hover:bg-[#FF5A81]/20"
                    >
                      {format(parseISO(meeting.startTime), "h:mm a")} - {meeting.title}
                    </div>
                  ))}
                  {meetings.length > 2 && (
                    <div className="text-xs text-gray-400 pl-1">
                      +{meetings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderCalendarContent = () => {
    switch (view) {
      case "day":
        return renderDayView()
      case "week":
        return renderWeekView()
      case "month":
        return renderMonthView()
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1D2E] text-white pb-20 md:pb-0">
      <VerticalNavigation />
      <div className="px-4 md:ml-28 md:max-w-[calc(100vw-144px)] md:px-6 py-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Calendar</h1>
            <p className="text-gray-400">
              {meetingsData?.data.total 
                ? `${meetingsData.data.total} meetings scheduled`
                : "Manage your meetings and schedule"}
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search meetings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full bg-[#242744]/50 border-[#2F304D]/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Button 
              className="w-full md:w-auto bg-[#FF5A81] hover:bg-[#FF5A81]/90 text-white"
              onClick={() => toast.error("New meeting creation not implemented yet")}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Meeting
            </Button>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-0 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleToday}
              className={cn(
                "bg-[#242744]/30 border-[#2F304D]/20 text-white",
                "hover:bg-[#242744]/50 hover:border-[#FF5A81]",
                "transition-all duration-200"
              )}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Today
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="text-gray-400 hover:text-white hover:bg-[#242744]/50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="text-gray-400 hover:text-white hover:bg-[#242744]/50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <span className="text-lg font-medium ml-2">
                {format(date, "MMMM yyyy")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto md:overflow-visible">
            <Button
              variant="ghost"
              onClick={() => setView("day")}
              className={cn(
                "text-gray-400 hover:text-white hover:bg-[#242744]/50",
                view === "day" && "text-[#FF5A81] hover:text-[#FF5A81] bg-[#242744]/30"
              )}
            >
              Day
            </Button>
            <Button
              variant="ghost"
              onClick={() => setView("week")}
              className={cn(
                "text-gray-400 hover:text-white hover:bg-[#242744]/50",
                view === "week" && "text-[#FF5A81] hover:text-[#FF5A81] bg-[#242744]/30"
              )}
            >
              Week
            </Button>
            <Button
              variant="ghost"
              onClick={() => setView("month")}
              className={cn(
                "text-gray-400 hover:text-white hover:bg-[#242744]/50",
                view === "month" && "text-[#FF5A81] hover:text-[#FF5A81] bg-[#242744]/30"
              )}
            >
              Month
            </Button>
          </div>
        </div>

        {/* Date Range Debug Info */}
        <div className="mb-4 p-3 rounded-lg bg-[#242744]/30 border border-[#2F304D]/20">
          <div className="text-sm text-gray-400">
            <span className="font-medium text-[#FF5A81]">API Date Range:</span>{' '}
            {dateRange.start} to {dateRange.end}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-[#242744]/30 backdrop-blur-lg rounded-3xl border border-[#2F304D]/20 overflow-hidden">
          <div className="p-4 md:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-4 border-[#FF5A81] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
            {/* Calendar Header */}
                {view === "month" && (
            <div className="grid grid-cols-7 gap-4 mb-4">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-center text-sm text-gray-400">
                  {day}
                </div>
              ))}
            </div>
                )}

                {/* Calendar Content */}
                {renderCalendarContent()}
              </>
            )}
          </div>
        </div>

        {/* Upcoming Meetings */}
        {view === "month" && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Upcoming Meetings</h2>
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-8 h-8 border-4 border-[#FF5A81] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : meetingsData?.data.meetings && meetingsData.data.meetings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meetingsData.data.meetings.map(renderMeetingCard)}
                  </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400">
                No meetings scheduled
              </div>
            )}
          </div>
        )}
      </div>

      {/* Meeting Detail Modal */}
      <MeetingDetailModal
        meeting={selectedMeeting}
        isOpen={!!selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
      />
    </div>
  )
} 