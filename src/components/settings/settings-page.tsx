import { useState } from "react"
import {
  User,
  Bell,
  Users,
  ScrollText,
  MessageSquareMore,
  Settings2,
  FileDown,

  FileText,
  
  Building2,
  ChevronLeft,
  Search,
  LogOut,
  Bot,
  ListTodo,
  Palette,
  Package,
  Wand2,
  CreditCard,
  Briefcase,
  Shield,
  FileArchive,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" 
import { MyAccount } from "./my-account"
import { WhatsappAutomation } from "./whatsapp-automation"

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
  onClick?: () => void
  badge?: string
}

const NavItem = ({ icon, label, isActive, onClick, badge }: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full p-2 rounded-lg text-sm font-medium transition-all duration-200",
      isActive
        ? "bg-[#FF5A81]/10 text-[#FF5A81]"
        : "text-gray-400 hover:text-white hover:bg-[#2F304D]/20"
    )}
  >
    {icon}
    <span>{label}</span>
    {badge && (
      <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-[#FF5A81]/10 text-[#FF5A81] border border-[#FF5A81]/20">
        {badge}
      </span>
    )}
  </button>
)

interface SettingsCardProps {
  title: string
  description?: string
  children: React.ReactNode
}

const SettingsCard = ({ title, description, children }: SettingsCardProps) => (
  <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
    <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
    {description && <p className="text-gray-400 text-sm mb-6">{description}</p>}
    {children}
  </div>
)

interface SettingsGridItemProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick?: () => void
  badge?: string
}

const SettingsGridItem = ({ icon, title, description, onClick, badge }: SettingsGridItemProps) => (
  <button
    onClick={onClick}
    className="flex flex-col items-start p-4 bg-[#2F304D]/10 hover:bg-[#2F304D]/20 border border-[#2F304D]/20 rounded-lg transition-all duration-200 text-left group"
  >
    <div className="flex items-center justify-between w-full mb-4">
      <div className="p-2 rounded-lg bg-[#2F304D]/20 text-gray-400 group-hover:text-white group-hover:bg-[#2F304D]/40 transition-colors">
        {icon}
      </div>
      {badge && (
        <span className="px-2 py-1 text-xs rounded-full bg-[#FF5A81]/10 text-[#FF5A81] border border-[#FF5A81]/20">
          {badge}
        </span>
      )}
    </div>
    <h3 className="text-gray-200 font-medium group-hover:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-400 group-hover:text-gray-300">{description}</p>
  </button>
)

