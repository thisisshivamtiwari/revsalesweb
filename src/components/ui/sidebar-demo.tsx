"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarLogo,
  SidebarSection,
  SidebarItem,
  SidebarButton,
} from "@/components/ui/sidebar";
import {
  IconLayoutDashboard,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconBriefcase,
  IconBrandMeta,
  IconLogout,
  IconUser,
  IconNews,
  IconBell,
} from "@tabler/icons-react";

// Define the props interface for the ButtonWrapper
interface ButtonWrapperProps {
  children: React.ReactNode;
  isExpanded: boolean;
  className?: string;
}

// Wrapper component that can accept isExpanded prop
const ButtonWrapper = ({ children, isExpanded, className }: ButtonWrapperProps) => {
  return <div className={className}>{children}</div>;
};

// Dashboard Sidebar Demo Component
export default function SidebarDemo() {
  const pathname = usePathname();
  
  // Define navigation items
  const mainNavItems = [
    {
      icon: <IconLayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: <IconUsers className="w-5 h-5" />,
      label: "Sales Leads",
      href: "/sales-leads",
    },
    {
      icon: <IconBriefcase className="w-5 h-5" />,
      label: "Clients",
      href: "/clients",
    },
    {
      icon: <IconChartBar className="w-5 h-5" />,
      label: "Analytics",
      href: "/analytics",
    },
    {
      icon: <IconNews className="w-5 h-5" />,
      label: "Reports",
      href: "/reports",
    },
  ];

  const additionalNavItems = [
    {
      icon: <IconBell className="w-5 h-5" />,
      label: "Notifications",
      href: "/notifications",
    },
    {
      icon: <IconUser className="w-5 h-5" />,
      label: "Profile",
      href: "/profile",
    },
    {
      icon: <IconSettings className="w-5 h-5" />,
      label: "Settings",
      href: "/settings",
    },
  ];

  // Use a dummyExpanded value that the parent Sidebar component will override
  // The actual isExpanded state is managed by the Sidebar component
  const dummyExpanded = true; // Set to true to ensure text renders initially

  return (
    <Sidebar className="py-4">
      <SidebarLogo isExpanded={dummyExpanded} />
      
      <SidebarSection title="Main" className="mt-6" isExpanded={dummyExpanded}>
        {mainNavItems.map((item, idx) => (
          <SidebarItem
            key={`nav-item-${idx}`}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={pathname === item.href}
            isExpanded={dummyExpanded}
          />
        ))}
      </SidebarSection>
      
      <SidebarSection title="Account" className="mt-6" isExpanded={dummyExpanded}>
        {additionalNavItems.map((item, idx) => (
          <SidebarItem
            key={`account-item-${idx}`}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={pathname === item.href}
            isExpanded={dummyExpanded}
          />
        ))}
      </SidebarSection>
      
      <ButtonWrapper className="px-3 mt-6" isExpanded={dummyExpanded}>
        <SidebarButton
          variant="gradient"
          icon={<IconLogout className="w-5 h-5" />}
          href="/logout"
          isExpanded={dummyExpanded}
        >
          Logout
        </SidebarButton>
      </ButtonWrapper>
    </Sidebar>
  );
} 