import { format } from "date-fns"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { useGetMeetingsQuery } from "@/lib/features/meetings/meetingsApi"
import { Meeting } from "@/lib/types/meetings"

export function MeetingsList() {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  const { data, isLoading, error } = useGetMeetingsQuery({
    startDate: today,
    endDate: today,
    limit: 5,
  })

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

  return (
    <div className="space-y-4">
      {data.data.meetings.map((meeting: Meeting) => (
        <div
          key={meeting.id}
          className="bg-[#242744]/30 backdrop-blur-lg rounded-xl border border-[#2F304D]/20 p-4 hover:bg-[#2F304D]/30 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-white mb-1">{meeting.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">
                {meeting.description}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                meeting.status === "scheduled"
                  ? "bg-green-500/20 text-green-400"
                  : meeting.status === "completed"
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {meeting.status}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              {format(new Date(meeting.date), "MMM d, yyyy")}
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-2" />
              {meeting.time} ({meeting.duration} min)
            </div>
            {meeting.location && (
              <div className="flex items-center text-sm text-gray-400 col-span-2">
                <MapPin className="w-4 h-4 mr-2" />
                {meeting.location}
              </div>
            )}
            <div className="flex items-center text-sm text-gray-400 col-span-2">
              <Users className="w-4 h-4 mr-2" />
              {meeting.attendees.length} attendees
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 