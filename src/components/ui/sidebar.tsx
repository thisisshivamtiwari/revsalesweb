"use client";
import { cn } from "@/lib/utils";
import {
  IconMenu2,
  IconX,
  IconLayoutDashboard,
  IconUser,
  IconSettings,
  IconLogout,
  IconChevronRight,
  IconChevronLeft
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SidebarProps {
  children?: React.ReactNode;
  className?: string;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
  isExpanded: boolean;
  onClick?: () => void;
}

interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  isExpanded: boolean;
}

interface SidebarToggleProps {
  isExpanded: boolean;
  onClick: () => void;
  className?: string;
}

interface SidebarLogoProps {
  isExpanded: boolean;
  className?: string;
}

interface SidebarButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
  onClick?: () => void;
  href?: string;
  icon?: React.ReactNode;
  isExpanded: boolean;
}

// Main Sidebar Container
export const Sidebar = ({ children, className }: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed by default
  const pathname = usePathname();

  // Reset expansion state when navigating to a new page
  useEffect(() => {
    // Collapse sidebar on page navigation
    setIsExpanded(false);
  }, [pathname]);

  // Handle mouse enter/leave for hover expansion
  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  return (
    <div className="fixed left-0 inset-0 pointer-events-none z-40 flex items-center">
      <motion.div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          width: isExpanded ? "230px" : "68px",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        className={cn(
          "ml-4 h-[75vh] pointer-events-auto flex flex-col bg-black/25 backdrop-blur-xl overflow-hidden rounded-3xl",
          className
        )}
        style={{
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Subtle glass reflections */}
        <div className="absolute -top-[500px] -left-[300px] w-[800px] h-[800px] bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-[400px] -right-[300px] w-[600px] h-[600px] bg-gradient-to-tl from-blue-500/5 to-transparent rounded-full blur-3xl" />
        
        {/* Minimalistic border highlights */}
        <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-white/20 to-transparent" />
        <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-white/10 to-transparent" />
        <div className="absolute top-0 left-[10%] right-[10%] w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        
        {/* Subtle pill indicator */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-white/30 rounded-full" />

        {/* Pass isExpanded to all sidebar children */}
        <div className="relative h-full py-6 flex flex-col z-10 justify-between">
          <div className="flex-1 flex flex-col">
            {React.Children.map(children, (child) =>
              React.isValidElement(child)
                ? React.cloneElement(
                    child as React.ReactElement<{ isExpanded?: boolean }>,
                    { isExpanded }
                  )
                : child
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Sidebar Logo Component
export const SidebarLogo = ({ isExpanded, className }: SidebarLogoProps) => {
  return (
    <a
      href="#"
      className={cn(
        "relative z-20 flex items-center space-x-2 px-4 py-4 text-sm font-normal text-white",
        className
      )}
    >
      <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold flex-shrink-0 shadow-sm">
        <span className="text-base">RS</span>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="font-medium text-white text-sm overflow-hidden"
          >
            RevSales
          </motion.span>
        )}
      </AnimatePresence>
    </a>
  );
};

// Sidebar Section Component (Grouping)
export const SidebarSection = ({ children, title, className, isExpanded }: SidebarSectionProps) => {
  return (
    <div className={cn("px-2 py-2 mt-1", className)}>
      {title && isExpanded && (
        <h3 className="mb-2 px-4 text-[10px] uppercase tracking-wider text-white/50 font-medium">
          {title}
        </h3>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  );
};

// Sidebar Item Component
export const SidebarItem = ({ 
  icon, 
  label, 
  href, 
  isActive = false, 
  isExpanded, 
  onClick 
}: SidebarItemProps) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center px-2 py-2.5 mx-2 rounded-xl transition-all relative group overflow-hidden",
        isActive 
          ? "bg-white/10 text-white" 
          : "text-white/70 hover:text-white hover:bg-white/5"
      )}
    >
      <span className="flex-shrink-0 w-5 h-5">{icon}</span>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="ml-3 text-sm whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute left-0 h-[60%] w-[2px] bg-blue-500 rounded-full my-auto top-0 bottom-0"
        />
      )}
      
      {/* Tooltip for collapsed state */}
      {!isExpanded && (
        <div className="absolute left-full ml-2 invisible px-2 py-1 text-xs font-medium text-white bg-black/50 backdrop-blur-md rounded-lg whitespace-nowrap group-hover:visible z-50 opacity-0 group-hover:opacity-100 transition-opacity border border-white/5">
          {label}
        </div>
      )}
    </a>
  );
};

// Sidebar Toggle Button
export const SidebarToggle = ({ isExpanded, onClick, className }: SidebarToggleProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "mx-auto flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors",
        className
      )}
    >
      {isExpanded ? (
        <IconChevronLeft className="w-5 h-5" />
      ) : (
        <IconChevronRight className="w-5 h-5" />
      )}
    </button>
  );
};

// Sidebar Button Component
export const SidebarButton = ({
  children,
  className,
  variant = "primary",
  onClick,
  href,
  icon,
  isExpanded
}: SidebarButtonProps) => {
  const Tag = href ? 'a' : 'button';
  
  const baseStyles = "flex items-center px-5 py-3 mx-2 mb-2 rounded-xl relative cursor-pointer transition-all duration-200 text-xs font-medium overflow-hidden";

  const variantStyles = {
    primary: "bg-white/10 hover:bg-white/15 text-white",
    secondary: "bg-transparent text-white border border-white/10 hover:border-white/20 hover:bg-white/5",
    dark: "bg-black/30 text-white hover:bg-black/40 border border-white/5",
    gradient: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm",
  };

  return (
    <Tag
      href={href}
      onClick={onClick}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      <div className={cn("flex items-center justify-center", !isExpanded && "w-full")}>
        {icon && <span className="flex-shrink-0 w-4 h-4 mr-2">{icon}</span>}
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Tag>
  );
};

// Default sidebar items for example usage
export const DefaultSidebarItems = [
  {
    icon: <IconLayoutDashboard />,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: <IconUser />,
    label: "Profile",
    href: "/profile",
  },
  {
    icon: <IconSettings />,
    label: "Settings",
    href: "/settings",
  },
];

// Create a SidebarDemo component similar to NavbarDemo but for the sidebar
export const SidebarDemo = () => {
  const pathname = usePathname();
  
  return (
    <Sidebar>
      <SidebarLogo isExpanded={false} />
      
      <SidebarSection title="Main" isExpanded={false}>
        {DefaultSidebarItems.map((item, idx) => (
          <SidebarItem
            key={`sidebar-item-${idx}`}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={pathname === item.href}
            isExpanded={false}
          />
        ))}
      </SidebarSection>
      
      <SidebarSection title="Account" isExpanded={false} className="mt-auto">
        <SidebarItem
          icon={<IconLogout />}
          label="Logout"
          href="/logout"
          isExpanded={false}
        />
      </SidebarSection>
    </Sidebar>
  );
}; 