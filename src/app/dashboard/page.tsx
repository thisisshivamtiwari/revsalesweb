"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SidebarDemo from "@/components/ui/sidebar-demo";
import { DashboardNavbar, DashboardNavContent, NavIndicator, NavIndicatorsContainer, NavbarUserMenu } from "@/components/ui/dashboard-navbar";
import { IconBell, IconCalendarEvent, IconChecklist, IconUsers } from "@tabler/icons-react";
import { MeetingsSection } from '@/components/dashboard/meetings-section';
import { TasksSection } from '@/components/dashboard/tasks-section';
import { LeadsSection } from '@/components/dashboard/leads-section';

export default function Dashboard() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-neutral-600 dark:text-neutral-300">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Render dashboard only if authenticated
  if (!isAuthenticated) {
    return null; // Will redirect to login via useEffect
  }

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
              username={user?.fullName || 'User'} 
              onLogout={logout} 
            />
          </DashboardNavContent>
        </DashboardNavbar>

        <main className="flex-grow py-8 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 md:p-8 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                  Welcome back, {user?.fullName || 'User'}
                </h1>
              </div>
              
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                This is your personalized dashboard. You're logged in as a standard user.
              </p>
              
              
            </div>
            
            <MeetingsSection />
            <br/>
            <TasksSection />
            <br/>
            <LeadsSection />

          </div>
        </main>
      </div>
    </div>
  );
} 