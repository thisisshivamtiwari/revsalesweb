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
  Briefcase,
  Shield,
  FileArchive,
  Upload,
  Plus,
  Pencil,
  Trash2,
  CircleDot,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { OrganizationSettings } from "./organization-settings"

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

interface WhatsAppRule {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  createdAt: string
}

interface Team {
  id: string
  name: string
  description: string
  memberCount: number
  leader: string
  status: 'active' | 'inactive'
  createdAt: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  email: string
  avatar: string
  status: 'online' | 'offline' | 'away'
}

interface LeadRule {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  assignee: string
  priority: 'high' | 'medium' | 'low'
  createdAt: string
}

interface TaskRule {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  workflow: string
  assignee: string
  createdAt: string
}

interface ScriptRule {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive'
  category: string
  lastUpdated: string
  createdAt: string
}

interface LeadStatus {
  id: string
  name: string
  color: string
  description: string
  isDefault: boolean
  createdAt: string
}

interface TaskType {
  id: string
  name: string
  color: string
  description: string
  category: string
  isDefault: boolean
  createdAt: string
}

interface Package {
  id: string
  name: string
  description: string
  price: number
  status: 'active' | 'inactive'
  features: string[]
  createdAt: string
}

interface ScriptWizard {
  id: string
  name: string
  description: string
  category: string
  status: 'active' | 'inactive'
  lastUpdated: string
  createdAt: string
}

