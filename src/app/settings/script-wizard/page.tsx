"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import SidebarDemo from "@/components/ui/sidebar-demo";
import { DashboardNavbar, DashboardNavContent, NavbarUserMenu } from "@/components/ui/dashboard-navbar";
import Toast, { ToastType } from "@/components/ui/toast";
import { 
  IconChevronLeft,
  IconSearch, 
  IconCalendarEvent,
  IconUser,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
  IconWand,
  IconPlus,
  IconQuestionMark,
  IconStairs,
  IconUsers,
  IconInfoCircle
} from "@tabler/icons-react";
import { getWizards, Wizard } from "@/services/wizard";

export default function ScriptWizardPage() {
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
  
  // State for wizard data
  const [wizards, setWizards] = useState<Wizard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedWizardId, setExpandedWizardId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(7);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
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

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

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

  // Fetch wizards on component mount, page change, or search change
  useEffect(() => {
    if (isAuthenticated) {
      fetchWizards();
    }
  }, [isAuthenticated, currentPage, debouncedSearch, itemsPerPage]);

  // Function to fetch wizards
  const fetchWizards = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getWizards(itemsPerPage, currentPage, debouncedSearch);
      
      if (response.status && response.code === 200 && response.data) {
        setWizards(response.data.wizards);
        setTotalItems(response.data.total);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      } else {
        setError(response.message || 'Failed to fetch wizards');
        showToast(response.message || 'Failed to fetch wizards', 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle wizard toggle
  const toggleWizardDetails = (wizardId: string) => {
    if (expandedWizardId === wizardId) {
      setExpandedWizardId(null);
    } else {
      setExpandedWizardId(wizardId);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Get first name initial
  const getFirstNameInitial = (fullName: string) => {
    if (!fullName) return '?';
    return fullName.charAt(0).toUpperCase();
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
                Script Wizard
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
              Script Wizard
            </h1>
          </div>

          {/* Wizard Interface */}
          <div className="bg-white/20 dark:bg-neutral-800/20 backdrop-blur-md rounded-xl shadow-lg 
            border border-white/10 dark:border-neutral-700/30 overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 md:p-6 flex items-center justify-between">
              <div className="flex items-center">
                <IconWand size={28} className="text-white mr-3" />
                <div>
                  <h2 className="text-xl font-bold text-white">Script Wizards</h2>
                  <p className="text-white/80 text-sm">Manage your sales script wizards</p>
                </div>
              </div>

              {/* Search bar */}
              <div className="hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search wizards..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 py-2 pl-10 pr-4 rounded-full border-0
                      bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50
                      text-neutral-800 placeholder-neutral-500"
                  />
                  <IconSearch className="absolute left-3 top-2.5 text-neutral-500" size={18} />
                </div>
              </div>
            </div>
            
            {/* Mobile Search (visible on small screens) */}
            <div className="md:hidden p-3 bg-indigo-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search wizards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 rounded-full border-0
                    bg-white/90 focus:outline-none 
                    text-neutral-800 placeholder-neutral-500"
                />
                <IconSearch className="absolute left-3 top-2.5 text-neutral-500" size={18} />
              </div>
            </div>

            {/* Content Background */}
            <div className="bg-gradient-to-b from-white to-gray-50 dark:from-neutral-800 dark:to-neutral-900 min-h-[400px] relative">
              <div className="absolute inset-0 opacity-5 dark:opacity-10" 
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.5' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}
              ></div>

              {/* Loading state */}
              {isLoading && (
                <div className="flex items-center justify-center py-16 relative z-10">
                  <div className="w-12 h-12 border-t-4 border-purple-500 border-solid rounded-full animate-spin mx-auto"></div>
                  <p className="ml-4 text-neutral-600 dark:text-neutral-300">Loading wizards...</p>
                </div>
              )}

              {/* Error state */}
              {!isLoading && error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 
                  rounded-lg p-4 text-red-700 dark:text-red-300 m-6 relative z-10">
                  <p>{error}</p>
                  <button 
                    onClick={fetchWizards}
                    className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800/30 rounded-md hover:bg-red-200 
                    dark:hover:bg-red-700/40 transition-colors text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Empty state */}
              {!isLoading && !error && wizards.length === 0 && (
                <div className="text-center py-16 bg-white/50 dark:bg-neutral-800/30 m-6 rounded-lg relative z-10">
                  <IconWand size={48} className="text-purple-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">No Wizards Found</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-2">
                    {searchQuery 
                      ? `No wizards matching "${searchQuery}" were found. Try a different search term.` 
                      : "There are no script wizards available yet."}
                  </p>
                </div>
              )}

              {/* Wizards Grid */}
              {!isLoading && !error && wizards.length > 0 && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                  {wizards.map((wizard) => (
                    <motion.div
                      key={wizard.id}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      className="bg-white dark:bg-neutral-700 rounded-lg shadow-md overflow-hidden flex flex-col"
                    >
                      {/* Wizard header */}
                      <div className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold">
                            {getFirstNameInitial(wizard.createdByName)}
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium text-white text-lg">{wizard.name}</h3>
                            <div className="flex items-center text-xs text-white/70">
                              <span>By {wizard.createdByName}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleWizardDetails(wizard.id)}
                          className="text-white/70 hover:text-white"
                        >
                          {expandedWizardId === wizard.id ? (
                            <IconChevronUp size={20} />
                          ) : (
                            <IconInfoCircle size={20} />
                          )}
                        </button>
                      </div>

                      {/* Wizard stats */}
                      <div className="p-4 flex-grow bg-white dark:bg-neutral-700">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-3 flex flex-col items-center">
                            <div className="bg-purple-100 dark:bg-purple-800/50 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                              <IconStairs size={20} className="text-purple-600 dark:text-purple-300" />
                            </div>
                            <span className="text-sm text-neutral-600 dark:text-neutral-300">Steps</span>
                            <span className="text-xl font-bold text-purple-600 dark:text-purple-300">{wizard.steps}</span>
                          </div>
                          
                          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 flex flex-col items-center">
                            <div className="bg-indigo-100 dark:bg-indigo-800/50 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                              <IconQuestionMark size={20} className="text-indigo-600 dark:text-indigo-300" />
                            </div>
                            <span className="text-sm text-neutral-600 dark:text-neutral-300">Questions</span>
                            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-300">{wizard.questions}</span>
                          </div>
                          
                          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 flex flex-col items-center">
                            <div className="bg-blue-100 dark:bg-blue-800/50 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                              <IconUsers size={20} className="text-blue-600 dark:text-blue-300" />
                            </div>
                            <span className="text-sm text-neutral-600 dark:text-neutral-300">Leads</span>
                            <span className="text-xl font-bold text-blue-600 dark:text-blue-300">{wizard.assignedLeads}</span>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 flex flex-col items-center">
                            <div className="bg-gray-100 dark:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center mb-2">
                              <IconCalendarEvent size={20} className="text-gray-600 dark:text-gray-300" />
                            </div>
                            <span className="text-sm text-neutral-600 dark:text-neutral-300">Created</span>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                              {formatDate(wizard.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <button
                          onClick={() => toggleWizardDetails(wizard.id)}
                          className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          {expandedWizardId === wizard.id ? "Hide Details" : "View Details"}
                        </button>
                      </div>

                      {/* Wizard details - expandable */}
                      {expandedWizardId === wizard.id && (
                        <div className="border-t border-neutral-200 dark:border-neutral-600 p-4 bg-gray-50 dark:bg-neutral-800">
                          <h4 className="text-md font-medium text-neutral-800 dark:text-white mb-3 flex items-center">
                            <IconWand size={18} className="mr-2 text-purple-500" />
                            Wizard Details
                          </h4>
                          
                          <div className="space-y-3">
                            <div className="bg-white dark:bg-neutral-700 rounded-lg p-3 border border-neutral-200 dark:border-neutral-600">
                              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Wizard ID:</span>
                              <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">{wizard.id}</span>
                            </div>
                            
                            <div className="bg-white dark:bg-neutral-700 rounded-lg p-3 border border-neutral-200 dark:border-neutral-600">
                              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Creator ID:</span>
                              <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">{wizard.createdBy}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center justify-between bg-white dark:bg-neutral-700 rounded-lg p-3 border border-neutral-200 dark:border-neutral-600">
                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Steps:</span>
                                <span className="text-sm font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 px-2 py-1 rounded">{wizard.steps}</span>
                              </div>
                              
                              <div className="flex items-center justify-between bg-white dark:bg-neutral-700 rounded-lg p-3 border border-neutral-200 dark:border-neutral-600">
                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Questions:</span>
                                <span className="text-sm font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded">{wizard.questions}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between bg-white dark:bg-neutral-700 rounded-lg p-3 border border-neutral-200 dark:border-neutral-600">
                              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Created:</span>
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(wizard.createdAt)}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex space-x-2">
                            <button className="flex-1 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors">
                              Edit Wizard
                            </button>
                            <button className="flex-1 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800/40 transition-colors">
                              Assign Leads
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Add Wizard button (placeholder) */}
                  <motion.div
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className="bg-white/90 dark:bg-neutral-700/90 border-2 border-dashed border-purple-400 dark:border-purple-500 rounded-lg shadow-sm flex flex-col items-center justify-center p-6 h-64 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center mb-4">
                      <IconPlus size={32} className="text-white" />
                    </div>
                    <p className="text-center text-neutral-800 dark:text-white font-medium">Create New Wizard</p>
                    <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm mt-2">Build a custom sales script wizard</p>
                  </motion.div>
                </div>
              )}

              {/* Pagination */}
              {!isLoading && !error && totalPages > 1 && (
                <div className="flex justify-between items-center bg-white/90 dark:bg-neutral-700/70 p-4 relative z-10">
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>{" "}
                    of <span className="font-medium">{totalItems}</span> wizards
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg ${
                        currentPage === 1
                          ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                      }`}
                    >
                      <IconChevronLeft size={18} />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Logic to show current page and nearby pages
                      let pageToShow;
                      if (totalPages <= 5) {
                        pageToShow = i + 1;
                      } else if (currentPage <= 3) {
                        pageToShow = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageToShow = totalPages - 4 + i;
                      } else {
                        pageToShow = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(pageToShow)}
                          className={`w-8 h-8 rounded-full ${
                            currentPage === pageToShow
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                              : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          }`}
                        >
                          {pageToShow}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-lg ${
                        currentPage === totalPages
                          ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                      }`}
                    >
                      <IconChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 