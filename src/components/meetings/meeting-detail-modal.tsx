import { format, parseISO } from "date-fns"
import {
  Clock,
  MapPin,
  Users,
  Video,
  Link as LinkIcon,
  Calendar,
  MessageCircle,
  Copy,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Meeting } from "@/lib/features/meetings/meetingsApi"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import toast from "react-hot-toast"

interface MeetingDetailModalProps {
  meeting: Meeting | null
  isOpen: boolean
  onClose: () => void
}

export function MeetingDetailModal({
  meeting,
  isOpen,
  onClose,
}: MeetingDetailModalProps) {
  if (!meeting) return null

  const startTime = parseISO(meeting.startTime)
  const endTime = parseISO(meeting.endTime)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meeting.link || window.location.href)
    toast.success("Meeting link copied to clipboard")
  }

  const handleJoinMeeting = () => {
    window.open(meeting.link || window.location.href, "_blank")
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6 m-4 bg-[#1C1D2E]/60 backdrop-blur-2xl border border-white/5 text-white rounded-2xl shadow-[0_0_30px_10px_rgba(0,0,0,0.1)] before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:rounded-2xl before:opacity-50">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-semibold text-white">
              {meeting.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-white/5"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Status Badge */}
          <div>
            <span
              className={cn(
                "px-3 py-1 text-sm rounded-full border backdrop-blur-xl shadow-sm",
                getStatusColor(meeting.meetingStatus)
              )}
            >
              {meeting.meetingStatus}
            </span>
          </div>

          {/* Meeting Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-400">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl shadow-sm">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-white">
                  {format(startTime, "EEEE, MMMM d, yyyy")}
                </p>
                <p>
                  {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
                </p>
              </div>
            </div>
            {meeting.location && (
              <div className="flex items-center gap-3 text-gray-400">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl shadow-sm">
                  <MapPin className="h-5 w-5" />
                </div>
                <span>{meeting.location}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-gray-400">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl shadow-sm">
                <Video className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white">Meeting Link</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-[#FF5A81] hover:text-[#FF5A81] hover:bg-[#FF5A81]/10"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </div>

          <Separator className="bg-white/5" />

          {/* Description */}
          {meeting.description && (
            <div className="space-y-2 p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl">
              <h3 className="font-medium">Description</h3>
              <p className="text-gray-400 whitespace-pre-line">
                {meeting.description}
              </p>
            </div>
          )}

          {/* Attendees */}
          {meeting.attendees && meeting.attendees.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Attendees ({meeting.attendees.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xl">
                {meeting.attendees.map((attendee) => (
                  <div
                    key={attendee.email}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Avatar className="h-8 w-8 ring-1 ring-white/10">
                      <AvatarImage src={attendee.avatar} />
                      <AvatarFallback className="bg-[#FF5A81]/10 text-[#FF5A81]">
                        {attendee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{attendee.name}</p>
                      <p className="text-gray-400">{attendee.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              className="border-[#2F304D] bg-[#242744]/50 text-gray-400 hover:bg-[#242744] hover:text-white hover:border-[#2F304D]/50"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#FF5A81] hover:bg-[#FF5A81]/90 text-white shadow-lg shadow-[#FF5A81]/20"
              onClick={handleJoinMeeting}
            >
              <Video className="h-4 w-4 mr-2" />
              Join Meeting
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 