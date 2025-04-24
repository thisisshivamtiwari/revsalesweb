"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SidebarDemo from "@/components/ui/sidebar-demo";
import { DashboardNavbar, DashboardNavContent, NavIndicator, NavIndicatorsContainer, NavbarUserMenu } from "@/components/ui/dashboard-navbar";
import { IconBell, IconCalendarEvent, IconChecklist, IconUsers } from "@tabler/icons-react";

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated or if user doesn't have admin role
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role !== "ADMIN") {
        // Redirect non-admin users to the regular dashboard
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

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

  // Don't render content if user is not authenticated or not an admin
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null; // Will redirect via useEffect
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
                RevSales Admin
              </a>
            </div>
            
            <NavIndicatorsContainer>
              <NavIndicator 
                icon={<IconChecklist className="h-5 w-5" />} 
                count={12} 
                label="Tasks" 
                variant="primary" 
              />
              <NavIndicator 
                icon={<IconUsers className="h-5 w-5" />} 
                count={5} 
                label="Follow-ups" 
                variant="warning" 
              />
              <NavIndicator 
                icon={<IconCalendarEvent className="h-5 w-5" />} 
                count={3} 
                label="Meetings" 
                variant="success" 
              />
              <NavIndicator 
                icon={<IconBell className="h-5 w-5" />} 
                count={8} 
                label="Notifications" 
                variant="danger" 
              />
            </NavIndicatorsContainer>
            
            <NavbarUserMenu 
              username={user?.fullName || 'Admin'} 
              onLogout={logout} 
            />
          </DashboardNavContent>
        </DashboardNavbar>
      
        <main className="flex-grow py-8 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 md:p-8 mb-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
                    Admin Dashboard
                  </h1>
                  <p className="text-blue-600 dark:text-blue-400 mt-1">Welcome back, {user?.fullName || 'Admin'}</p>
                </div>
              </div>
              
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                You're logged in as an administrator with full access to all system features.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-100 dark:border-indigo-800">
                  <div className="text-indigo-500 mb-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-1">Users</h2>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-3">Total registered users</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">256</p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                  <div className="text-blue-500 mb-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-1">Sales Leads</h2>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-3">All time leads</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">854</p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800">
                  <div className="text-green-500 mb-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-1">Revenue</h2>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-3">Total revenue</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">$127,500</p>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-100 dark:border-yellow-800">
                  <div className="text-yellow-500 mb-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-1">Growth</h2>
                  <p className="text-neutral-600 dark:text-neutral-300 mb-3">Monthly growth rate</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">+18.2%</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">
                  Recent Users
                </h2>
                
                <div className="space-y-4">
                  {[
                    { name: "John Smith", email: "john@example.com", role: "User", joined: "2 days ago" },
                    { name: "Emma Wilson", email: "emma@example.com", role: "Admin", joined: "1 week ago" },
                    { name: "Michael Brown", email: "michael@example.com", role: "User", joined: "2 weeks ago" },
                    { name: "Sarah Davis", email: "sarah@example.com", role: "User", joined: "1 month ago" },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 pb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-neutral-800 dark:text-neutral-100">{user.name}</p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          user.role === 'Admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}>
                          {user.role}
                        </span>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">{user.joined}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="mt-6 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm">
                  View all users →
                </button>
              </div>
              
              <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">
                  System Status
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-700 dark:text-neutral-300">Server Uptime</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">99.98%</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.98%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-700 dark:text-neutral-300">API Response Time</span>
                      <span className="text-green-600 dark:text-green-400 font-medium">124ms</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-700 dark:text-neutral-300">Database Load</span>
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium">68%</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-neutral-700 dark:text-neutral-300">Memory Usage</span>
                      <span className="text-red-600 dark:text-red-400 font-medium">87%</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg">
                  <h3 className="font-medium text-neutral-800 dark:text-neutral-100 mb-2">Recent Logs</h3>
                  <div className="text-xs font-mono text-neutral-600 dark:text-neutral-400 max-h-32 overflow-y-auto">
                    <p className="mb-1">[2023-09-21 15:42:18] INFO: User authentication successful</p>
                    <p className="mb-1">[2023-09-21 15:40:56] WARNING: High database load detected</p>
                    <p className="mb-1">[2023-09-21 15:38:03] INFO: Scheduled backup completed</p>
                    <p className="mb-1">[2023-09-21 15:35:21] ERROR: Failed user password reset attempt</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                  Administrative Actions
                </h2>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                  Add New User
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg text-left hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                  <h3 className="font-medium text-neutral-800 dark:text-neutral-100 mb-1">User Management</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Manage user accounts and permissions</p>
                </button>
                
                <button className="p-4 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg text-left hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                  <h3 className="font-medium text-neutral-800 dark:text-neutral-100 mb-1">System Settings</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Configure application settings and preferences</p>
                </button>
                
                <button className="p-4 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg text-left hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                  <h3 className="font-medium text-neutral-800 dark:text-neutral-100 mb-1">Data Management</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Import, export, and manage system data</p>
                </button>
                
                <button className="p-4 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg text-left hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                  <h3 className="font-medium text-neutral-800 dark:text-neutral-100 mb-1">Logs & Monitoring</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">View system logs and performance metrics</p>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 