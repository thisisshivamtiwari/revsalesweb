import { useState } from "react"
import {
  User,
  Bell,
  Users,
  BarChart2,
  ScrollText,
  Calendar,
  MessageSquareMore,
  Settings2,
  FileDown,
  Lock,
  LogOut,
  ClipboardList,
  Package,
  Wand2,
  FileText,
  CreditCard,
  Phone,
  Wrench,
  Link,
  Building2,
  ChevronLeft,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
  { id: "account", label: "Account", icon: <User className="w-5 h-5" /> },
  { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" />, badge: "New" },
  { id: "teams", label: "Teams", icon: <Users className="w-5 h-5" /> },
  { id: "automation", label: "Automation", icon: <MessageSquareMore className="w-5 h-5" /> },
  { id: "customization", label: "Customization", icon: <Settings2 className="w-5 h-5" /> },
  { id: "integrations", label: "Integrations", icon: <Link className="w-5 h-5" /> },
  { id: "organization", label: "Organization", icon: <Building2 className="w-5 h-5" /> },
]

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState("account")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-[#1C1D2E]">
      <div className="flex">
        {/* Vertical Navigation */}
        <div className="w-64 h-screen sticky top-0 p-4 border-r border-[#2F304D]/20 space-y-6">
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
                badge={section.badge}
                isActive={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              />
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          {activeSection === "account" && (
            <div className="space-y-6">
              <SettingsCard
                title="Profile Settings"
                description="Manage your personal information and preferences"
              >
                <div className="grid grid-cols-2 gap-4">
                  <SettingsGridItem
                    icon={<User className="w-5 h-5" />}
                    title="Personal Information"
                    description="Update your name, email, and profile picture"
                  />
                  <SettingsGridItem
                    icon={<Lock className="w-5 h-5" />}
                    title="Security"
                    description="Change password and security settings"
                  />
                </div>
              </SettingsCard>

              <SettingsCard title="Account Preferences">
                <div className="grid grid-cols-3 gap-4">
                  <SettingsGridItem
                    icon={<Settings2 className="w-5 h-5" />}
                    title="Preferences"
                    description="Customize your account settings"
                  />
                  <SettingsGridItem
                    icon={<Bell className="w-5 h-5" />}
                    title="Notifications"
                    description="Manage your notification preferences"
                    badge="New"
                  />
                  <SettingsGridItem
                    icon={<FileDown className="w-5 h-5" />}
                    title="Data Export"
                    description="Download your account data"
                  />
                </div>
              </SettingsCard>
            </div>
          )}

          {activeSection === "teams" && (
            <div className="space-y-6">
              <SettingsCard
                title="Team Management"
                description="Manage your team members and their permissions"
              >
                <div className="grid grid-cols-2 gap-4">
                  <SettingsGridItem
                    icon={<Users className="w-5 h-5" />}
                    title="Team Members"
                    description="Add or remove team members"
                  />
                  <SettingsGridItem
                    icon={<BarChart2 className="w-5 h-5" />}
                    title="Lead Distribution"
                    description="Configure lead assignment rules"
                  />
                </div>
              </SettingsCard>

              <SettingsCard title="Team Resources">
                <div className="grid grid-cols-3 gap-4">
                  <SettingsGridItem
                    icon={<ScrollText className="w-5 h-5" />}
                    title="Scripts"
                    description="Manage call scripts for your team"
                  />
                  <SettingsGridItem
                    icon={<Calendar className="w-5 h-5" />}
                    title="Tasks"
                    description="Configure task distribution"
                  />
                  <SettingsGridItem
                    icon={<FileText className="w-5 h-5" />}
                    title="Templates"
                    description="Manage document templates"
                  />
                </div>
              </SettingsCard>
            </div>
          )}

          {/* Add similar sections for other navigation items */}
        </div>
      </div>
    </div>
  )
} 