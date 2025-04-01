import { useState } from 'react'
import { Plus, Search, Loader2, ArrowLeft, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { useAddMemberMutation, useGetMembersQuery } from '@/lib/features/teams/teamsApi'
import { useGetDepartmentsQuery, useGetDesignationsQuery } from '@/lib/features/user/userApi'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { useToast } from '../ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ManageMembersProps {
  onBack: () => void
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50]

export default function ManageMembers({ onBack }: ManageMembersProps) {
  const { toast } = useToast()
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [formData, setFormData] = useState({
    departmentId: 0,
    designationId: 0,
    email: '',
    fullName: '',
    nickName: '',
    phoneNumber: '',
    reportTo: ''
  })

  const [addMember] = useAddMemberMutation()
  const { data: departmentsData } = useGetDepartmentsQuery()
  const { data: designationsData } = useGetDesignationsQuery(formData.departmentId || 0)
  const { data: membersData, isLoading: isMembersLoading } = useGetMembersQuery({
    pageNumber: currentPage,
    limit: itemsPerPage,
    search: searchQuery
  })

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'departmentId' || name === 'designationId' ? Number(value) : value
    }))
  }

  const handleReportToChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      reportTo: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addMember({
        ...formData,
        phoneNumber: Number(formData.phoneNumber)
      })
      
      toast({
        title: "Success",
        description: "Member added successfully",
      })
      setShowAddForm(false)
      setFormData({
        departmentId: 0,
        designationId: 0,
        email: '',
        fullName: '',
        nickName: '',
        phoneNumber: '',
        reportTo: ''
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add member. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const totalPages = membersData ? Math.ceil(membersData.data.total / itemsPerPage) : 0

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
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
          <h2 className="text-3xl font-bold ml-8">Manage Members</h2>
        </div>

        <div className="bg-[#262837] rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600 px-3 py-2"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map(option => (
                    <option key={option} value={option}>
                      {option} items
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-[#FF5A81] hover:bg-[#FF4371] text-white flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Member
            </Button>
          </div>

          {isMembersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF5A81]" />
            </div>
          ) : !membersData?.data.members.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-[#1C1D2E] rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No members found</h3>
              <p className="text-gray-400">Try adjusting your search or add a new member</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {membersData.data.members.map((member) => (
                  <div 
                    key={member.id}
                    className="bg-[#1C1D2E] rounded-xl p-6 border-2 border-[#1C1D2E] hover:border-gray-600 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-[#FF5A81]/20">
                          <AvatarImage src={member.profileImg} alt={member.fullName} />
                          <AvatarFallback className="bg-[#FF5A81] text-white">
                            {member.fullName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-medium text-white">{member.fullName}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-400">{member.email}</span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-400">{member.phoneNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <Badge className="bg-[#FF5A81]/10 text-[#FF5A81] border border-[#FF5A81]/20">
                          {member.designationName}
                        </Badge>
                        <div className="flex items-center gap-3">
                          <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
                  <div className="text-sm text-gray-400">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, membersData.data.total)} of {membersData.data.total} members
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-8 h-8 p-0 border-gray-700"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          const showAround = Math.abs(page - currentPage) <= 1
                          const isFirstOrLast = page === 1 || page === totalPages
                          return showAround || isFirstOrLast
                        })
                        .map((page, index, array) => (
                          <>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span key={`ellipsis-${page}`} className="text-gray-600">...</span>
                            )}
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              onClick={() => handlePageChange(page)}
                              className={`w-8 h-8 p-0 ${
                                currentPage === page
                                  ? "bg-[#FF5A81] hover:bg-[#FF4371]"
                                  : "border-gray-700"
                              }`}
                            >
                              {page}
                            </Button>
                          </>
                        ))}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 p-0 border-gray-700"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px] bg-[#1C1D2E] border border-gray-800 text-white p-8 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Member</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add a new member to your team
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-[#262837] text-white rounded-lg border-2 border-[#262837] focus:border-[#FF5A81] focus:outline-none transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Nick Name</label>
                <input
                  type="text"
                  name="nickName"
                  value={formData.nickName}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-[#262837] text-white rounded-lg border-2 border-[#262837] focus:border-[#FF5A81] focus:outline-none transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-[#262837] text-white rounded-lg border-2 border-[#262837] focus:border-[#FF5A81] focus:outline-none transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-[#262837] text-white rounded-lg border-2 border-[#262837] focus:border-[#FF5A81] focus:outline-none transition-all duration-200"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Department</label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-[#262837] text-white rounded-lg border-2 border-[#262837] focus:border-[#FF5A81] focus:outline-none transition-all duration-200"
                  required
                >
                  <option value="">Select Department</option>
                  {departmentsData?.data.departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Designation</label>
                <select
                  name="designationId"
                  value={formData.designationId}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-[#262837] text-white rounded-lg border-2 border-[#262837] focus:border-[#FF5A81] focus:outline-none transition-all duration-200"
                  required
                  disabled={!formData.departmentId}
                >
                  <option value="">Select Designation</option>
                  {designationsData?.data.designations.map((desig) => (
                    <option key={desig.id} value={desig.id}>
                      {desig.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Report To</label>
                <Select
                  value={formData.reportTo}
                  onValueChange={handleReportToChange}
                >
                  <SelectTrigger className="w-full px-4 py-6 bg-[#262837] text-white rounded-lg border-2 border-[#262837] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 hover:border-gray-600">
                    <div className="flex items-center gap-3">
                      {formData.reportTo && membersData?.data.members ? (
                        <>
                          <Avatar className="h-8 w-8">
                            <AvatarImage 
                              src={membersData.data.members.find(m => m.id === formData.reportTo)?.profileImg} 
                              alt="Member" 
                            />
                            <AvatarFallback className="bg-[#FF5A81] text-white">
                              {membersData.data.members.find(m => m.id === formData.reportTo)?.fullName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium">
                              {membersData.data.members.find(m => m.id === formData.reportTo)?.fullName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {membersData.data.members.find(m => m.id === formData.reportTo)?.designationName}
                            </p>
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">Select Manager</span>
                      )}
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-[#262837] border-gray-700">
                    {isMembersLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-[#FF5A81]" />
                      </div>
                    ) : membersData?.data.members.map((member) => (
                      <SelectItem 
                        key={member.id} 
                        value={member.id}
                        className="focus:bg-[#2A2C3E] focus:text-white"
                      >
                        <div className="flex items-center gap-3 py-1">
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
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                Add Member
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 