const sections = [
  { 
    id: "account",
    label: "Account & Profile",
    icon: <User className="w-5 h-5" />
  },
  { 
    id: "notifications",
    label: "Notifications & Automation",
    icon: <Bell className="w-5 h-5" />
  },
  { 
    id: "team",
    label: "Team & Task Management",
    icon: <Users className="w-5 h-5" />
  },
  { 
    id: "customization",
    label: "Customization & Preferences",
    icon: <Settings2 className="w-5 h-5" />
  },
  { 
    id: "organization",
    label: "Organization & Disclosure",
    icon: <Building2 className="w-5 h-5" />
  },
  { 
    id: "data",
    label: "Data Management",
    icon: <FileArchive className="w-5 h-5" />
  },
]

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account")
  const [searchQuery, setSearchQuery] = useState("")
  const [showMyAccount, setShowMyAccount] = useState(false)
  const [profile, setProfile] = useState({
    departmentId: 56464,
    designationId: 45454,
    phoneNumber: "9165374616",
    fullName: "test",
    email: "asdfghjk",
    profileImg: "profileImgURL"
  })
  const [showWhatsappAutomation, setShowWhatsappAutomation] = useState(false)

  const handleProfileSave = (updatedProfile: typeof profile) => {
    setProfile(updatedProfile)
    console.log("Profile updated:", updatedProfile)
  }

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const renderContent = () => {
    if (showWhatsappAutomation) {
      return (
        <WhatsappAutomation
          onBack={() => setShowWhatsappAutomation(false)}
        />
      )
    }

    if (activeSection === "account" && !showMyAccount) {
      return (
        <div className="space-y-6">
          <SettingsCard
            title="Account & Profile Settings"
            description="Manage your account settings and preferences"
          >
            <div className="grid grid-cols-2 gap-4">
              <SettingsGridItem
                icon={<User className="w-5 h-5" />}
                title="My Account"
                description="Update your profile, personal information and preferences"
                onClick={() => setShowMyAccount(true)}
              />
              <SettingsGridItem
                icon={<LogOut className="w-5 h-5" />}
                title="Logout"
                description="Sign out from your account"
                onClick={handleLogout}
              />
            </div>
          </SettingsCard>
        </div>
      )
    }

    if (activeSection === "account" && showMyAccount) {
      return (
        <MyAccount
          onBack={() => setShowMyAccount(false)}
          initialProfile={profile}
          onSave={handleProfileSave}
        />
      )
    }

    if (activeSection === "notifications") {
      return (
        <div className="space-y-6">
          <SettingsCard
            title="Notifications & Automation Settings"
            description="Configure your notification preferences and automation settings"
          >
            <div className="grid grid-cols-2 gap-4">
              <SettingsGridItem
                icon={<Bell className="w-5 h-5" />}
                title="Notifications"
                description="Manage your notification preferences and alerts"
              />
              <SettingsGridItem
                icon={<MessageSquareMore className="w-5 h-5" />}
                title="Manage WhatsApp Automation"
                description="Configure WhatsApp automation settings and templates"
                onClick={() => setShowWhatsappAutomation(true)}
              />
            </div>
          </SettingsCard>
        </div>
      )
    }

    if (activeSection === "team") {
      return (
        <div className="space-y-6">
          <SettingsCard
            title="Team & Task Management"
            description="Manage your team, tasks, and resource distribution"
          >
            <div className="grid grid-cols-3 gap-4">
              <SettingsGridItem
                icon={<Users className="w-5 h-5" />}
                title="Manage Teams"
                description="Add, remove, and configure team members and roles"
              />
              <SettingsGridItem
                icon={<Bot className="w-5 h-5" />}
                title="Manage Lead Distribution"
                description="Configure lead assignment and distribution rules"
              />
              <SettingsGridItem
                icon={<ListTodo className="w-5 h-5" />}
                title="Manage Task Distribution"
                description="Set up task allocation and workflow rules"
              />
              <SettingsGridItem
                icon={<ScrollText className="w-5 h-5" />}
                title="Manage Script Distribution"
                description="Configure script assignments and templates"
              />
              <SettingsGridItem
                icon={<Settings2 className="w-5 h-5" />}
                title="Manage Integrations"
                description="Set up and configure third-party integrations"
              />
            </div>
          </SettingsCard>
        </div>
      )
    }

    if (activeSection === "customization") {
      return (
        <div className="space-y-6">
          <SettingsCard
            title="Customization & Preferences"
            description="Customize your workspace and manage preferences"
          >
            <div className="grid grid-cols-3 gap-4">
              <SettingsGridItem
                icon={<Palette className="w-5 h-5" />}
                title="Customization"
                description="Configure lead status, task types, and duplicate lead settings"
              />
              <SettingsGridItem
                icon={<Package className="w-5 h-5" />}
                title="Packages"
                description="Manage and customize package offerings"
              />
              <SettingsGridItem
                icon={<Wand2 className="w-5 h-5" />}
                title="Script Wizards"
                description="Create and manage script templates"
              />
              <SettingsGridItem
                icon={<FileText className="w-5 h-5" />}
                title="Proposals"
                description="Manage proposal templates and settings"
              />
              <SettingsGridItem
                icon={<CreditCard className="w-5 h-5" />}
                title="Digital Card"
                description="Customize your digital business card"
              />
              <SettingsGridItem
                icon={<Briefcase className="w-5 h-5" />}
                title="Services"
                description="Configure and manage service offerings"
              />
            </div>
          </SettingsCard>
        </div>
      )
    }

    if (activeSection === "organization") {
      return (
        <div className="space-y-6">
          <SettingsCard
            title="Organization & Disclosure"
            description="Manage organization settings and legal documents"
          >
            <div className="grid grid-cols-2 gap-4">
              <SettingsGridItem
                icon={<Building2 className="w-5 h-5" />}
                title="Organization Settings"
                description="Configure organization-wide preferences and settings"
              />
              <SettingsGridItem
                icon={<Shield className="w-5 h-5" />}
                title="Disclosure"
                description="View privacy policy and terms of use"
              />
            </div>
          </SettingsCard>
        </div>
      )
    }

    if (activeSection === "data") {
      return (
        <div className="space-y-6">
          <SettingsCard
            title="Data Management"
            description="Export and manage your organization's data"
          >
            <div className="grid grid-cols-1 gap-4">
              <SettingsGridItem
                icon={<FileDown className="w-5 h-5" />}
                title="Export Data"
                description="Download and export your organization's data"
              />
            </div>
          </SettingsCard>
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-[#1C1D2E]">
      <div className="flex">
        {/* Vertical Navigation */}
        <div className="w-72 h-screen sticky top-0 p-4 border-r border-[#2F304D]/20 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
              onClick={() => window.history.back()}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-white">Settings</h1>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 bg-[#2F304D]/10 border-[#2F304D]/20 text-white placeholder:text-gray-400"
            />
          </div>

          <nav className="space-y-1">
            {sections.map((section) => (
              <NavItem
                key={section.id}
                icon={section.icon}
                label={section.label}
                isActive={activeSection === section.id}
                onClick={() => {
                  setActiveSection(section.id)
                  if (section.id !== "account") {
                    setShowMyAccount(false)
                  }
                  setShowWhatsappAutomation(false)
                }}
              />
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
} 