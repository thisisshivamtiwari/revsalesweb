import { useState } from "react"
import {
  Building2,
  Upload,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  MapPin,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface OrganizationSettings {
  companyName: string
  category: string
  gstNumber: string
  profilePic: string
  teamSize: string
  email: string
  brandColor: string
  phoneNumber: string
  managedHotel: number
  slogan: string
  about: string
  aboutFounder: string
  aboutTeam: string
  featuredImage: string[]
  socialMedia: {
    facebook: string
    twitter: string
    linkedIn: string
    instagram: string
    youtube: string
    website: string
  }
  address: {
    latitude: string
    longitude: string
    city: string
    pinCode: string
    state: string
    country: string
    fullAddress: string
  }
}

export function OrganizationSettings() {
  const [settings, setSettings] = useState<OrganizationSettings>({
    companyName: "Retvens Services",
    category: "Hospitality",
    gstNumber: "27AABCU9603R1ZN",
    profilePic: "https://static.wixstatic.com/media/deab04_b9b37b349ee844a08386c5574cab99af~mv2.png/v1/crop/x_0,y_18,w_1141,h_449/fill/w_296,h_116,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/WIth%20out%20BG_edited.png",
    teamSize: "50-100",
    email: "cso@retvensservices.com",
    brandColor: "#7dff77",
    phoneNumber: "+919165277277",
    managedHotel: 100,
    slogan: "Strategize,Lead,Succeed",
    about: "Retvens services Pvt Ltd is a leading hospitality provider,We are the only Revenue Management Company with a team of Industry Experts We've built a Hotel Chain We know how to Maximize Experience of over 15 yrs in the field of revenue management",
    aboutFounder: "Prashant Mishra is the Founder and CEO of Retvens Services, Central Asia's largest revenue management firm for the hospitality industry. With a BscAIT degree and over 15 years of experience in various roles and segments of the hotel business, Prashant has a deep understanding of the market dynamics, customer behavior, and revenue optimization strategies that drive the growth and profitability of hotels.Prashant's entrepreneurial journey began in 2020, when he co-founded Playotel Hotels, a chain of budget-friendly and tech-enabled hotels that catered to the emerging segment of young and savvy travelers. Prashant was instrumental in building the brand, securing funding, and scaling the operations across multiple locations. He also led the revenue management function, leveraging his analytical skills and industry knowledge to maximize the occupancy, average daily rate, and revenue per available room of each property. In 2022, Prashant decided to pursue his vision of creating a dedicated revenue management service provider for the hospitality industry, and launched Retvens Services. Since then, he has grown the company to serve over 150 hotels nationwide, with an exceptional retention rate of 97%. Prashant's mission is to empower hoteliers with data-driven insights, innovative solutions, and best practices that help them optimize their revenue potential and achieve their business goals.",
    aboutTeam: "Our team consists of seasoned professionals from the hospitality and tourism sectors.",
    featuredImage: [
      "https://example.com/images/hotel1.jpg",
      "https://example.com/images/hotel2.jpg",
      "https://example.com/images/hotel3.jpg"
    ],
    socialMedia: {
      facebook: "https://www.facebook.com/retvensservices",
      twitter: "https://x.com/retvensservices",
      linkedIn: "https://www.linkedin.com/company/retvensservices",
      instagram: "https://www.instagram.com/retvensservices/",
      youtube: "https://www.youtube.com/channel/UCnaSO7-jD3J4dk-VEKI7F1A",
      website: "https://www.retvensservices.com/"
    },
    address: {
      latitude: "19.0760",
      longitude: "72.8777",
      city: "Mumbai",
      pinCode: "400001",
      state: "Maharashtra",
      country: "India",
      fullAddress: "208, Incuspaze Apollo Premier, Vijay Nagar, Indore, Madhya Pradesh 452010"
    }
  })

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'featured') => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      if (type === 'profile') {
        setSettings(prev => ({ ...prev, profilePic: imageUrl }))
      } else {
        setSettings(prev => ({
          ...prev,
          featuredImage: [...prev.featuredImage, imageUrl]
        }))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Settings updated:", settings)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Company Profile Section */}
      <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Company Profile</h2>
        <div className="space-y-6">
          {/* Logo Upload */}
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <img
                src={settings.profilePic}
                alt="Company Logo"
                className="w-full h-full object-contain border-2 border-[#2F304D] rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "https://via.placeholder.com/128x128"
                }}
              />
              <label
                htmlFor="company-logo"
                className="absolute bottom-2 right-2 p-1.5 bg-[#FF5A81] rounded-full cursor-pointer hover:bg-[#FF5A81]/90 transition-colors"
              >
                <Upload className="w-4 h-4 text-white" />
              </label>
              <input
                type="file"
                id="company-logo"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'profile')}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <p className="text-gray-400 text-sm">
                Upload your company logo. Recommended size: 256x256px.
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="companyName" className="text-sm font-medium text-gray-300">
                Company Name
              </label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-gray-300">
                Category
              </label>
              <Input
                id="category"
                value={settings.category}
                onChange={(e) => setSettings(prev => ({ ...prev, category: e.target.value }))}
                className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gstNumber" className="text-sm font-medium text-gray-300">
                GST Number
              </label>
              <Input
                id="gstNumber"
                value={settings.gstNumber}
                onChange={(e) => setSettings(prev => ({ ...prev, gstNumber: e.target.value }))}
                className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="teamSize" className="text-sm font-medium text-gray-300">
                Team Size
              </label>
              <Input
                id="teamSize"
                value={settings.teamSize}
                onChange={(e) => setSettings(prev => ({ ...prev, teamSize: e.target.value }))}
                className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <Input
                id="phoneNumber"
                value={settings.phoneNumber}
                onChange={(e) => setSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="brandColor" className="text-sm font-medium text-gray-300">
                Brand Color
              </label>
              <div className="flex items-center gap-3">
                <Input
                  id="brandColor"
                  type="color"
                  value={settings.brandColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, brandColor: e.target.value }))}
                  className="w-12 h-12 p-1 bg-[#2F304D]/10 border-[#2F304D]/20"
                />
                <Input
                  type="text"
                  value={settings.brandColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, brandColor: e.target.value }))}
                  className="flex-1 bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="managedHotel" className="text-sm font-medium text-gray-300">
                Managed Hotels
              </label>
              <Input
                id="managedHotel"
                type="number"
                value={settings.managedHotel}
                onChange={(e) => setSettings(prev => ({ ...prev, managedHotel: Number(e.target.value) }))}
                className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Company Description Section */}
      <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Company Description</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="slogan" className="text-sm font-medium text-gray-300">
              Company Slogan
            </label>
            <Input
              id="slogan"
              value={settings.slogan}
              onChange={(e) => setSettings(prev => ({ ...prev, slogan: e.target.value }))}
              className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="about" className="text-sm font-medium text-gray-300">
              About Company
            </label>
            <Textarea
              id="about"
              value={settings.about}
              onChange={(e) => setSettings(prev => ({ ...prev, about: e.target.value }))}
              className="min-h-[100px] bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="aboutFounder" className="text-sm font-medium text-gray-300">
              About Founder
            </label>
            <Textarea
              id="aboutFounder"
              value={settings.aboutFounder}
              onChange={(e) => setSettings(prev => ({ ...prev, aboutFounder: e.target.value }))}
              className="min-h-[150px] bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="aboutTeam" className="text-sm font-medium text-gray-300">
              About Team
            </label>
            <Textarea
              id="aboutTeam"
              value={settings.aboutTeam}
              onChange={(e) => setSettings(prev => ({ ...prev, aboutTeam: e.target.value }))}
              className="min-h-[100px] bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
            />
          </div>
        </div>
      </div>

      {/* Featured Images Section */}
      <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Featured Images</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {settings.featuredImage.map((image, index) => (
              <div key={index} className="relative aspect-video">
                <img
                  src={image}
                  alt={`Featured ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-[#2F304D]/20"
                />
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({
                    ...prev,
                    featuredImage: prev.featuredImage.filter((_, i) => i !== index)
                  }))}
                  className="absolute top-2 right-2 p-1 bg-red-500/90 rounded-full hover:bg-red-500"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center border-2 border-dashed border-[#2F304D]/40 rounded-lg p-6">
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-400">Upload Featured Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'featured')}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Social Media</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Facebook className="w-4 h-4" /> Facebook
            </label>
            <Input
              value={settings.socialMedia.facebook}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, facebook: e.target.value }
              }))}
              className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Twitter className="w-4 h-4" /> Twitter
            </label>
            <Input
              value={settings.socialMedia.twitter}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, twitter: e.target.value }
              }))}
              className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </label>
            <Input
              value={settings.socialMedia.linkedIn}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, linkedIn: e.target.value }
              }))}
              className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Instagram className="w-4 h-4" /> Instagram
            </label>
            <Input
              value={settings.socialMedia.instagram}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, instagram: e.target.value }
              }))}
              className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Youtube className="w-4 h-4" /> YouTube
            </label>
            <Input
              value={settings.socialMedia.youtube}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, youtube: e.target.value }
              }))}
              className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Website
            </label>
            <Input
              value={settings.socialMedia.website}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, website: e.target.value }
              }))}
              className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
            />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Address</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="latitude" className="text-sm font-medium text-gray-300">
                Latitude
              </label>
              <Input
                id="latitude"
                value={settings.address.latitude}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  address: { ...prev.address, latitude: e.target.value }
                }))}
                className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="longitude" className="text-sm font-medium text-gray-300">
                Longitude
              </label>
              <Input
                id="longitude"
                value={settings.address.longitude}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  address: { ...prev.address, longitude: e.target.value }
                }))}
                className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium text-gray-300">
                City
              </label>
              <Input
                id="city"
                value={settings.address.city}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value }
                }))}
                className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="pinCode" className="text-sm font-medium text-gray-300">
                PIN Code
              </label>
              <Input
                id="pinCode"
                value={settings.address.pinCode}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  address: { ...prev.address, pinCode: e.target.value }
                }))}
                className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="state" className="text-sm font-medium text-gray-300">
                State
              </label>
              <Input
                id="state"
                value={settings.address.state}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  address: { ...prev.address, state: e.target.value }
                }))}
                className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium text-gray-300">
                Country
              </label>
              <Input
                id="country"
                value={settings.address.country}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  address: { ...prev.address, country: e.target.value }
                }))}
                className="bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="fullAddress" className="text-sm font-medium text-gray-300">
              Full Address
            </label>
            <Textarea
              id="fullAddress"
              value={settings.address.fullAddress}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                address: { ...prev.address, fullAddress: e.target.value }
              }))}
              className="min-h-[100px] bg-[#2F304D]/10 border-[#2F304D]/20 text-white"
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
  )
} 