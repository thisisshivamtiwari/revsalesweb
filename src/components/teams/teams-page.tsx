import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Trophy, Target, DollarSign, Users, Search, Plus } from 'lucide-react';
import { useGetUserPerformanceQuery } from '@/lib/features/teams/teamsApi';
import { VerticalNavigation } from '@/components/ui/vertical-navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface TeamMember {
  fullName: string;
  totalLeads: number;
  amountClosed: number;
  userId: string;
}

export function TeamsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { data, isLoading, error } = useGetUserPerformanceQuery();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1C1D2E] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-t-[#FF5A81] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading team data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1C1D2E] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-xl font-bold">Failed to load team data</h2>
          <p className="text-gray-400">Please try again later or contact support</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const teamMembers = data?.data.performance || [];
  const filteredTeamMembers = teamMembers.filter(member =>
    member.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const totalTeamMembers = teamMembers.length;
  const totalTeamLeads = teamMembers.reduce((sum, member) => sum + member.totalLeads, 0);
  const totalTeamAmount = teamMembers.reduce((sum, member) => sum + member.amountClosed, 0);

  return (
    <div className="min-h-screen bg-[#1C1D2E] text-white pb-20 md:pb-0">
      <VerticalNavigation />
      <div className="px-4 md:ml-28 md:max-w-[calc(100vw-144px)] md:px-6 py-4">
        {/* User Info Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#242744] border-2 border-[#2F304D]/20 flex items-center justify-center">
              <User className="w-6 h-6 text-gray-400" />
            </div>
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

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-[#242744]/30 backdrop-blur-lg rounded-3xl border border-[#2F304D]/20 p-4 md:p-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Members</p>
                <h3 className="text-2xl font-bold">{totalTeamMembers}</h3>
              </div>
            </div>
          </div>
          <div className="bg-[#242744]/30 backdrop-blur-lg rounded-3xl border border-[#2F304D]/20 p-4 md:p-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Leads</p>
                <h3 className="text-2xl font-bold">{totalTeamLeads}</h3>
              </div>
            </div>
          </div>
          <div className="bg-[#242744]/30 backdrop-blur-lg rounded-3xl border border-[#2F304D]/20 p-4 md:p-6">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#FF5A81]/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#FF5A81]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <h3 className="text-2xl font-bold">₹{totalTeamAmount.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-6">
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search team members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full bg-[#242744]/50 border-[#2F304D]/20 text-white placeholder:text-gray-400"
            />
          </div>
          <Button className="w-full md:w-auto bg-[#FF5A81] hover:bg-[#FF5A81]/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        {/* Team Members List */}
        <div className="bg-[#242744]/30 backdrop-blur-lg rounded-3xl border border-[#2F304D]/20 overflow-hidden">
          <div className="p-4 md:p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Team Members
            </h2>
            
            <div className="space-y-4">
              {filteredTeamMembers.map((member) => (
                <div
                  key={member.userId}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 p-4 bg-[#242744]/50 rounded-xl border border-[#2F304D]/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#242744] border-2 border-[#2F304D]/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">{member.fullName}</h3>
                      <p className="text-sm text-gray-400">#{member.userId}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 mt-2 md:mt-0">
                    <div>
                      <p className="text-sm text-gray-400">Leads</p>
                      <p className="font-medium text-right">{member.totalLeads}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Revenue</p>
                      <p className="font-medium text-right">₹{member.amountClosed.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 