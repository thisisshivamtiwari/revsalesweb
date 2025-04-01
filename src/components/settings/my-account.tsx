import { useState, useEffect } from "react"
import { useGetUserDetailsQuery, useEditUserMutation, useGetDepartmentsQuery, useGetDesignationsQuery } from "@/lib/features/user/userApi"
import { useImageUpload } from "@/lib/utils/image"
import { toast } from "react-hot-toast"
import { Loader2, Camera, ChevronLeft } from "lucide-react"
import type { Department, Designation } from "@/lib/types/user"

interface MyAccountProps {
  onBack: () => void
  initialProfile: {
    departmentId: number
    designationId: number
    phoneNumber: string
    fullName: string
    email: string
    profileImg: string
  }
  onSave: (updatedProfile: {
    departmentId: number
    designationId: number
    phoneNumber: string
    fullName: string
    email: string
    profileImg: string
  }) => void
}

export function MyAccount({ onBack, onSave }: MyAccountProps) {
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    departmentId: 0,
    designationId: 0,
    profileImg: "",
  })
  const [initialFormData, setInitialFormData] = useState({...formData})

  const { data: userData, isLoading: isLoadingUser } = useGetUserDetailsQuery()
  const { data: departmentsData } = useGetDepartmentsQuery()
  const { data: designationsData, isLoading: isLoadingDesignations } = useGetDesignationsQuery(formData.departmentId)
  const [editUser] = useEditUserMutation()
  const { uploadImageFile, isLoading: isUploadingImage } = useImageUpload()

  useEffect(() => {
    if (userData?.data.user) {
      const user = userData.data.user
      const newFormData = {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber.toString(),
        departmentId: user.departmentId,
        designationId: user.designationId,
        profileImg: user.profileImg,
      }
      setFormData(newFormData)
      setInitialFormData(newFormData)
    }
  }, [userData])

  useEffect(() => {
    const hasChanges = Object.keys(formData).some(
      key => formData[key as keyof typeof formData] !== initialFormData[key as keyof typeof initialFormData]
    )
    setIsFormDirty(hasChanges)
  }, [formData, initialFormData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departmentId = Number(e.target.value)
    setFormData(prev => ({ 
      ...prev, 
      departmentId,
      designationId: 0 // Reset designation when department changes
    }))
  }

  const handleDesignationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!formData.departmentId) {
      toast.error("Please select a department first")
      return
    }
    setFormData(prev => ({ ...prev, designationId: Number(e.target.value) }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imageUrl = await uploadImageFile(file)
      setFormData(prev => ({ ...prev, profileImg: imageUrl }))
    } catch (error) {
      toast.error("Failed to upload image")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.departmentId) {
      toast.error("Please select a department")
      return
    }

    if (!formData.designationId) {
      toast.error("Please select a designation")
      return
    }

    try {
      await editUser({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        departmentId: formData.departmentId,
        designationId: formData.designationId,
        profileImg: formData.profileImg,
      }).unwrap()
      
      setInitialFormData(formData)
      setIsFormDirty(false)
      onSave(formData)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1C1D2E]">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF5A81]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1C1D2E] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 bg-[#262837] rounded-lg hover:bg-[#2A2C3E]"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h2 className="text-3xl font-bold ml-8">Account & Profile Settings</h2>
        </div>

        <div className="bg-[#262837] rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative group">
              <div className="flex justify-center mb-12">
                <div className="relative">
                  <div className="w-36 h-36 rounded-full overflow-hidden bg-[#1C1D2E] ring-4 ring-[#1C1D2E] group-hover:ring-[#FF5A81] transition-all duration-300 shadow-2xl">
                    {formData.profileImg ? (
                      <img
                        src={formData.profileImg}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#1C1D2E]">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <label 
                    htmlFor="profile-image" 
                    className="absolute bottom-2 right-2 p-3 bg-[#FF5A81] rounded-full cursor-pointer hover:bg-[#FF4371] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </label>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                  />
                </div>
              </div>
              {isUploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <Loader2 className="w-8 h-8 animate-spin text-[#FF5A81]" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Full Name</label>
                <div className="relative">
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Phone Number</label>
                <div className="relative">
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Department</label>
                <div className="relative">
                  <select
                    value={formData.departmentId}
                    onChange={handleDepartmentChange}
                    className="w-full px-4 py-3 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select Department</option>
                    {departmentsData?.data.departments.map((dept: Department) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Designation</label>
                <div className="relative">
                  <select
                    value={formData.designationId}
                    onChange={handleDesignationChange}
                    className="w-full px-4 py-3 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#1C1D2E]"
                    required
                    disabled={!formData.departmentId || isLoadingDesignations}
                  >
                    <option value="">Select Designation</option>
                    {designationsData?.data.designations.map((desig: Designation) => (
                      <option key={desig.id} value={desig.id}>
                        {desig.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-8 border-t border-gray-700/50">
              {isFormDirty && (
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#FF5A81] text-white rounded-lg font-medium hover:bg-[#FF4371] transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF5A81] focus:ring-offset-2 focus:ring-offset-[#262837] shadow-lg hover:shadow-xl"
                >
                  Save Changes
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 