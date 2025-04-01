import { useState } from 'react'
import { format } from 'date-fns'
import { Loader2, Plus, Search, Users, ArrowLeft, X, AlertTriangle } from 'lucide-react'
import { Button } from '../ui/button'
import { useGetTeamsQuery, useCreateTeamMutation, useUpdateTeamMutation, useDeleteTeamMutation } from '@/lib/features/teams/teamsApi'
import { useGetMembersQuery } from '@/lib/features/teams/teamsApi'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog"
import type { Team } from '@/lib/types/team'
import { useToast } from '../ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ManageTeamsProps {
  onBack: () => void
}

type DialogType = 'view' | 'edit' | 'delete' | null;

export default function ManageTeams({ onBack }: ManageTeamsProps) {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [dialogType, setDialogType] = useState<DialogType>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    managerId: '',
    members: [] as string[]
  })
  const [editData, setEditData] = useState({
    managerId: '',
    addMembers: [] as string[],
    removeMembers: [] as string[]
  })

  const { data: teamsData, isLoading, error } = useGetTeamsQuery({
    limit: 5,
    offset: (page - 1) * 5,
    search: search || undefined,
  })

  const { data: membersData, isLoading: isMembersLoading } = useGetMembersQuery({
    pageNumber: 1,
    limit: 100,
    search: ''
  })

  const [createTeam] = useCreateTeamMutation()
  const [updateTeam] = useUpdateTeamMutation()
  const [deleteTeam] = useDeleteTeamMutation()

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleLoadMore = () => {
    setPage((prev) => prev + 1)
  }

  const handleTeamClick = (team: Team, type: DialogType = 'view') => {
    setSelectedTeam(team)
    setDialogType(type)
    if (type === 'edit') {
      setEditData({
        managerId: team.managerId,
        addMembers: [],
        removeMembers: []
      })
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleManagerChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      managerId: value
    }))
  }

  const handleMemberToggle = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter(id => id !== memberId)
        : [...prev.members, memberId]
    }))
  }

  const handleEditManagerChange = (value: string) => {
    setEditData(prev => ({
      ...prev,
      managerId: value
    }))
  }

  const handleMemberEditToggle = (memberId: string, currentlyInTeam: boolean) => {
    setEditData(prev => {
      if (currentlyInTeam) {
        // Member is currently in team
        return {
          ...prev,
          removeMembers: prev.removeMembers.includes(memberId)
            ? prev.removeMembers.filter(id => id !== memberId)
            : [...prev.removeMembers, memberId],
          addMembers: prev.addMembers.filter(id => id !== memberId)
        }
      } else {
        // Member is not in team
        return {
          ...prev,
          addMembers: prev.addMembers.includes(memberId)
            ? prev.addMembers.filter(id => id !== memberId)
            : [...prev.addMembers, memberId],
          removeMembers: prev.removeMembers.filter(id => id !== memberId)
        }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createTeam({
        team: {
          name: formData.name,
          managerId: formData.managerId,
          members: formData.members.map(userId => ({ userId }))
        }
      }).unwrap()
      
      toast({
        title: "Success",
        description: "Team created successfully",
      })
      setShowAddForm(false)
      setFormData({
        name: '',
        managerId: '',
        members: []
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleUpdateTeam = async () => {
    if (!selectedTeam) return

    try {
      const members = [
        ...editData.addMembers.map(userId => ({ userId, type: 'add' as const })),
        ...editData.removeMembers.map(userId => ({ userId, type: 'remove' as const }))
      ]

      if (members.length === 0 && editData.managerId === selectedTeam.managerId) {
        toast({
          title: "No Changes",
          description: "No changes were made to the team.",
        })
        return
      }

      await updateTeam({
        team: {
          id: selectedTeam.id,
          managerId: editData.managerId,
          members
        }
      }).unwrap()

      toast({
        title: "Success",
        description: "Team updated successfully",
      })
      setSelectedTeam(null)
      setDialogType(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteTeam = async () => {
    if (!selectedTeam) return

    try {
      await deleteTeam(selectedTeam.id).unwrap()
      
      toast({
        title: "Success",
        description: "Team deleted successfully",
      })
      setSelectedTeam(null)
      setDialogType(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete team. Please try again.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1D2E] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 bg-[#262837] rounded-lg hover:bg-[#2A2C3E]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h2 className="text-3xl font-bold ml-8">Manage Teams</h2>
        </div>

        <div className="bg-[#262837] rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600"
                />
              </div>
            </div>
            <Button className="bg-[#FF5A81] hover:bg-[#FF4371] text-white flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl" onClick={() => setShowAddForm(true)}>
              <Plus className="w-5 h-5" />
              Add New Team
            </Button>
          </div>

          <div className="space-y-4">
            {isLoading && page === 1 ? (
              <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF5A81]" />
              </div>
            ) : error ? (
              <div className="flex h-[400px] items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-red-400">Error loading teams</h3>
                  <p className="text-sm text-gray-400">Please try again later</p>
                </div>
              </div>
            ) : !teamsData?.data?.team?.length ? (
              <div className="flex h-[400px] items-center justify-center">
                <div className="text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-white">No teams found</h3>
                  <p className="text-sm text-gray-400">
                    Create a new team to get started
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4">
                  {teamsData.data.team.map((team) => (
                    <Card 
                      key={team.id} 
                      className="bg-[#1C1D2E] border-2 border-[#1C1D2E] hover:border-gray-600 cursor-pointer transition-all duration-200"
                      onClick={() => handleTeamClick(team)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                            <p className="text-sm text-gray-400">
                              Managed by {team.managerName} · Created {format(new Date(team.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex -space-x-2">
                              {team.members.slice(0, 3).map((member) => (
                                <Avatar key={member._id} className="h-8 w-8 border-2 border-[#262837]">
                                  <AvatarFallback className="text-xs bg-[#FF5A81] text-white">
                                    {member.userId.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {team.members.length > 3 && (
                                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#262837] bg-[#1C1D2E] text-white">
                                  <span className="text-xs">
                                    +{team.members.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>
                            <Badge className="bg-[#FF5A81]/10 text-[#FF5A81] border border-[#FF5A81]/20">
                              {team.teamSize} Members
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {teamsData.data.totalCount > teamsData.data.team.length && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="border-gray-700 text-gray-400 hover:bg-[#2A2C3E] hover:text-white"
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Load More
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedTeam && dialogType === 'view'} onOpenChange={() => { setSelectedTeam(null); setDialogType(null); }}>
        <DialogContent className="sm:max-w-[600px] bg-[#1C1D2E] border border-gray-800 text-white p-0 rounded-2xl shadow-2xl">
          <DialogHeader className="p-8 pb-2">
            <DialogTitle className="text-4xl font-bold text-white tracking-tight">{selectedTeam?.name}</DialogTitle>
            <DialogDescription className="text-lg text-gray-400 mt-2">
              Team Details and Management
            </DialogDescription>
          </DialogHeader>
          {selectedTeam && (
            <div className="p-8 pt-4">
              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-medium text-gray-400 mb-4">Team Information</h4>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="bg-[#262837] p-4 rounded-xl">
                      <p className="text-sm text-gray-400 mb-1">Manager</p>
                      <p className="text-lg text-white font-medium">{selectedTeam.managerName}</p>
                    </div>
                    <div className="bg-[#262837] p-4 rounded-xl">
                      <p className="text-sm text-gray-400 mb-1">Created</p>
                      <p className="text-lg text-white font-medium">{format(new Date(selectedTeam.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-gray-400 mb-4">Team Members ({selectedTeam.teamSize})</h4>
                  <div className="space-y-3">
                    {selectedTeam.members.map((member) => (
                      <div 
                        key={member._id} 
                        className="flex items-center space-x-4 p-4 rounded-xl bg-[#262837] hover:bg-[#2A2C3E] transition-all duration-200 cursor-pointer group"
                      >
                        <Avatar className="h-12 w-12 ring-2 ring-[#FF5A81]/20 group-hover:ring-[#FF5A81]/40 transition-all duration-200">
                          <AvatarFallback className="text-base bg-[#FF5A81] text-white uppercase">
                            {member.userId.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-base font-medium text-white group-hover:text-[#FF5A81] transition-colors duration-200">{member.userId}</p>
                          <p className="text-sm text-gray-400">Member</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-8 mt-8 border-t border-gray-800">
                <Button 
                  variant="outline" 
                  onClick={() => { setSelectedTeam(null); setDialogType(null); }}
                  className="px-6 py-2 bg-[#262837] border-gray-700 text-gray-300 hover:bg-[#2A2C3E] hover:text-white hover:border-gray-600 text-base font-medium transition-all duration-200"
                >
                  Close
                </Button>
                <Button 
                  onClick={() => handleTeamClick(selectedTeam!, 'edit')}
                  className="px-6 py-2 bg-[#FF5A81] hover:bg-[#FF4371] text-white text-base font-medium shadow-lg hover:shadow-[#FF5A81]/20 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Edit Team
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedTeam && dialogType === 'edit'} onOpenChange={() => { setSelectedTeam(null); setDialogType(null); }}>
        <DialogContent className="sm:max-w-[600px] bg-[#1C1D2E] border border-gray-800 text-white p-8 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Team</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update team manager and members
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Team Manager</label>
                <Select
                  value={editData.managerId}
                  onValueChange={handleEditManagerChange}
                >
                  <SelectTrigger className="w-full px-4 py-3 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 hover:border-gray-700">
                    <div className="flex items-center gap-3">
                      {editData.managerId && membersData?.data.members ? (
                        <>
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={membersData.data.members.find(m => m.id === editData.managerId)?.profileImg} 
                              alt="Manager" 
                            />
                            <AvatarFallback className="bg-[#FF5A81] text-white">
                              {membersData.data.members.find(m => m.id === editData.managerId)?.fullName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-white">
                              {membersData.data.members.find(m => m.id === editData.managerId)?.fullName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {membersData.data.members.find(m => m.id === editData.managerId)?.designationName}
                            </p>
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">Select Team Manager</span>
                      )}
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C1D2E] border border-gray-800 p-0 shadow-xl">
                    <div className="max-h-[280px] overflow-y-auto">
                      {isMembersLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-6 h-6 animate-spin text-[#FF5A81]" />
                        </div>
                      ) : membersData?.data.members.map((member) => (
                        <SelectItem 
                          key={member.id} 
                          value={member.id}
                          className="focus:bg-[#262837] focus:text-white hover:bg-[#262837] cursor-pointer px-3 py-2"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarImage src={member.profileImg} alt={member.fullName} />
                              <AvatarFallback className="bg-[#FF5A81] text-white">
                                {member.fullName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {member.fullName}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="truncate">{member.designationName}</span>
                                <span>•</span>
                                <span>{member.phoneNumber}</span>
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Team Members</label>
                <div className="w-full px-4 py-3 bg-[#262837] text-white rounded-lg border-2 border-[#262837] focus-within:border-[#FF5A81] transition-all duration-200">
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-2">
                      {membersData?.data.members
                        .filter(member => member.id !== editData.managerId)
                        .map(member => {
                          const isCurrentMember = selectedTeam?.members.some(m => m.userId === member.id) ?? false
                          const isMarkedForRemoval = editData.removeMembers.includes(member.id)
                          const isMarkedForAddition = editData.addMembers.includes(member.id)

                          return (
                            <div
                              key={member.id}
                              onClick={() => handleMemberEditToggle(member.id, isCurrentMember)}
                              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                                isMarkedForRemoval
                                  ? 'bg-red-500/10'
                                  : isMarkedForAddition
                                  ? 'bg-green-500/10'
                                  : isCurrentMember
                                  ? 'bg-[#FF5A81]/10'
                                  : 'hover:bg-[#2A2C3E]'
                              }`}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.profileImg} alt={member.fullName} />
                                <AvatarFallback className="bg-[#FF5A81] text-white">
                                  {member.fullName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{member.fullName}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <span>{member.designationName}</span>
                                  <span>•</span>
                                  <span>{member.phoneNumber}</span>
                                </div>
                              </div>
                              {isMarkedForRemoval ? (
                                <Badge className="bg-red-500/20 text-red-500 border-red-500/20">
                                  Remove
                                </Badge>
                              ) : isMarkedForAddition ? (
                                <Badge className="bg-green-500/20 text-green-500 border-green-500/20">
                                  Add
                                </Badge>
                              ) : isCurrentMember ? (
                                <Badge className="bg-[#FF5A81]/10 text-[#FF5A81] border-[#FF5A81]/20">
                                  Member
                                </Badge>
                              ) : null}
                            </div>
                          )
                        })}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleTeamClick(selectedTeam!, 'delete')}
                className="px-6 py-2 bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-base font-medium transition-all duration-200"
              >
                Delete Team
              </Button>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setSelectedTeam(null); setDialogType(null); }}
                  className="px-6 py-2 bg-[#262837] border-gray-700 text-gray-300 hover:bg-[#2A2C3E] hover:text-white hover:border-gray-600 text-base font-medium transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleUpdateTeam}
                  className="px-6 py-2 bg-[#FF5A81] hover:bg-[#FF4371] text-white text-base font-medium shadow-lg hover:shadow-[#FF5A81]/20 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Update Team
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedTeam && dialogType === 'delete'} onOpenChange={() => { setSelectedTeam(null); setDialogType(null); }}>
        <DialogContent className="sm:max-w-[400px] bg-[#1C1D2E] border border-gray-800 text-white p-6 rounded-2xl shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <DialogTitle className="text-xl font-bold mb-2">Delete Team</DialogTitle>
            <DialogDescription className="text-gray-400 mb-6">
              Are you sure you want to delete "{selectedTeam?.name}"? This action cannot be undone.
            </DialogDescription>
          </div>

          <DialogFooter className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setSelectedTeam(null); setDialogType(null); }}
              className="px-6 py-2 bg-[#262837] border-gray-700 text-gray-300 hover:bg-[#2A2C3E] hover:text-white hover:border-gray-600 text-base font-medium transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleDeleteTeam}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-base font-medium shadow-lg hover:shadow-red-500/20 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Delete Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px] bg-[#1C1D2E] border border-gray-800 text-white p-8 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Team</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add a new team and assign members
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Team Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-[#262837] text-white rounded-lg border-2 border-[#262837] focus:border-[#FF5A81] focus:outline-none transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Team Manager</label>
                <Select
                  value={formData.managerId}
                  onValueChange={handleManagerChange}
                >
                  <SelectTrigger className="w-full px-4 py-3 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 hover:border-gray-700">
                    <div className="flex items-center gap-3">
                      {formData.managerId && membersData?.data.members ? (
                        <>
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={membersData.data.members.find(m => m.id === formData.managerId)?.profileImg} 
                              alt="Manager" 
                            />
                            <AvatarFallback className="bg-[#FF5A81] text-white">
                              {membersData.data.members.find(m => m.id === formData.managerId)?.fullName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-white">
                              {membersData.data.members.find(m => m.id === formData.managerId)?.fullName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {membersData.data.members.find(m => m.id === formData.managerId)?.designationName}
                            </p>
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">Select Team Manager</span>
                      )}
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-[#1C1D2E] border border-gray-800 p-0 shadow-xl">
                    <div className="max-h-[280px] overflow-y-auto">
                      {isMembersLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-6 h-6 animate-spin text-[#FF5A81]" />
                        </div>
                      ) : membersData?.data.members.map((member) => (
                        <SelectItem 
                          key={member.id} 
                          value={member.id}
                          className="focus:bg-[#262837] focus:text-white hover:bg-[#262837] cursor-pointer px-3 py-2"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarImage src={member.profileImg} alt={member.fullName} />
                              <AvatarFallback className="bg-[#FF5A81] text-white">
                                {member.fullName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {member.fullName}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="truncate">{member.designationName}</span>
                                <span>•</span>
                                <span>{member.phoneNumber}</span>
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Team Members</label>
                <div className="w-full px-4 py-3 bg-[#262837] text-white rounded-lg border-2 border-[#262837] focus-within:border-[#FF5A81] transition-all duration-200">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.members.map(memberId => {
                      const member = membersData?.data.members.find(m => m.id === memberId)
                      if (!member) return null
                      
                      return (
                        <Badge
                          key={member.id}
                          className="bg-[#FF5A81]/10 text-[#FF5A81] border border-[#FF5A81]/20 pl-2 pr-1 py-1 flex items-center gap-1"
                        >
                          <span>{member.fullName}</span>
                          <button
                            type="button"
                            onClick={() => handleMemberToggle(member.id)}
                            className="hover:bg-[#FF5A81]/20 rounded p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )
                    })}
                  </div>
                  <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-2">
                      {membersData?.data.members
                        .filter(member => member.id !== formData.managerId)
                        .map(member => (
                          <div
                            key={member.id}
                            onClick={() => handleMemberToggle(member.id)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                              formData.members.includes(member.id)
                                ? 'bg-[#FF5A81]/10'
                                : 'hover:bg-[#2A2C3E]'
                            }`}
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.profileImg} alt={member.fullName} />
                              <AvatarFallback className="bg-[#FF5A81] text-white">
                                {member.fullName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{member.fullName}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>{member.designationName}</span>
                                <span>•</span>
                                <span>{member.phoneNumber}</span>
                              </div>
                            </div>
                            {formData.members.includes(member.id) && (
                              <Badge className="bg-[#FF5A81] text-white">Selected</Badge>
                            )}
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-[#262837] border-gray-700 text-gray-300 hover:bg-[#2A2C3E] hover:text-white hover:border-gray-600 text-base font-medium transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 bg-[#FF5A81] hover:bg-[#FF4371] text-white text-base font-medium shadow-lg hover:shadow-[#FF5A81]/20 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Create Team
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 