import { format, isValid, parseISO } from "date-fns"
import { Calendar, Clock, MapPin, Users, Link as LinkIcon } from "lucide-react"
import { useGetMeetingsQuery } from "@/lib/features/meetings/meetingsApi"
import { cn } from "@/lib/utils"

interface Attendee {
  _id: string
  name: string
  email: string
  status: string
}

interface Meeting {
  _id: string
  meetingId: string
  title: string
  description: string
  startTime: string
  endTime: string
  location: string
  meetingStatus: string
  attendees: Attendee[]
  link?: string
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    scheduled: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20"
    },
    completed: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20"
    },
    cancelled: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20"
    },
    default: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-400",
      border: "border-yellow-500/20"
    }
  }

  const config = statusConfig[status.toLowerCase()] || statusConfig.default

  return (
    <span className={cn(
      "px-3 py-1 text-xs font-medium rounded-full border",
      "transition-colors duration-200",
      config.bg,
      config.text,
      config.border
    )}>
      {status}
    </span>
  )
}

export function MeetingsList() {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  const { data, isLoading, error } = useGetMeetingsQuery({
    startDate: today,
    endDate: today,
    limit: 5,
  })

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return isValid(date) ? format(date, "MMM d, yyyy") : "Invalid date"
    } catch {
      return "Invalid date"
    }
  }

  const formatTime = (startTime: string, endTime: string) => {
    try {
      const start = parseISO(startTime)
      const end = parseISO(endTime)
      if (!isValid(start) || !isValid(end)) return "Invalid time"
      
      const startFormatted = format(start, "h:mm a")
      const endFormatted = format(end, "h:mm a")
      const durationInMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60))
      
      return `${startFormatted} - ${endFormatted} (${durationInMinutes} min)`
    } catch {
      return "Invalid time"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-[#FF5A81] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        Failed to load meetings
      </div>
    )
  }

  if (!data?.data.meetings?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        No meetings scheduled for today
      </div>
    )
  }

  const renderMeetingDetails = (meeting: Meeting) => {
    const details = [
      {
        id: 'date',
        icon: <Calendar className="w-4 h-4 flex-shrink-0" />,
        content: formatDate(meeting.startTime)
      },
      {
        id: 'time',
        icon: <Clock className="w-4 h-4 flex-shrink-0" />,
        content: formatTime(meeting.startTime, meeting.endTime)
      },
      meeting.location && {
        id: 'location',
        icon: <MapPin className="w-4 h-4 flex-shrink-0" />,
        content: meeting.location,
        fullWidth: true
      },
      {
        id: 'attendees',
        icon: <Users className="w-4 h-4 flex-shrink-0" />,
        content: `${meeting.attendees.length} attendees`,
        fullWidth: true
      }
    ].filter(Boolean)

    return details.map(detail => (
      <div
        key={`${meeting._id}-${detail.id}`}
        className={cn(
          "flex items-center gap-3 text-sm text-gray-400/90 py-1.5",
          "transition-colors duration-200 hover:text-gray-300",
          detail.fullWidth ? 'col-span-full' : ''
        )}
      >
        {detail.icon}
        <span className="truncate">{detail.content}</span>
      </div>
    ))
  }

  return (
    <div className="space-y-6">
      {data.data.meetings.map((meeting: Meeting) => (
        <div
          key={meeting._id}
          className={cn(
            "relative overflow-hidden",
            "bg-gradient-to-br from-[#242744]/80 to-[#2F304D]/50",
            "backdrop-blur-lg rounded-xl",
            "border border-[#2F304D]/30",
            "shadow-lg shadow-black/5",
            "p-5",
            "transition-all duration-300",
            "hover:shadow-xl hover:shadow-black/10",
            "hover:border-[#2F304D]/50",
            "group"
          )}
        >
          {/* Background gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5A81]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-2 truncate group-hover:text-[#FF5A81] transition-colors">
                  {meeting.title}
                </h3>
                <p className="text-sm text-gray-400/90 line-clamp-2 group-hover:text-gray-400 transition-colors">
                  {meeting.description}
                </p>
              </div>
              <StatusBadge status={meeting.meetingStatus} />
            </div>

            {/* Meeting Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
              {renderMeetingDetails(meeting)}
            </div>

            {/* Meeting Link if available */}
            {meeting.link && (
              <div className="mt-4 pt-4 border-t border-[#2F304D]/30">
                <a
                  href={meeting.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 text-sm",
                    "text-[#FF5A81]/90 hover:text-[#FF5A81]",
                    "transition-colors duration-200"
                  )}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>Join Meeting</span>
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 