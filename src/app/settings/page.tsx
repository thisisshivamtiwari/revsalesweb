"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SidebarDemo from "@/components/ui/sidebar-demo";
import { DashboardNavbar, DashboardNavContent, NavbarUserMenu } from "@/components/ui/dashboard-navbar";
import { motion } from "motion/react";
import { 
  IconUser, 
  IconBell, 
  IconUsers, 
  IconChartBar, 
  IconWand, 
  IconCalendar,
  IconBrandWhatsapp,
  IconPlus,
  IconSettings,
  IconUpload,
  IconLock,
  IconLogout,
  IconNotes,
  IconPencil,
  IconId,
  IconTools,
  IconLink,
  IconBuilding,
  IconPhone,
  IconChevronLeft,
  IconAdjustments,
  IconLayoutDashboard,
  IconHeadset
} from "@tabler/icons-react";

// Define the type for a settings item
interface SettingItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: string;
  link?: string;
}

// Define the type for a settings category
interface SettingCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: SettingItem[];
}

// Define categories and their settings items
const settingsCategories: SettingCategory[] = [
  {
    id: "account",
    name: "Account",
    icon: <IconUser size={20} />,
    items: [
      { id: "my-account", label: "My Account", icon: <IconUser size={20} className="text-blue-500" />, link: "/settings/my-account" },
      { id: "notifications", label: "Notifications", icon: <IconBell size={20} className="text-amber-500" /> },
      { id: "logout", label: "Logout", icon: <IconLogout size={20} className="text-red-500" />, variant: "danger" }
    ]
  },
  {
    id: "team",
    name: "Team Management",
    icon: <IconUsers size={20} />,
    items: [
      { id: "manage-teams", label: "Manage Teams", icon: <IconUsers size={20} className="text-indigo-500" />, link: "/settings/teams?category=team" },
      { id: "lead-distribution", label: "Lead Distribution", icon: <IconChartBar size={20} className="text-green-500" />, link: "/settings/lead-distribution?category=team" },
      { id: "script-distribution", label: "Script Distribution", icon: <IconWand size={20} className="text-blue-500" /> },
      { id: "task-distribution", label: "Task Distribution", icon: <IconCalendar size={20} className="text-teal-500" />, link: "/settings/task-distribution?category=team" }
    ]
  },
  {
    id: "tools",
    name: "Tools & Services",
    icon: <IconTools size={20} />,
    items: [
      { id: "whatsapp-automation", label: "WhatsApp Automation", icon: <IconBrandWhatsapp size={20} className="text-green-500" />, link: "/settings/whatsapp-automation?category=tools" },
      { id: "script-wizard", label: "Script Wizard", icon: <IconWand size={20} className="text-purple-500" />, link: "/settings/script-wizard?category=tools" },
      { id: "proposals", label: "Proposals", icon: <IconPencil size={20} className="text-blue-500" />, link: "/settings/proposals?category=tools" },
      { id: "digital-card", label: "Digital Card", icon: <IconId size={20} className="text-indigo-500" /> },
      { id: "caller-id", label: "Caller ID", icon: <IconPhone size={20} className="text-green-500" /> },
      { id: "services", label: "Services", icon: <IconHeadset size={20} className="text-amber-500" />, link: "/settings/services?category=tools" },
      { id: "lead-status", label: "Lead Status", icon: <IconChartBar size={20} className="text-blue-500" />, link: "/settings/lead-status?category=tools" },
      { id: "task-types", label: "Task Types", icon: <IconCalendar size={20} className="text-purple-500" />, link: "/settings/task-types?category=tools" }
    ]
  },
  {
    id: "data",
    name: "Data Management",
    icon: <IconLayoutDashboard size={20} />,
    items: [
      { id: "add-leads", label: "Add Reference Leads", icon: <IconPlus size={20} className="text-blue-500" />, link: "/settings/add-leads" },
      { id: "export-data", label: "Export Data", icon: <IconUpload size={20} className="text-green-500" />, link: "/settings/export-data?category=data" },
      { id: "packages", label: "Packages", icon: <IconNotes size={20} className="text-teal-500" />, link: "/settings/packages?category=data" }
    ]
  },
  {
    id: "admin",
    name: "Administration",
    icon: <IconAdjustments size={20} />,
    items: [
      { id: "integrations", label: "Manage Integrations", icon: <IconLink size={20} className="text-purple-500" />, link: "/settings/integrations?category=admin" },
      { id: "organization", label: "Organization Settings", icon: <IconBuilding size={20} className="text-blue-500" />, link: "/settings/organization?category=admin" },
      { id: "disclosure", label: "Disclosure", icon: <IconLock size={20} className="text-red-500" /> }
    ]
  }
];

