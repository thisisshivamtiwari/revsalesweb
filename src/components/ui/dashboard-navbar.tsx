"use client";
import { cn } from "@/lib/utils";
import { IconBell, IconCalendarEvent, IconChecklist, IconUsers } from "@tabler/icons-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import React, { useRef, useState } from "react";

interface DashboardNavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavIndicatorProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  variant?: "primary" | "warning" | "danger" | "success";
  className?: string;
}

interface NavIndicatorsContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const DashboardNavbar = ({ children, className }: DashboardNavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className={cn("sticky top-4 z-40 w-full px-4", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  );
};

export const DashboardNavContent = ({ 
  children, 
  className, 
  visible = false 
}: {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(20px)" : "blur(12px)",
        boxShadow: visible
          ? "0 8px 32px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(255, 255, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.1), 0 0 8px rgba(255, 255, 255, 0.03), 0 16px 68px rgba(0, 0, 0, 0.03), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "0 4px 16px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.08)",
        width: visible ? "95%" : "100%",
        y: visible ? 10 : 0,
        borderRadius: visible ? "1.5rem" : "0.75rem",
        padding: visible ? "0.75rem 1.25rem" : "0.75rem 1rem",
        opacity: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full items-center justify-between bg-white/40 dark:bg-neutral-900/40 border border-white/10 dark:border-neutral-800/30",
        className,
      )}
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {children}
    </motion.div>
  );
};

export const NavIndicator = ({ 
  icon, 
  count, 
  label, 
  variant = "primary", 
  className 
}: NavIndicatorProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const variantStyles = {
    primary: "bg-blue-50/70 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-blue-100/50 dark:border-blue-800/30",
    warning: "bg-amber-50/70 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-amber-100/50 dark:border-amber-800/30",
    danger: "bg-red-50/70 text-red-600 dark:bg-red-500/10 dark:text-red-400 border-red-100/50 dark:border-red-800/30",
    success: "bg-green-50/70 text-green-600 dark:bg-green-500/10 dark:text-green-400 border-green-100/50 dark:border-green-800/30",
  };
  
  return (
    <div 
      className={cn(
        "relative flex items-center space-x-2 rounded-xl border backdrop-blur-sm px-3 py-2 transition-all duration-200",
        variantStyles[variant],
        isHovered && "translate-y-[-2px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_5px_15px_rgba(0,0,0,0.2)]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="flex items-center">
          <span className="font-medium">{count}</span>
          <span className="ml-1 text-sm opacity-80">{label}</span>
        </div>
      </div>
      
      {/* Tooltip on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-12 left-1/2 z-50 w-max -translate-x-1/2 rounded-lg bg-neutral-900/90 backdrop-blur-md px-3 py-2 text-xs text-white shadow-[0_8px_16px_rgba(0,0,0,0.2)] dark:bg-white/90 dark:text-neutral-900"
          >
            View all {label}
            <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-neutral-900/90 dark:bg-white/90"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const NavIndicatorsContainer = ({ children, className }: NavIndicatorsContainerProps) => {
  return (
    <div className={cn("flex items-center space-x-3", className)}>
      {children}
    </div>
  );
};

export const NavbarUserMenu = ({ 
  username, 
  avatarUrl,
  onLogout
}: {
  username: string;
  avatarUrl?: string;
  onLogout?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button 
        className="flex items-center space-x-2 rounded-full border border-white/20 bg-white/60 backdrop-blur-sm dark:bg-neutral-800/60 dark:border-neutral-700/30 px-2 py-1 text-sm transition-all hover:shadow-[0_5px_15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-7 w-7 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)] dark:shadow-[0_0_10px_rgba(59,130,246,0.2)]">
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {username}
        </span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-white/20 dark:border-neutral-800/50 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md p-2 shadow-[0_15px_35px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.3)]"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            <div className="space-y-1 p-1">
              <a href="/profile" className="block rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-white/60 dark:text-neutral-300 dark:hover:bg-neutral-800/50">
                Profile
              </a>
              <a href="/settings" className="block rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-white/60 dark:text-neutral-300 dark:hover:bg-neutral-800/50">
                Settings
              </a>
              <button 
                onClick={onLogout} 
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50/80 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Demo component to show usage
export const DashboardNavbarDemo = () => {
  return (
    <DashboardNavbar>
      <DashboardNavContent>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-lg font-semibold text-neutral-800 dark:text-white">
            RevSales
          </a>
        </div>
        
        <NavIndicatorsContainer>
          <NavIndicator 
            icon={<IconChecklist className="h-5 w-5" />} 
            count={8} 
            label="Tasks" 
            variant="primary" 
          />
          <NavIndicator 
            icon={<IconUsers className="h-5 w-5" />} 
            count={3} 
            label="Follow-ups" 
            variant="warning" 
          />
          <NavIndicator 
            icon={<IconCalendarEvent className="h-5 w-5" />} 
            count={2} 
            label="Meetings" 
            variant="success" 
          />
          <NavIndicator 
            icon={<IconBell className="h-5 w-5" />} 
            count={5} 
            label="Notifications" 
            variant="danger" 
          />
        </NavIndicatorsContainer>
        
        <NavbarUserMenu 
          username="John Doe" 
          onLogout={() => console.log("Logout clicked")} 
        />
      </DashboardNavContent>
    </DashboardNavbar>
  );
}; 