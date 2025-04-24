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
  IconNotes, 
  IconSearch, 
  IconCash, 
  IconCalendar,
  IconInfoCircle,
  IconUser,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp
} from "@tabler/icons-react";
import { getPackages, Package } from "@/services/packages";

export default function ManagePackages() {
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
  
  // State for packages data
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
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

  // Fetch packages on component mount, page change, or search change
  useEffect(() => {
    if (isAuthenticated) {
      fetchPackages();
    }
  }, [isAuthenticated, currentPage, debouncedSearch, itemsPerPage]);

  // Function to fetch packages
  const fetchPackages = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getPackages(itemsPerPage, currentPage, debouncedSearch);
      
      if (response.status && response.code === 200 && response.data) {
        setPackages(response.data.packages);
        setTotalItems(response.data.total);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      } else {
        setError(response.message || 'Failed to fetch packages');
        showToast(response.message || 'Failed to fetch packages', 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle package accordion toggle
  const togglePackageDetails = (packageId: string) => {
    if (expandedPackageId === packageId) {
      setExpandedPackageId(null);
    } else {
      setExpandedPackageId(packageId);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
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
                Packages
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
              Packages
            </h1>
          </div>

          <div className="bg-white/20 dark:bg-neutral-800/20 backdrop-blur-md rounded-xl shadow-lg 
            border border-white/10 dark:border-neutral-700/30 p-6 md:p-8">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <IconNotes size={24} className="text-teal-500 mr-2" />
                <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                  Available Packages
                </h2>
              </div>

              {/* Search bar */}
              <div className="w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search packages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-64 py-2 pl-10 pr-4 rounded-lg border border-neutral-200 dark:border-neutral-700
                      bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500
                      text-neutral-800 dark:text-neutral-200"
                  />
                  <IconSearch className="absolute left-3 top-2.5 text-neutral-400 dark:text-neutral-500" size={18} />
                </div>
              </div>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
                <p className="ml-4 text-neutral-600 dark:text-neutral-300">Loading packages...</p>
              </div>
            )}

            {/* Error state */}
            {!isLoading && error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 
                rounded-lg p-4 text-red-700 dark:text-red-300 mb-6">
                <p>{error}</p>
                <button 
                  onClick={fetchPackages}
                  className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800/30 rounded-md hover:bg-red-200 
                  dark:hover:bg-red-700/40 transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !error && packages.length === 0 && (
              <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-800/30 rounded-lg">
                <IconNotes size={48} className="text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">No Packages Found</h3>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-2">
                  {searchQuery 
                    ? `No packages matching "${searchQuery}" were found. Try a different search term.` 
                    : "There are no packages available yet."}
                </p>
              </div>
            )}

            {/* Packages list */}
            {!isLoading && !error && packages.length > 0 && (
              <div className="space-y-4">
                {packages.map((pkg) => (
                  <div 
                    key={pkg.id}
                    className="bg-white dark:bg-neutral-800 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 
                      overflow-hidden transition-all duration-300"
                  >
                    {/* Package header */}
                    <div 
                      className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between cursor-pointer"
                      onClick={() => togglePackageDetails(pkg.id)}
                    >
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">{pkg.name}</h3>
                          <span className="ml-3 px-3 py-1 text-xs font-medium rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300">
                            {pkg.isMonthly ? 'Monthly' : 'One-time'}
                          </span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">{pkg.description}</p>
                      </div>
                      
                      <div className="flex items-center mt-4 md:mt-0">
                        <div className="text-right mr-4">
                          <div className="text-xl font-bold text-neutral-800 dark:text-white">
                            {formatCurrency(pkg.total)}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            Created by {pkg.createdByName}
                          </div>
                        </div>
                        
                        {expandedPackageId === pkg.id ? (
                          <IconChevronUp className="text-neutral-500 dark:text-neutral-400" />
                        ) : (
                          <IconChevronDown className="text-neutral-500 dark:text-neutral-400" />
                        )}
                      </div>
                    </div>
                    
                    {/* Package details (expandable) */}
                    {expandedPackageId === pkg.id && (
                      <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 md:p-6 bg-neutral-50/50 dark:bg-neutral-800/50">
                        <h4 className="text-md font-medium text-neutral-800 dark:text-white mb-4 flex items-center">
                          <IconInfoCircle size={18} className="mr-2 text-blue-500" />
                          Included Services
                        </h4>
                        
                        {pkg.services.map((service, serviceIdx) => (
                          <div key={serviceIdx} className="mb-4 last:mb-0">
                            {service.serviceName && (
                              <h5 className="font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                {service.serviceName}
                              </h5>
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {service.subServices.map((subService) => (
                                <div 
                                  key={subService.serviceId}
                                  className="p-2 rounded-lg bg-white/70 dark:bg-neutral-700/30 border border-neutral-200 dark:border-neutral-600 flex items-center"
                                >
                                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                                    {subService.serviceName}
                                  </span>
                                  {subService.count > 1 && (
                                    <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                      ×{subService.count}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex flex-wrap gap-4">
                          <div className="flex items-center">
                            <IconCash size={18} className="text-green-500 mr-2" />
                            <span className="text-neutral-600 dark:text-neutral-400">
                              Price: <span className="font-medium text-neutral-800 dark:text-white">{formatCurrency(pkg.total)}</span>
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <IconCalendar size={18} className="text-blue-500 mr-2" />
                            <span className="text-neutral-600 dark:text-neutral-400">
                              Billing: <span className="font-medium text-neutral-800 dark:text-white">{pkg.isMonthly ? 'Monthly' : 'One-time'}</span>
                            </span>
                          </div>
                          
                          <div className="flex items-center">
                            <IconUser size={18} className="text-purple-500 mr-2" />
                            <span className="text-neutral-600 dark:text-neutral-400">
                              Created by: <span className="font-medium text-neutral-800 dark:text-white">{pkg.createdByName}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!isLoading && !error && totalPages > 1 && (
              <div className="flex justify-between items-center mt-8">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </span>{" "}
                  of <span className="font-medium">{totalItems}</span> packages
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border ${
                      currentPage === 1
                        ? "border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                        : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
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
                        className={`w-10 h-10 rounded-lg border ${
                          currentPage === pageToShow
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                            : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                        }`}
                      >
                        {pageToShow}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border ${
                      currentPage === totalPages
                        ? "border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                        : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                    }`}
                  >
                    <IconChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 