export default function SettingsPage() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("account");
  
  // Read the activeCategory from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('activeCategory');
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, []);

  // Move navigation logic to useEffect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-neutral-600 dark:text-neutral-300">Loading settings...</p>
        </div>
      </div>
    );
  }

  // Return null if not authenticated rather than redirecting in render
  if (!isAuthenticated) {
    return null;
  }

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const currentCategory = settingsCategories.find(category => category.id === activeCategory);

  return (
    <div className="min-h-screen flex flex-row w-full bg-neutral-100 dark:bg-neutral-900">
      {/* Sidebar */}
      <SidebarDemo />
      
      {/* Main content - with padding to accommodate fixed sidebar */}
      <div className="flex-1 ml-[90px] lg:ml-[90px] transition-all duration-300">
        {/* Dashboard Navbar */}
        <DashboardNavbar className="mb-4">
          <DashboardNavContent>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-lg font-semibold text-neutral-800 dark:text-white">
                Settings
              </a>
            </div>
            <div className="flex-grow"></div>
            <NavbarUserMenu 
              username={user?.fullName || 'User'} 
              onLogout={logout} 
            />
          </DashboardNavContent>
        </DashboardNavbar>

        <main className="flex-grow py-6 px-4 md:px-8">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full bg-white/20 dark:bg-neutral-800/40 backdrop-blur-sm 
              border border-white/10 dark:border-neutral-700/30 mr-4 hover:bg-white/30 dark:hover:bg-neutral-700/50 transition-all duration-200"
            >
              <IconChevronLeft className="text-neutral-800 dark:text-neutral-200" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              Settings
            </h1>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Categories Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white/20 dark:bg-neutral-800/20 backdrop-blur-md rounded-xl shadow-lg border border-white/10 dark:border-neutral-700/30 p-4 mb-6 h-full">
                <nav className="space-y-2">
                  {settingsCategories.map((category) => (
                    <button 
                      key={category.id}
                      onClick={() => handleCategoryClick(category.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left ${
                        activeCategory === category.id 
                          ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-medium' 
                          : 'hover:bg-white/10 dark:hover:bg-neutral-700/30 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <div className={`${activeCategory === category.id ? 'text-blue-500 dark:text-blue-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                        {category.icon}
                      </div>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="flex-grow">
              <div className="bg-white/20 dark:bg-neutral-800/20 backdrop-blur-md rounded-xl shadow-lg border border-white/10 dark:border-neutral-700/30 p-6 md:p-8">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-6 pb-4 border-b border-neutral-200/20 dark:border-neutral-700/30">
                  {currentCategory?.name}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentCategory?.items.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className={`p-5 rounded-xl border backdrop-blur-sm cursor-pointer transition-all duration-200 
                      ${item.variant === 'danger' 
                        ? 'bg-red-500/10 dark:bg-red-900/20 border-red-500/20 dark:border-red-800/30 text-red-600 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-900/30' 
                        : 'bg-white/10 dark:bg-neutral-800/30 border-white/10 dark:border-neutral-700/30 hover:bg-white/20 dark:hover:bg-neutral-700/40'
                      }`}
                      onClick={() => {
                        if (item.id === 'logout') {
                          logout();
                        } else if (item.link) {
                          router.push(item.link);
                        }
                      }}
                    >
                      <div className="flex items-center mb-3">
                        {item.icon}
                        <span className="ml-2 font-medium text-lg">{item.label}</span>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        {getSettingDescription(item.id)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Helper function to get descriptions for settings
function getSettingDescription(itemId: string): string {
  const descriptions: Record<string, string> = {
    "my-account": "Update your profile information, email, and password",
    "notifications": "Manage your email and in-app notification preferences",
    "logout": "Sign out of your account",
    "manage-teams": "Add team members and manage team permissions",
    "lead-distribution": "Configure how leads are distributed among team members",
    "script-distribution": "Manage and distribute sales scripts to your team",
    "task-distribution": "Assign and schedule tasks for your team members",
    "whatsapp-automation": "Set up automated WhatsApp messages for leads and clients",
    "script-wizard": "Create and customize sales scripts with AI assistance",
    "proposals": "Create, manage, and track sales proposals",
    "digital-card": "Create and share your digital business card",
    "caller-id": "Configure caller ID settings for outbound calls",
    "services": "Manage the services your business offers to clients",
    "lead-status": "Configure and manage lead status categories and workflows",
    "task-types": "Define and manage different types of tasks for your team",
    "add-leads": "Add reference leads to your database",
    "export-data": "Export your data for backup or analysis",
    "packages": "Manage your subscription packages and billing",
    "integrations": "Connect with external apps and services",
    "organization": "Configure organization-wide settings",
    "disclosure": "View privacy and data disclosure information"
  };
  
  return descriptions[itemId] || "Configure this setting";
} 