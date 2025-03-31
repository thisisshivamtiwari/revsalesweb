import { useState } from "react"
import { ChevronLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface UserProfile {
  departmentId: number
  designationId: number
  phoneNumber: string
  fullName: string
  email: string
  profileImg: string
}

interface MyAccountProps {
  onBack: () => void
}

export function MyAccount({ onBack }: MyAccountProps) {
  const [profile, setProfile] = useState<UserProfile>({
    departmentId: 56464,
    designationId: 45454,
    phoneNumber: "9165374616",
    fullName: "test",
    email: "asdfghjk",
    profileImg: "profileImgURL"
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Handle image upload logic here
      const imageUrl = URL.createObjectURL(file)
      setProfile(prev => ({ ...prev, profileImg: imageUrl }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Profile updated:", profile)
  }

  return (
    <div className="min-h-screen bg-[#1C1D2E] p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-white">My Account</h1>
      </div>

      {/* Profile Form */}
      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image Section */}
          <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Profile Image</h2>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <img
                  src={profile.profileImg}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-2 border-[#2F304D]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "https://via.placeholder.com/96x96"
                  }}
                />
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 p-1.5 bg-[#FF5A81] rounded-full cursor-pointer hover:bg-[#FF5A81]/90 transition-colors"
                >
                  <Upload className="w-4 h-4 text-white" />
                </label>
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <p className="text-gray-400 text-sm">
                  Upload a new profile picture. Recommended size: 256x256px.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                  className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-300">
                  Phone Number
                </label>
                <Input
                  id="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={(e) => setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="departmentId" className="text-sm font-medium text-gray-300">
                  Department ID
                </label>
                <Input
                  id="departmentId"
                  type="number"
                  value={profile.departmentId}
                  onChange={(e) => setProfile(prev => ({ ...prev, departmentId: Number(e.target.value) }))}
                  className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
                  placeholder="Enter department ID"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="designationId" className="text-sm font-medium text-gray-300">
                  Designation ID
                </label>
                <Input
                  id="designationId"
                  type="number"
                  value={profile.designationId}
                  onChange={(e) => setProfile(prev => ({ ...prev, designationId: Number(e.target.value) }))}
                  className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
                  placeholder="Enter designation ID"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90 px-6"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 