interface Proposal {
  id: string
  name: string
  description: string
  category: string
  status: 'active' | 'inactive'
  lastUpdated: string
  createdAt: string
}

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: string
  status: 'active' | 'inactive'
  category: string
  createdAt: string
}

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
  const [showWhatsAppRules, setShowWhatsAppRules] = useState(false)
  const [whatsappSearchQuery, setWhatsappSearchQuery] = useState("")
  const [whatsappRules] = useState<WhatsAppRule[]>([
    {
      id: "1",
      name: "Welcome Message",
      description: "Send welcome message to new leads",
      status: "active",
      createdAt: "2024-02-20"
    },
    {
      id: "2",
      name: "Follow Up",
      description: "Send follow up message after 24 hours",
      status: "active",
      createdAt: "2024-02-19"
    },
    {
      id: "3",
      name: "Meeting Reminder",
      description: "Send meeting reminder 1 hour before",
      status: "inactive",
      createdAt: "2024-02-18"
    }
  ])
  const [showTeams, setShowTeams] = useState(false)
  const [teamSearchQuery, setTeamSearchQuery] = useState("")
  const [teams] = useState<Team[]>([
    {
      id: "1",
      name: "Sales Team",
      description: "Main sales and business development team",
      memberCount: 8,
      leader: "John Doe",
      status: "active",
      createdAt: "2024-02-20"
    },
    {
      id: "2",
      name: "Marketing Team",
      description: "Digital marketing and content team",
      memberCount: 5,
      leader: "Jane Smith",
      status: "active",
      createdAt: "2024-02-19"
    },
    {
      id: "3",
      name: "Support Team",
      description: "Customer support and service team",
      memberCount: 6,
      leader: "Mike Johnson",
      status: "inactive",
      createdAt: "2024-02-18"
    }
  ])

  const [teamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      role: "Team Leader",
      email: "john@example.com",
      avatar: "https://via.placeholder.com/40",
      status: "online"
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "Senior Sales",
      email: "jane@example.com",
      avatar: "https://via.placeholder.com/40",
      status: "away"
    },
    {
      id: "3",
      name: "Mike Johnson",
      role: "Support Lead",
      email: "mike@example.com",
      avatar: "https://via.placeholder.com/40",
      status: "offline"
    }
  ])

  const [showMembers, setShowMembers] = useState(false)
  const [memberSearchQuery, setMemberSearchQuery] = useState("")
  const [showLeadRules, setShowLeadRules] = useState(false)
  const [showTaskRules, setShowTaskRules] = useState(false)
  const [showScriptRules, setShowScriptRules] = useState(false)
  const [leadSearchQuery, setLeadSearchQuery] = useState("")
  const [taskSearchQuery, setTaskSearchQuery] = useState("")
  const [scriptSearchQuery, setScriptSearchQuery] = useState("")

  const [leadRules] = useState<LeadRule[]>([
    {
      id: "1",
      name: "High Value Leads",
      description: "Automatically assign high-value leads to senior sales team",
      status: "active",
      assignee: "Senior Sales Team",
      priority: "high",
      createdAt: "2024-02-20"
    },
    {
      id: "2",
      name: "New Customer Distribution",
      description: "Round-robin distribution for new customer inquiries",
      status: "active",
      assignee: "Sales Team",
      priority: "medium",
      createdAt: "2024-02-19"
    }
  ])

  const [taskRules] = useState<TaskRule[]>([
    {
      id: "1",
      name: "Follow-up Tasks",
      description: "Automatically create follow-up tasks after meetings",
      status: "active",
      workflow: "Sales Pipeline",
      assignee: "Account Manager",
      createdAt: "2024-02-20"
    },
    {
      id: "2",
      name: "Support Tickets",
      description: "Distribute support tickets based on expertise",
      status: "active",
      workflow: "Support Queue",
      assignee: "Support Team",
      createdAt: "2024-02-19"
    }
  ])

  const [scriptRules] = useState<ScriptRule[]>([
    {
      id: "1",
      name: "Sales Pitch Template",
      description: "Standard sales pitch script for new products",
      status: "active",
      category: "Sales",
      lastUpdated: "2024-02-20",
      createdAt: "2024-02-15"
    },
    {
      id: "2",
      name: "Support Response",
      description: "Template for common support queries",
      status: "active",
      category: "Support",
      lastUpdated: "2024-02-19",
      createdAt: "2024-02-10"
    }
  ])

  const [showCustomization, setShowCustomization] = useState(false)
  const [showLeadStatus, setShowLeadStatus] = useState(false)
  const [showTaskTypes, setShowTaskTypes] = useState(false)
  const [leadStatusSearchQuery, setLeadStatusSearchQuery] = useState("")
  const [taskTypeSearchQuery, setTaskTypeSearchQuery] = useState("")

  const [leadStatuses] = useState<LeadStatus[]>([
    {
      id: "1",
      name: "New Lead",
      color: "#FF5A81",
      description: "Newly created leads",
      isDefault: true,
      createdAt: "2024-02-20"
    },
    {
      id: "2",
      name: "Contacted",
      color: "#FFB800",
      description: "Leads that have been contacted",
      isDefault: false,
      createdAt: "2024-02-19"
    },
    {
      id: "3",
      name: "Qualified",
      color: "#00B8D9",
      description: "Leads that have been qualified",
      isDefault: false,
      createdAt: "2024-02-18"
    }
  ])

  const [taskTypes] = useState<TaskType[]>([
    {
      id: "1",
      name: "Follow Up",
      color: "#FF5A81",
      description: "Follow up tasks with leads",
      category: "Sales",
      isDefault: true,
      createdAt: "2024-02-20"
    },
    {
      id: "2",
      name: "Meeting",
      color: "#00B8D9",
      description: "Client meetings and calls",
      category: "Meetings",
      isDefault: false,
      createdAt: "2024-02-19"
    },
    {
      id: "3",
      name: "Support",
      color: "#36B37E",
      description: "Customer support tasks",
      category: "Support",
      isDefault: false,
      createdAt: "2024-02-18"
    }
  ])

  const [showPackages, setShowPackages] = useState(false)
  const [showScriptWizards, setShowScriptWizards] = useState(false)
  const [showProposals, setShowProposals] = useState(false)
  const [showServices, setShowServices] = useState(false)
  const [packageSearchQuery, setPackageSearchQuery] = useState("")
  const [scriptWizardSearchQuery, setScriptWizardSearchQuery] = useState("")
  const [proposalSearchQuery, setProposalSearchQuery] = useState("")
  const [serviceSearchQuery, setServiceSearchQuery] = useState("")

  const [packages] = useState<Package[]>([
    {
      id: "1",
      name: "Basic Package",
      description: "Essential features for small businesses",
      price: 99,
      status: "active",
      features: ["Lead Management", "Task Management", "Basic Reports"],
      createdAt: "2024-02-20"
    },
    {
      id: "2",
      name: "Pro Package",
      description: "Advanced features for growing teams",
      price: 199,
      status: "active",
      features: ["All Basic Features", "Advanced Analytics", "API Access"],
      createdAt: "2024-02-19"
    }
  ])

  const [scriptWizards] = useState<ScriptWizard[]>([
    {
      id: "1",
      name: "Sales Call Script",
      description: "Guided script for sales calls",
      category: "Sales",
      status: "active",
      lastUpdated: "2024-02-20",
      createdAt: "2024-02-15"
    },
    {
      id: "2",
      name: "Support Workflow",
      description: "Customer support interaction guide",
      category: "Support",
      status: "active",
      lastUpdated: "2024-02-19",
      createdAt: "2024-02-10"
    }
  ])

  const [proposals] = useState<Proposal[]>([
    {
      id: "1",
      name: "Standard Proposal",
      description: "Basic business proposal template",
      category: "Sales",
      status: "active",
      lastUpdated: "2024-02-20",
      createdAt: "2024-02-15"
    },
    {
      id: "2",
      name: "Enterprise Solution",
      description: "Comprehensive enterprise proposal",
      category: "Enterprise",
      status: "active",
      lastUpdated: "2024-02-19",
      createdAt: "2024-02-10"
    }
  ])

  const [services] = useState<Service[]>([
    {
      id: "1",
      name: "Consultation",
      description: "One-on-one business consultation",
      price: 150,
      duration: "1 hour",
      status: "active",
      category: "Consulting",
      createdAt: "2024-02-20"
    },
    {
      id: "2",
      name: "Training Session",
      description: "Team training and workshop",
      price: 299,
      duration: "2 hours",
      status: "active",
      category: "Training",
      createdAt: "2024-02-19"
    }
  ])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setProfile(prev => ({ ...prev, profileImg: imageUrl }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Profile updated:", profile)
  }

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const handleAddRule = () => {
    console.log("Add new rule")
  }

  const handleEditRule = (ruleId: string) => {
    console.log("Edit rule:", ruleId)
  }

  const handleDeleteRule = (ruleId: string) => {
    console.log("Delete rule:", ruleId)
  }

  const handleAddTeam = () => {
    console.log("Add new team")
  }

  const handleEditTeam = (teamId: string) => {
    console.log("Edit team:", teamId)
  }

  const handleDeleteTeam = (teamId: string) => {
    console.log("Delete team:", teamId)
  }

  const handleAddMember = () => {
    console.log("Add new member")
  }

  const handleEditMember = (memberId: string) => {
    console.log("Edit member:", memberId)
  }

  const handleDeleteMember = (memberId: string) => {
    console.log("Delete member:", memberId)
  }

  const handleAddLeadRule = () => {
    console.log("Add new lead rule")
  }

  const handleEditLeadRule = (ruleId: string) => {
    console.log("Edit lead rule:", ruleId)
  }

  const handleDeleteLeadRule = (ruleId: string) => {
    console.log("Delete lead rule:", ruleId)
  }

  const handleAddTaskRule = () => {
    console.log("Add new task rule")
  }

  const handleEditTaskRule = (ruleId: string) => {
    console.log("Edit task rule:", ruleId)
  }

  const handleDeleteTaskRule = (ruleId: string) => {
    console.log("Delete task rule:", ruleId)
  }

  const handleAddScriptRule = () => {
    console.log("Add new script rule")
  }

  const handleEditScriptRule = (ruleId: string) => {
    console.log("Edit script rule:", ruleId)
  }

  const handleDeleteScriptRule = (ruleId: string) => {
    console.log("Delete script rule:", ruleId)
  }

  const handleAddLeadStatus = () => {
    console.log("Add new lead status")
  }

  const handleEditLeadStatus = (statusId: string) => {
    console.log("Edit lead status:", statusId)
  }

  const handleDeleteLeadStatus = (statusId: string) => {
    console.log("Delete lead status:", statusId)
  }

  const handleAddTaskType = () => {
    console.log("Add new task type")
  }

  const handleEditTaskType = (typeId: string) => {
    console.log("Edit task type:", typeId)
  }

  const handleDeleteTaskType = (typeId: string) => {
    console.log("Delete task type:", typeId)
  }

  const handleAddPackage = () => {
    console.log("Add new package")
  }

  const handleEditPackage = (packageId: string) => {
    console.log("Edit package:", packageId)
  }

  const handleDeletePackage = (packageId: string) => {
    console.log("Delete package:", packageId)
  }

  const handleAddScriptWizard = () => {
    console.log("Add new script wizard")
  }

  const handleEditScriptWizard = (wizardId: string) => {
    console.log("Edit script wizard:", wizardId)
  }

  const handleDeleteScriptWizard = (wizardId: string) => {
    console.log("Delete script wizard:", wizardId)
  }

  const handleAddProposal = () => {
    console.log("Add new proposal")
  }

  const handleEditProposal = (proposalId: string) => {
    console.log("Edit proposal:", proposalId)
  }

  const handleDeleteProposal = (proposalId: string) => {
    console.log("Delete proposal:", proposalId)
  }

  const handleAddService = () => {
    console.log("Add new service")
  }

  const handleEditService = (serviceId: string) => {
    console.log("Edit service:", serviceId)
  }

  const handleDeleteService = (serviceId: string) => {
    console.log("Delete service:", serviceId)
  }

  const filteredRules = whatsappRules.filter(rule =>
    rule.name.toLowerCase().includes(whatsappSearchQuery.toLowerCase()) ||
    rule.description.toLowerCase().includes(whatsappSearchQuery.toLowerCase())
  )

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(teamSearchQuery.toLowerCase())
  )

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearchQuery.toLowerCase())
  )

  const filteredLeadRules = leadRules.filter(rule =>
    rule.name.toLowerCase().includes(leadSearchQuery.toLowerCase()) ||
    rule.description.toLowerCase().includes(leadSearchQuery.toLowerCase())
  )

  const filteredTaskRules = taskRules.filter(rule =>
    rule.name.toLowerCase().includes(taskSearchQuery.toLowerCase()) ||
    rule.description.toLowerCase().includes(taskSearchQuery.toLowerCase())
  )

  const filteredScriptRules = scriptRules.filter(rule =>
    rule.name.toLowerCase().includes(scriptSearchQuery.toLowerCase()) ||
    rule.description.toLowerCase().includes(scriptSearchQuery.toLowerCase())
  )

  const filteredLeadStatuses = leadStatuses.filter(status =>
    status.name.toLowerCase().includes(leadStatusSearchQuery.toLowerCase()) ||
    status.description.toLowerCase().includes(leadStatusSearchQuery.toLowerCase())
  )

  const filteredTaskTypes = taskTypes.filter(type =>
    type.name.toLowerCase().includes(taskTypeSearchQuery.toLowerCase()) ||
    type.description.toLowerCase().includes(taskTypeSearchQuery.toLowerCase())
  )

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(packageSearchQuery.toLowerCase()) ||
    pkg.description.toLowerCase().includes(packageSearchQuery.toLowerCase())
  )

  const filteredScriptWizards = scriptWizards.filter(wizard =>
    wizard.name.toLowerCase().includes(scriptWizardSearchQuery.toLowerCase()) ||
    wizard.description.toLowerCase().includes(scriptWizardSearchQuery.toLowerCase())
  )

  const filteredProposals = proposals.filter(proposal =>
    proposal.name.toLowerCase().includes(proposalSearchQuery.toLowerCase()) ||
    proposal.description.toLowerCase().includes(proposalSearchQuery.toLowerCase())
  )

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(serviceSearchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(serviceSearchQuery.toLowerCase())
  )

  const [showOrganizationSettings, setShowOrganizationSettings] = useState(false)

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
                }}
              />
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          {activeSection === "account" && !showMyAccount && (
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
          )}

          {activeSection === "account" && showMyAccount && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMyAccount(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white">My Account</h2>
              </div>
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
          )}

          {activeSection === "notifications" && !showWhatsAppRules && (
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
                    onClick={() => setShowWhatsAppRules(true)}
                  />
                </div>
              </SettingsCard>
            </div>
          )}

          {activeSection === "notifications" && showWhatsAppRules && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowWhatsAppRules(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white">WhatsApp Automation Rules</h2>
              </div>

              <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search automation rules..."
                      value={whatsappSearchQuery}
                      onChange={(e) => setWhatsappSearchQuery(e.target.value)}
                      className="w-full pl-9 bg-[#2F304D]/10 border-[#2F304D]/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    onClick={handleAddRule}
                    className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Rule
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-4 bg-[#2F304D]/10 border border-[#2F304D]/20 rounded-lg hover:bg-[#2F304D]/20 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-gray-200 font-medium">{rule.name}</h3>
                          <span
                            className={cn(
                              "px-2 py-0.5 text-xs rounded-full",
                              rule.status === "active"
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                            )}
                          >
                            {rule.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{rule.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Created on {new Date(rule.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditRule(rule.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/40 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRule(rule.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "team" && !showTeams && !showMembers && !showLeadRules && !showTaskRules && !showScriptRules && (
            <div className="space-y-6">
              <SettingsCard
                title="Team & Task Management"
                description="Manage your team, tasks, and resource distribution"
              >
                <div className="grid grid-cols-3 gap-4">
                  <SettingsGridItem
                    icon={<Users className="w-5 h-5" />}
                    title="Manage Teams"
                    description="Add, remove, and configure teams"
                    onClick={() => setShowTeams(true)}
                  />
                  <SettingsGridItem
                    icon={<User className="w-5 h-5" />}
                    title="Manage Members"
                    description="Add, remove, and configure team members"
                    onClick={() => setShowMembers(true)}
                  />
                  <SettingsGridItem
                    icon={<Bot className="w-5 h-5" />}
                    title="Manage Lead Distribution"
                    description="Configure lead assignment and distribution rules"
                    onClick={() => setShowLeadRules(true)}
                  />
                  <SettingsGridItem
                    icon={<ListTodo className="w-5 h-5" />}
                    title="Manage Task Distribution"
                    description="Set up task allocation and workflow rules"
                    onClick={() => setShowTaskRules(true)}
                  />
                  <SettingsGridItem
                    icon={<ScrollText className="w-5 h-5" />}
                    title="Manage Script Distribution"
                    description="Configure script assignments and templates"
                    onClick={() => setShowScriptRules(true)}
                  />
                  <SettingsGridItem
                    icon={<Settings2 className="w-5 h-5" />}
                    title="Manage Integrations"
                    description="Set up and configure third-party integrations"
                  />
                </div>
              </SettingsCard>
            </div>
          )}

          {activeSection === "team" && showTeams && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowTeams(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white">Manage Teams</h2>
              </div>

              <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search teams..."
                      value={teamSearchQuery}
                      onChange={(e) => setTeamSearchQuery(e.target.value)}
                      className="w-full pl-9 bg-[#2F304D]/10 border-[#2F304D]/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    onClick={handleAddTeam}
                    className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Team
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredTeams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-4 bg-[#2F304D]/10 border border-[#2F304D]/20 rounded-lg hover:bg-[#2F304D]/20 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-gray-200 font-medium">{team.name}</h3>
                          <span
                            className={cn(
                              "px-2 py-0.5 text-xs rounded-full",
                              team.status === "active"
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                            )}
                          >
                            {team.status}
                          </span>
                          <span className="text-sm text-gray-400">
                            {team.memberCount} members
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{team.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">Team Leader:</span>
                          <span className="text-xs text-gray-300">{team.leader}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTeam(team.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/40 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTeam(team.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "team" && showMembers && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMembers(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white">Manage Members</h2>
              </div>

              <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search members..."
                      value={memberSearchQuery}
                      onChange={(e) => setMemberSearchQuery(e.target.value)}
                      className="w-full pl-9 bg-[#2F304D]/10 border-[#2F304D]/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    onClick={handleAddMember}
                    className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Member
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-[#2F304D]/10 border border-[#2F304D]/20 rounded-lg hover:bg-[#2F304D]/20 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <span
                            className={cn(
                              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1C1D2E]",
                              member.status === "online" && "bg-green-500",
                              member.status === "away" && "bg-yellow-500",
                              member.status === "offline" && "bg-gray-500"
                            )}
                          />
                        </div>
                        <div>
                          <h4 className="text-gray-200 font-medium">{member.name}</h4>
                          <p className="text-sm text-gray-400">{member.role}</p>
                          <p className="text-xs text-gray-500 mt-1">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditMember(member.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/40 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "team" && showLeadRules && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLeadRules(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white">Lead Distribution Rules</h2>
              </div>

              <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search lead rules..."
                      value={leadSearchQuery}
                      onChange={(e) => setLeadSearchQuery(e.target.value)}
                      className="w-full pl-9 bg-[#2F304D]/10 border-[#2F304D]/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    onClick={handleAddLeadRule}
                    className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Rule
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredLeadRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-4 bg-[#2F304D]/10 border border-[#2F304D]/20 rounded-lg hover:bg-[#2F304D]/20 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-gray-200 font-medium">{rule.name}</h3>
                          <span
                            className={cn(
                              "px-2 py-0.5 text-xs rounded-full",
                              rule.status === "active"
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                            )}
                          >
                            {rule.status}
                          </span>
                          <span
                            className={cn(
                              "px-2 py-0.5 text-xs rounded-full",
                              rule.priority === "high"
                                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                : rule.priority === "medium"
                                ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                                : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                            )}
                          >
                            {rule.priority} priority
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{rule.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">Assignee:</span>
                          <span className="text-xs text-gray-300">{rule.assignee}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditLeadRule(rule.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/40 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLeadRule(rule.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "team" && showTaskRules && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowTaskRules(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white">Task Distribution Rules</h2>
              </div>

              <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search task rules..."
                      value={taskSearchQuery}
                      onChange={(e) => setTaskSearchQuery(e.target.value)}
                      className="w-full pl-9 bg-[#2F304D]/10 border-[#2F304D]/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    onClick={handleAddTaskRule}
                    className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Rule
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredTaskRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-4 bg-[#2F304D]/10 border border-[#2F304D]/20 rounded-lg hover:bg-[#2F304D]/20 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-gray-200 font-medium">{rule.name}</h3>
                          <span
                            className={cn(
                              "px-2 py-0.5 text-xs rounded-full",
                              rule.status === "active"
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                            )}
                          >
                            {rule.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{rule.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Workflow:</span>
                            <span className="text-xs text-gray-300">{rule.workflow}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Assignee:</span>
                            <span className="text-xs text-gray-300">{rule.assignee}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTaskRule(rule.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/40 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTaskRule(rule.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "team" && showScriptRules && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowScriptRules(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white">Script Distribution Rules</h2>
              </div>

              <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search script rules..."
                      value={scriptSearchQuery}
                      onChange={(e) => setScriptSearchQuery(e.target.value)}
                      className="w-full pl-9 bg-[#2F304D]/10 border-[#2F304D]/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    onClick={handleAddScriptRule}
                    className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Rule
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredScriptRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-4 bg-[#2F304D]/10 border border-[#2F304D]/20 rounded-lg hover:bg-[#2F304D]/20 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-gray-200 font-medium">{rule.name}</h3>
                          <span
                            className={cn(
                              "px-2 py-0.5 text-xs rounded-full",
                              rule.status === "active"
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                            )}
                          >
                            {rule.status}
                          </span>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
                            {rule.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{rule.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Last Updated:</span>
                            <span className="text-xs text-gray-300">{new Date(rule.lastUpdated).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Created:</span>
                            <span className="text-xs text-gray-300">{new Date(rule.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditScriptRule(rule.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/40 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteScriptRule(rule.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "customization" && !showCustomization && !showPackages && !showScriptWizards && !showProposals && !showServices && (
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
                    onClick={() => setShowCustomization(true)}
                  />
                  <SettingsGridItem
                    icon={<Package className="w-5 h-5" />}
                    title="Packages"
                    description="Manage packages and pricing options"
                    onClick={() => setShowPackages(true)}
                  />
                  <SettingsGridItem
                    icon={<Wand2 className="w-5 h-5" />}
                    title="Script Wizards"
                    description="Configure script templates and wizards"
                    onClick={() => setShowScriptWizards(true)}
                  />
                  <SettingsGridItem
                    icon={<FileText className="w-5 h-5" />}
                    title="Proposals"
                    description="Manage proposal templates and settings"
                    onClick={() => setShowProposals(true)}
                  />
                  <SettingsGridItem
                    icon={<Briefcase className="w-5 h-5" />}
                    title="Services"
                    description="Configure service offerings and pricing"
                    onClick={() => setShowServices(true)}
                  />
                </div>
              </SettingsCard>
            </div>
          )}

          {activeSection === "customization" && showCustomization && !showPackages && !showScriptWizards && !showProposals && !showServices && !showLeadStatus && !showTaskTypes && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowCustomization(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white">Customization</h2>
              </div>

              <SettingsCard
                title="Status & Types"
                description="Configure and manage lead status and task type options"
              >
                <div className="grid grid-cols-2 gap-4">
                  <SettingsGridItem
                    icon={<CircleDot className="w-5 h-5" />}
                    title="Lead Status"
                    description="Configure and manage lead status options"
                    onClick={() => setShowLeadStatus(true)}
                  />
                  <SettingsGridItem
                    icon={<ListTodo className="w-5 h-5" />}
                    title="Task Types"
                    description="Configure and manage task type options"
                    onClick={() => setShowTaskTypes(true)}
                  />
                </div>
              </SettingsCard>
            </div>
          )}

          {activeSection === "customization" && showPackages && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPackages(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white">Manage Packages</h2>
              </div>

              <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search packages..."
                      value={packageSearchQuery}
                      onChange={(e) => setPackageSearchQuery(e.target.value)}
                      className="w-full pl-9 bg-[#2F304D]/10 border-[#2F304D]/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    onClick={handleAddPackage}
                    className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Package
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="flex items-center justify-between p-4 bg-[#2F304D]/10 border border-[#2F304D]/20 rounded-lg hover:bg-[#2F304D]/20 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-gray-200 font-medium">{pkg.name}</h3>
                          <span
                            className={cn(
                              "px-2 py-0.5 text-xs rounded-full",
                              pkg.status === "active"
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                            )}
                          >
                            {pkg.status}
                          </span>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            ${pkg.price}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{pkg.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {pkg.features.map((feature, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 text-xs rounded-full bg-[#2F304D]/40 text-gray-300"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Created on {new Date(pkg.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPackage(pkg.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/40 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "customization" && showScriptWizards && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowScriptWizards(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white">Script Wizards</h2>
              </div>

              <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search script wizards..."
                      value={scriptWizardSearchQuery}
                      onChange={(e) => setScriptWizardSearchQuery(e.target.value)}
                      className="w-full pl-9 bg-[#2F304D]/10 border-[#2F304D]/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    onClick={handleAddScriptWizard}
                    className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Wizard
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredScriptWizards.map((wizard) => (
                    <div
                      key={wizard.id}
                      className="flex items-center justify-between p-4 bg-[#2F304D]/10 border border-[#2F304D]/20 rounded-lg hover:bg-[#2F304D]/20 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-gray-200 font-medium">{wizard.name}</h3>
                          <span
                            className={cn(
                              "px-2 py-0.5 text-xs rounded-full",
                              wizard.status === "active"
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                            )}
                          >
                            {wizard.status}
                          </span>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
                            {wizard.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{wizard.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Last Updated:</span>
                            <span className="text-xs text-gray-300">{new Date(wizard.lastUpdated).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Created:</span>
                            <span className="text-xs text-gray-300">{new Date(wizard.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditScriptWizard(wizard.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/40 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteScriptWizard(wizard.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "customization" && showProposals && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowProposals(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white">Proposals</h2>
              </div>

              <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search proposals..."
                      value={proposalSearchQuery}
                      onChange={(e) => setProposalSearchQuery(e.target.value)}
                      className="w-full pl-9 bg-[#2F304D]/10 border-[#2F304D]/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    onClick={handleAddProposal}
                    className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Proposal
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredProposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="flex items-center justify-between p-4 bg-[#2F304D]/10 border border-[#2F304D]/20 rounded-lg hover:bg-[#2F304D]/20 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-gray-200 font-medium">{proposal.name}</h3>
                          <span
                            className={cn(
                              "px-2 py-0.5 text-xs rounded-full",
                              proposal.status === "active"
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                            )}
                          >
                            {proposal.status}
                          </span>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
                            {proposal.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{proposal.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Last Updated:</span>
                            <span className="text-xs text-gray-300">{new Date(proposal.lastUpdated).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Created:</span>
                            <span className="text-xs text-gray-300">{new Date(proposal.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditProposal(proposal.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/40 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProposal(proposal.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "customization" && showServices && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowServices(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white">Services</h2>
              </div>

              <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search services..."
                      value={serviceSearchQuery}
                      onChange={(e) => setServiceSearchQuery(e.target.value)}
                      className="w-full pl-9 bg-[#2F304D]/10 border-[#2F304D]/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    onClick={handleAddService}
                    className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Service
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-4 bg-[#2F304D]/10 border border-[#2F304D]/20 rounded-lg hover:bg-[#2F304D]/20 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-gray-200 font-medium">{service.name}</h3>
                          <span
                            className={cn(
                              "px-2 py-0.5 text-xs rounded-full",
                              service.status === "active"
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                            )}
                          >
                            {service.status}
                          </span>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            ${service.price}
                          </span>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
                            {service.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{service.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Duration:</span>
                            <span className="text-xs text-gray-300">{service.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Created:</span>
                            <span className="text-xs text-gray-300">{new Date(service.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditService(service.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/40 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteService(service.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "organization" && !showOrganizationSettings && (
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
                    onClick={() => setShowOrganizationSettings(true)}
                  />
                  <SettingsGridItem
                    icon={<Shield className="w-5 h-5" />}
                    title="Disclosure"
                    description="View privacy policy and terms of use"
                  />
                </div>
              </SettingsCard>
            </div>
          )}

          {activeSection === "organization" && showOrganizationSettings && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowOrganizationSettings(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white">Organization Settings</h2>
              </div>
              <OrganizationSettings />
            </div>
          )}

          {activeSection === "data" && (
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
          )}

          {activeSection === "customization" && showLeadStatus && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowLeadStatus(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white">Lead Status</h2>
              </div>

              <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search lead status..."
                      value={leadStatusSearchQuery}
                      onChange={(e) => setLeadStatusSearchQuery(e.target.value)}
                      className="w-full pl-9 bg-[#2F304D]/10 border-[#2F304D]/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    onClick={handleAddLeadStatus}
                    className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Status
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredLeadStatuses.map((status) => (
                    <div
                      key={status.id}
                      className="flex items-center justify-between p-4 bg-[#2F304D]/10 border border-[#2F304D]/20 rounded-lg hover:bg-[#2F304D]/20 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          <h3 className="text-gray-200 font-medium">{status.name}</h3>
                          {status.isDefault && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{status.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Created on {new Date(status.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditLeadStatus(status.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/40 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteLeadStatus(status.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                          disabled={status.isDefault}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "customization" && showTaskTypes && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowTaskTypes(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/20 rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold text-white">Task Types</h2>
              </div>

              <div className="bg-[#242744]/20 backdrop-blur-sm border border-[#2F304D]/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search task types..."
                      value={taskTypeSearchQuery}
                      onChange={(e) => setTaskTypeSearchQuery(e.target.value)}
                      className="w-full pl-9 bg-[#2F304D]/10 border-[#2F304D]/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button
                    onClick={handleAddTaskType}
                    className="bg-[#FF5A81] text-white hover:bg-[#FF5A81]/90 gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Type
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredTaskTypes.map((type) => (
                    <div
                      key={type.id}
                      className="flex items-center justify-between p-4 bg-[#2F304D]/10 border border-[#2F304D]/20 rounded-lg hover:bg-[#2F304D]/20 transition-colors group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: type.color }}
                          />
                          <h3 className="text-gray-200 font-medium">{type.name}</h3>
                          {type.isDefault && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20">
                              Default
                            </span>
                          )}
                          <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            {type.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{type.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Created on {new Date(type.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTaskType(type.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-[#2F304D]/40 rounded-lg"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTaskType(type.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                          disabled={type.isDefault}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 