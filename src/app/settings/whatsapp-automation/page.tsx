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
  IconBrandWhatsapp,
  IconSearch, 
  IconCalendarEvent,
  IconTag,
  IconInfoCircle,
  IconUser,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
  IconMessage,
  IconCheck,
  IconClock,
  IconPlus
} from "@tabler/icons-react";
import { getWhatsAppRules, WhatsAppRule } from "@/services/whatsapp";

export default function WhatsAppAutomation() {
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
  
  // State for WhatsApp rules data
  const [rules, setRules] = useState<WhatsAppRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  
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

  // Fetch WhatsApp rules on component mount, page change, or search change
  useEffect(() => {
    if (isAuthenticated) {
      fetchWhatsAppRules();
    }
  }, [isAuthenticated, currentPage, debouncedSearch, itemsPerPage]);

  // Function to fetch WhatsApp rules
  const fetchWhatsAppRules = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getWhatsAppRules(itemsPerPage, currentPage, debouncedSearch);
      
      if (response.status && response.code === 200 && response.data) {
        setRules(response.data.rules);
        setTotalItems(response.data.total);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      } else {
        setError(response.message || 'Failed to fetch WhatsApp rules');
        showToast(response.message || 'Failed to fetch WhatsApp rules', 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle rule accordion toggle
  const toggleRuleDetails = (ruleId: string) => {
    if (expandedRuleId === ruleId) {
      setExpandedRuleId(null);
    } else {
      setExpandedRuleId(ruleId);
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

  // Format WhatsApp time
  const formatWhatsAppTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Extract first name from full name
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
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
                WhatsApp Automation
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
              WhatsApp Automation
            </h1>
          </div>

          {/* WhatsApp Chat Interface */}
          <div className="bg-white/20 dark:bg-neutral-800/20 backdrop-blur-md rounded-xl shadow-lg 
            border border-white/10 dark:border-neutral-700/30 overflow-hidden">
            
            {/* WhatsApp Header */}
            <div className="bg-[#128C7E] p-4 md:p-6 flex items-center justify-between">
              <div className="flex items-center">
                <IconBrandWhatsapp size={28} className="text-white mr-3" />
                <div>
                  <h2 className="text-xl font-bold text-white">WhatsApp Templates</h2>
                  <p className="text-white/80 text-sm">Manage your automated message templates</p>
                </div>
              </div>

              {/* Search bar */}
              <div className="hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search templates..."
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
            <div className="md:hidden p-3 bg-[#075E54]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 pl-10 pr-4 rounded-full border-0
                    bg-white/90 focus:outline-none 
                    text-neutral-800 placeholder-neutral-500"
                />
                <IconSearch className="absolute left-3 top-2.5 text-neutral-500" size={18} />
              </div>
            </div>

            {/* WhatsApp Chat Background */}
            <div className="bg-[#E5DDD5] dark:bg-neutral-800 min-h-[400px] relative">
              <div className="absolute inset-0 opacity-5 dark:opacity-10" 
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>

              {/* Loading state */}
              {isLoading && (
                <div className="flex items-center justify-center py-16 relative z-10">
                  <div className="w-12 h-12 border-t-4 border-[#128C7E] border-solid rounded-full animate-spin mx-auto"></div>
                  <p className="ml-4 text-neutral-600 dark:text-neutral-300">Loading templates...</p>
                </div>
              )}

              {/* Error state */}
              {!isLoading && error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 
                  rounded-lg p-4 text-red-700 dark:text-red-300 m-6 relative z-10">
                  <p>{error}</p>
                  <button 
                    onClick={fetchWhatsAppRules}
                    className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800/30 rounded-md hover:bg-red-200 
                    dark:hover:bg-red-700/40 transition-colors text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Empty state */}
              {!isLoading && !error && rules.length === 0 && (
                <div className="text-center py-16 bg-white/50 dark:bg-neutral-800/30 m-6 rounded-lg relative z-10">
                  <IconBrandWhatsapp size={48} className="text-[#128C7E] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">No Templates Found</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-2">
                    {searchQuery 
                      ? `No templates matching "${searchQuery}" were found. Try a different search term.` 
                      : "There are no WhatsApp templates available yet."}
                  </p>
                </div>
              )}

              {/* Templates Grid */}
              {!isLoading && !error && rules.length > 0 && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                  {rules.map((rule) => (
                    <motion.div
                      key={rule.id}
                      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                      className="bg-white dark:bg-neutral-700 rounded-lg shadow-md overflow-hidden flex flex-col"
                    >
                      {/* Template header - WhatsApp style */}
                      <div className="bg-[#F0F2F5] dark:bg-neutral-600 p-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-[#128C7E] flex items-center justify-center text-white font-bold">
                            {getFirstName(rule.createdBy).charAt(0)}
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium text-neutral-800 dark:text-white">{rule.name}</h3>
                            <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mr-2">
                                {rule.leadStatus}
                              </span>
                              <span>By {rule.createdBy}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleRuleDetails(rule.id)}
                          className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-white"
                        >
                          {expandedRuleId === rule.id ? (
                            <IconChevronUp size={20} />
                          ) : (
                            <IconInfoCircle size={20} />
                          )}
                        </button>
                      </div>

                      {/* Template message - WhatsApp chat bubble style */}
                      <div className="p-4 flex-grow bg-white dark:bg-neutral-700 relative">
                        <div className="bg-[#DCF8C6] dark:bg-[#025C4C] text-neutral-800 dark:text-white p-3 rounded-lg max-h-32 overflow-y-auto whitespace-pre-line text-sm">
                          {rule.imageUrl && rule.imageUrl.trim() !== "" ? (
                            <div className="mb-2">
                              <img 
                                src={rule.imageUrl} 
                                alt={`Image for ${rule.name}`}
                                className="w-full h-auto max-h-20 object-cover rounded-md mb-1" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          ) : null}
                          {rule.description.length > 150 
                            ? `${rule.description.substring(0, 150)}...` 
                            : rule.description}
                        </div>
                        
                        {/* WhatsApp style time and check marks */}
                        <div className="flex items-center justify-end mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          <span>{formatWhatsAppTime(rule.createdAt)}</span>
                          <div className="ml-1 flex">
                            <IconCheck size={14} className="text-[#4FC3F7]" />
                            <IconCheck size={14} className="text-[#4FC3F7] -ml-1" />
                          </div>
                        </div>

                        {/* View Details Button */}
                        <button
                          onClick={() => toggleRuleDetails(rule.id)}
                          className="mt-3 w-full px-4 py-2 bg-[#128C7E] hover:bg-[#0e7366] text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          View Full Template
                        </button>
                      </div>

                      {/* Template details - expandable */}
                      {expandedRuleId === rule.id && (
                        <div className="border-t border-neutral-200 dark:border-neutral-600 p-4 bg-[#F0F2F5] dark:bg-neutral-600">
                          <h4 className="text-md font-medium text-neutral-800 dark:text-white mb-3 flex items-center">
                            <IconMessage size={18} className="mr-2 text-[#128C7E]" />
                            Full Template
                          </h4>
                          
                          <div className="bg-[#DCF8C6] dark:bg-[#025C4C] rounded-lg p-4 mb-3 whitespace-pre-line text-neutral-800 dark:text-white text-sm">
                            {rule.imageUrl && rule.imageUrl.trim() !== "" ? (
                              <div className="mb-3">
                                <img 
                                  src={rule.imageUrl} 
                                  alt={`Image for ${rule.name}`}
                                  className="w-full h-auto rounded-md" 
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </div>
                            ) : null}
                            {rule.description}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center bg-white/70 dark:bg-neutral-700/70 p-2 rounded">
                              <IconTag size={14} className="text-[#128C7E] mr-1" />
                              <span className="text-neutral-600 dark:text-neutral-300">
                                Status: <span className="font-medium">{rule.leadStatus}</span>
                              </span>
                            </div>
                            
                            <div className="flex items-center bg-white/70 dark:bg-neutral-700/70 p-2 rounded">
                              <IconCalendarEvent size={14} className="text-[#128C7E] mr-1" />
                              <span className="text-neutral-600 dark:text-neutral-300">
                                Created: <span className="font-medium">{formatDate(rule.createdAt)}</span>
                              </span>
                            </div>
                            
                            <div className="flex items-center bg-white/70 dark:bg-neutral-700/70 p-2 rounded col-span-2">
                              <IconUser size={14} className="text-[#128C7E] mr-1" />
                              <span className="text-neutral-600 dark:text-neutral-300 truncate">
                                By: <span className="font-medium">{rule.createdBy}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Add Template button (placeholder) */}
                  <motion.div
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className="bg-white/90 dark:bg-neutral-700/90 border-2 border-dashed border-[#128C7E] dark:border-[#25D366] rounded-lg shadow-sm flex flex-col items-center justify-center p-6 h-64 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center mb-4">
                      <IconPlus size={32} className="text-white" />
                    </div>
                    <p className="text-center text-neutral-800 dark:text-white font-medium">Create New Template</p>
                    <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm mt-2">Add a new automated message template</p>
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
                    of <span className="font-medium">{totalItems}</span> templates
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-lg ${
                        currentPage === 1
                          ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                          : "bg-[#128C7E] text-white hover:bg-[#0e7366]"
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
                              ? "bg-[#128C7E] text-white"
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
                          : "bg-[#128C7E] text-white hover:bg-[#0e7366]"
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