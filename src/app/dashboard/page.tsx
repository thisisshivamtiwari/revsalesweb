"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SidebarDemo from "@/components/ui/sidebar-demo";
import { DashboardNavbar, DashboardNavContent, NavIndicator, NavIndicatorsContainer, NavbarUserMenu } from "@/components/ui/dashboard-navbar";
import { IconBell, IconCalendarEvent, IconChecklist, IconUsers } from "@tabler/icons-react";

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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                  <div className="text-blue-500 mb-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-1">Sales Leads</h2>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-3">Manage your leads pipeline</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">128</p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                  <div className="text-blue-500 mb-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-1">Tasks</h2>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-3">Your pending tasks</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">24</p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800">
                  <div className="text-green-500 mb-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-1">Revenue</h2>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-3">Monthly revenue</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">$24,500</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {[
                  { title: "New lead added", time: "2 hours ago", action: "John Doe was added as a new lead" },
                  { title: "Task completed", time: "5 hours ago", action: "Follow-up call with ABC Corp" },
                  { title: "Deal closed", time: "Yesterday", action: "XYZ Solutions deal was closed for $15,000" },
                  { title: "New comment", time: "2 days ago", action: "Sarah left a comment on the proposal for MNO Inc." },
                ].map((item, index) => (
                  <div key={index} className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-neutral-800 dark:text-neutral-100">{item.title}</h3>
                        <p className="text-neutral-600 dark:text-neutral-400">{item.action}</p>
                      </div>
                      <span className="text-sm text-neutral-500 dark:text-neutral-500">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 