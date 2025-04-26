"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SidebarDemo from "@/components/ui/sidebar-demo";

export default function ProfilePage() {
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
          <p className="text-xl text-neutral-600 dark:text-neutral-300">Loading your profile...</p>
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
        <main className="flex-grow py-8 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 md:p-8 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">
                User Profile
              </h1>
              
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-semibold">
                  {user?.fullName?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </div>
                
                <div className="flex-1">
                  <div className="grid gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-500 dark:text-neutral-400">Full Name</label>
                      <p className="text-lg font-medium text-neutral-800 dark:text-neutral-100">{user?.fullName || 'User'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-500 dark:text-neutral-400">Email Address</label>
                      <p className="text-lg font-medium text-neutral-800 dark:text-neutral-100">{user?.email || 'user@example.com'}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-500 dark:text-neutral-400">Role</label>
                      <span className={`inline-block px-3 py-1 text-sm rounded-full ${
                        user?.role === 'ADMIN' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {user?.role || 'User'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                      Edit Profile
                    </button>
                    <button className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 rounded-lg transition-colors">
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">
                Account Settings
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <div>
                    <h3 className="font-medium text-neutral-800 dark:text-neutral-100">Email Notifications</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Receive email updates about your account activity</p>
                  </div>
                  <div className="w-12 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full transform translate-x-6"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <div>
                    <h3 className="font-medium text-neutral-800 dark:text-neutral-100">Two-Factor Authentication</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Add an extra layer of security to your account</p>
                  </div>
                  <div className="w-12 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="font-medium text-neutral-800 dark:text-neutral-100">Dark Mode</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Toggle between light and dark theme</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-500 rounded-full p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full transform translate-x-6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 
 
 
 
 