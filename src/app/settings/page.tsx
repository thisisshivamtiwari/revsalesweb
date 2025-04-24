"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SidebarDemo from "@/components/ui/sidebar-demo";
import { DashboardNavbar, DashboardNavContent, NavbarUserMenu } from "@/components/ui/dashboard-navbar";
import { motion, AnimatePresence } from "motion/react";
import { 
  IconChevronRight, 
  IconChevronDown, 
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
  IconPhone
} from "@tabler/icons-react";

export default function SettingsPage() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const [generalExpanded, setGeneralExpanded] = useState(true);
  const [miscExpanded, setMiscExpanded] = useState(true);

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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const SettingItem = ({ 
    icon, 
    label, 
    onClick, 
    variant = "default" 
  }: { 
    icon: React.ReactNode, 
    label: string, 
    onClick?: () => void, 
    variant?: "default" | "danger" 
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const variantClasses = {
      default: "bg-white/10 dark:bg-neutral-800/30 border-white/10 dark:border-neutral-700/30 hover:bg-white/20 dark:hover:bg-neutral-700/40",
      danger: "bg-red-500/10 dark:bg-red-900/20 border-red-500/20 dark:border-red-800/30 text-red-600 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-900/30"
    };
    
    return (
      <div 
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex items-center space-x-4 p-4 rounded-xl backdrop-blur-sm 
        border mb-3 cursor-pointer transition-all duration-200 
        ${isHovered ? "translate-y-[-2px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_5px_15px_rgba(0,0,0,0.2)]" : ""}
        ${variantClasses[variant]}`}
      >
        <div className="text-xl">{icon}</div>
        <span className="font-medium">{label}</span>
        <div className="flex-grow"></div>
        <IconChevronRight className="text-neutral-400" size={18} />
      </div>
    );
  };

  const CategoryHeader = ({ 
    title, 
    expanded, 
    onToggle 
  }: { 
    title: string, 
    expanded: boolean, 
    onToggle: () => void 
  }) => (
    <div 
      className="flex items-center justify-between py-4 cursor-pointer border-b border-white/10 dark:border-neutral-700/30 mb-6"
      onClick={onToggle}
    >
      <h2 className="text-xl font-bold text-neutral-800 dark:text-white">{title}</h2>
      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white/20 dark:bg-neutral-800/40 backdrop-blur-sm border border-white/10 dark:border-neutral-700/30">
        {expanded ? (
          <IconChevronDown className="text-neutral-500 dark:text-neutral-300" size={18} />
        ) : (
          <IconChevronRight className="text-neutral-500 dark:text-neutral-300" size={18} />
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-row w-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800">
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

        <main className="flex-grow py-8 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <button 
                onClick={() => router.back()}
                className="p-2 rounded-full bg-white/20 dark:bg-neutral-800/40 backdrop-blur-sm 
                border border-white/10 dark:border-neutral-700/30 mr-4 hover:bg-white/30 dark:hover:bg-neutral-700/50 transition-all duration-200"
              >
                <IconChevronRight className="rotate-180 text-neutral-800 dark:text-neutral-200" />
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                Settings
              </h1>
            </div>

            <div className="bg-white/20 dark:bg-neutral-800/20 backdrop-blur-md rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.1),_0_1px_1px_rgba(255,255,255,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 dark:border-neutral-700/30 p-6 md:p-8 mb-6">
              {/* General Settings */}
              <CategoryHeader 
                title="General Settings" 
                expanded={generalExpanded} 
                onToggle={() => setGeneralExpanded(!generalExpanded)} 
              />
              
              <AnimatePresence>
                {generalExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <SettingItem icon={<IconUser className="text-blue-500" />} label="My Account" />
                    <SettingItem icon={<IconBell className="text-amber-500" />} label="Notifications" />
                    <SettingItem icon={<IconUsers className="text-indigo-500" />} label="Manage Teams" />
                    <SettingItem icon={<IconChartBar className="text-green-500" />} label="Manage Lead Distribution" />
                    <SettingItem icon={<IconWand className="text-purple-500" />} label="Manage Script Distribution" />
                    <SettingItem icon={<IconCalendar className="text-blue-500" />} label="Manage Task Distribution" />
                    <SettingItem icon={<IconBrandWhatsapp className="text-green-500" />} label="Manage WhatsApp Automation" />
                    <SettingItem icon={<IconPlus className="text-teal-500" />} label="Add Reference Leads" />
                    <SettingItem icon={<IconSettings className="text-neutral-500" />} label="Customizations" />
                    <SettingItem icon={<IconUpload className="text-blue-500" />} label="Export Data" />
                    <SettingItem icon={<IconLock className="text-neutral-500" />} label="Disclosure" />
                    <SettingItem icon={<IconLogout className="text-red-500" />} label="Logout" onClick={logout} variant="danger" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Miscellaneous Settings */}
              <CategoryHeader 
                title="Miscellaneous Settings" 
                expanded={miscExpanded} 
                onToggle={() => setMiscExpanded(!miscExpanded)} 
              />
              
              <AnimatePresence>
                {miscExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <SettingItem icon={<IconNotes className="text-amber-500" />} label="Packages" />
                    <SettingItem icon={<IconWand className="text-purple-500" />} label="Script Wizard" />
                    <SettingItem icon={<IconPencil className="text-blue-500" />} label="Proposals" />
                    <SettingItem icon={<IconId className="text-indigo-500" />} label="Digital Card" />
                    <SettingItem icon={<IconPhone className="text-green-500" />} label="Caller ID" />
                    <SettingItem icon={<IconTools className="text-orange-500" />} label="Services" />
                    <SettingItem icon={<IconLink className="text-teal-500" />} label="Manage Integrations" />
                    <SettingItem icon={<IconBuilding className="text-blue-500" />} label="Organization Settings" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 