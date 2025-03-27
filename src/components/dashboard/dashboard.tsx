import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VerticalNavigation } from "@/components/ui/vertical-navigation"
import { MeetingsList } from "@/components/meetings/meetings-list"
import toast from "react-hot-toast"
import { LeadsList } from '@/components/leads/leads-list'
import { Badge } from '@/components/ui/badge'
import { useGetTodaysLeadsQuery } from '@/lib/features/leads/leadsApi'
import { TasksList } from '@/components/tasks/tasks-list'
import { CallDetails } from './call-details'
import { UserPerformance } from './team-performance'

export function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "{}")
  const { data: leadsData } = useGetTodaysLeadsQuery({
    limit: 10,
    pageNumber: 1,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })

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

  return (
    <div className="min-h-screen bg-[#1C1D2E] text-white">
      <VerticalNavigation />
      <div className="ml-28 max-w-[calc(100vw-144px)] px-6 py-8">
        <div className="flex items-center justify-between mb-8">
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

        <div className="container p-0 space-y-8">
          {/* User Performance Section */}
          <div className="bg-[#242744]/30 backdrop-blur-lg rounded-3xl border border-[#2F304D]/20 overflow-hidden">
            <UserPerformance />
          </div>

          {/* Meetings and Call Statistics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Today's Meetings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Today's Meetings</h2>
                <Link 
                  to="/meetings" 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  View all
                </Link>
              </div>
              <div className="bg-[#242744]/30 backdrop-blur-lg rounded-3xl border border-[#2F304D]/20 overflow-hidden">
                <MeetingsList />
              </div>
            </div>

            {/* Call Statistics */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Call Statistics</h2>
              </div>
              <div className="bg-[#242744]/30 backdrop-blur-lg rounded-3xl border border-[#2F304D]/20 overflow-hidden">
                <CallDetails />
              </div>
            </div>
          </div>

          {/* Tasks and Leads Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Today's Tasks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Today's Tasks</h2>
                <Link 
                  to="/tasks" 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  View all
                </Link>
              </div>
              <div className="bg-[#242744]/30 backdrop-blur-lg rounded-3xl border border-[#2F304D]/20 overflow-hidden">
                <TasksList />
              </div>
            </div>

            {/* Today's Leads */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-medium">Today's Leads</h2>
                  <Badge variant="secondary" className="bg-[#2F304D] text-white">
                    {leadsData?.data.leads?.length || 0}
                  </Badge>
                </div>
                <Link 
                  to="/leads" 
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  View all
                </Link>
              </div>
              <div className="bg-[#242744]/30 backdrop-blur-lg rounded-3xl border border-[#2F304D]/20 overflow-hidden">
                <LeadsList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 