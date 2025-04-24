"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import SidebarDemo from "@/components/ui/sidebar-demo";
import { DashboardNavbar, DashboardNavContent, NavbarUserMenu } from "@/components/ui/dashboard-navbar";
import Toast, { ToastType } from "@/components/ui/toast";
import { IconChevronLeft, IconLink } from "@tabler/icons-react";
import { getIntegrationApps, unlinkIntegration, manageIntegrationPages, IntegrationApp } from "@/services/integrations";

export default function ManageIntegrations() {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const router = useRouter();
  
  // Get the category from URL query parameters
  const [category, setCategory] = useState<string | null>(null);
  
  useEffect(() => {
    // Get the category from URL on client-side
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    setCategory(categoryParam);
  }, []);
  
  // State for integrations data
  const [integrations, setIntegrations] = useState<IntegrationApp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Toast state
  const [toast, setToast] = useState<{
    visible: boolean;
    type: ToastType;
    message: string;
  }>({
    visible: false,
    type: 'info',
    message: '',
  });

  // Show toast message
  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({
      visible: true,
      type,
      message,
    });

    // Auto hide after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Fetch integrations on component mount
  useEffect(() => {
    if (isAuthenticated && user?.companyId) {
      fetchIntegrations();
    }
  }, [isAuthenticated, user]);

  // Function to fetch integrations
  const fetchIntegrations = async () => {
    if (!user?.companyId) {
      showToast('Company ID not found. Please log in again.', 'error');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getIntegrationApps(user.companyId);
      
      if (response.status && response.code === 200 && response.data) {
        setIntegrations(response.data);
      } else {
        setError(response.message || 'Failed to fetch integrations');
        showToast(response.message || 'Failed to fetch integrations', 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle unlink integration
  const handleUnlink = async (app: IntegrationApp) => {
    if (!user?.companyId) {
      showToast('Company ID not found. Please log in again.', 'error');
      return;
    }

    try {
      const response = await unlinkIntegration(user.companyId, app.appId);
      
      if (response.status) {
        // Remove the app from the list or refresh the list
        setIntegrations(prev => prev.filter(item => item.appId !== app.appId));
        showToast(`${app.appName} has been unlinked successfully`, 'success');
      } else {
        showToast(response.message, 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      showToast(errorMessage, 'error');
    }
  };

  // Handle manage pages
  const handleManagePages = async (app: IntegrationApp) => {
    try {
      const response = await manageIntegrationPages(app.appId);
      
      if (response.status && response.url) {
        // Open the management URL in a new tab
        window.open(response.url, '_blank');
      } else {
        showToast(response.message, 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      showToast(errorMessage, 'error');
    }
  };

  // Handle button click based on type
  const handleButtonClick = (app: IntegrationApp, buttonType: string) => {
    const buttonTypeFormatted = buttonType.toLowerCase().trim();
    
    if (buttonTypeFormatted === 'unlink') {
      handleUnlink(app);
    } else if (buttonTypeFormatted === 'manage pages') {
      handleManagePages(app);
    }
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-neutral-600 dark:text-neutral-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null; // Return null as the navigation will be handled by useEffect in AuthContext
  }

  return (
    <div className="min-h-screen flex flex-row w-full bg-neutral-100 dark:bg-neutral-900">
      {/* Toast notification */}
      {toast.visible && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
      )}

      {/* Sidebar */}
      <SidebarDemo />
      
      {/* Main content - with padding to accommodate fixed sidebar */}
      <div className="flex-1 ml-[90px] lg:ml-[90px] transition-all duration-300">
        {/* Dashboard Navbar */}
        <DashboardNavbar className="mb-4">
          <DashboardNavContent>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-lg font-semibold text-neutral-800 dark:text-white">
                Manage Integrations
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
              onClick={() => {
                if (category) {
                  router.push(`/settings?activeCategory=${category}`);
                } else {
                  router.back();
                }
              }}
              className="p-2 rounded-full bg-white/20 dark:bg-neutral-800/40 backdrop-blur-sm 
              border border-white/10 dark:border-neutral-700/30 mr-4 hover:bg-white/30 dark:hover:bg-neutral-700/50 transition-all duration-200"
            >
              <IconChevronLeft className="text-neutral-800 dark:text-neutral-200" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              Manage Integrations
            </h1>
          </div>

          <div className="bg-white/20 dark:bg-neutral-800/20 backdrop-blur-md rounded-xl shadow-lg 
            border border-white/10 dark:border-neutral-700/30 p-6 md:p-8">
            
            <div className="flex items-center mb-6">
              <IconLink size={24} className="text-purple-500 mr-2" />
              <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                Connected Applications
              </h2>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
                <p className="ml-4 text-neutral-600 dark:text-neutral-300">Loading integrations...</p>
              </div>
            )}

            {/* Error state */}
            {!isLoading && error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 
                rounded-lg p-4 text-red-700 dark:text-red-300 mb-6">
                <p>{error}</p>
                <button 
                  onClick={fetchIntegrations}
                  className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800/30 rounded-md hover:bg-red-200 
                  dark:hover:bg-red-700/40 transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && integrations.length === 0 && (
              <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800/30 rounded-lg">
                <IconLink size={48} className="text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">No Integrations Found</h3>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-2">
                  You haven't connected any applications yet. Connect with external services to enhance your workflow.
                </p>
              </div>
            )}

            {/* Integration cards */}
            {!isLoading && !error && integrations.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((app) => (
                  <motion.div
                    key={app.appId}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-white dark:bg-neutral-800 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 
                      overflow-hidden transition-all duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="relative w-12 h-12 flex-shrink-0 mr-4 rounded-lg overflow-hidden">
                          <Image
                            src={app.logo}
                            alt={`${app.appName} logo`}
                            fill
                            objectFit="contain"
                            className="bg-white p-1 rounded-lg"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">{app.appName}</h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">Connected</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {app.buttons.map((buttonType) => {
                          const buttonTypeFormatted = buttonType.toLowerCase().trim();
                          const isDanger = buttonTypeFormatted === 'unlink';
                          
                          return (
                            <button
                              key={`${app.appId}-${buttonTypeFormatted}`}
                              onClick={() => handleButtonClick(app, buttonTypeFormatted)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isDanger 
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-800/50'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/50'
                              }`}
                            >
                              {buttonType.charAt(0).toUpperCase() + buttonType.slice(1)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 