"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SidebarDemo from "@/components/ui/sidebar-demo";
import { DashboardNavbar, DashboardNavContent, NavbarUserMenu } from "@/components/ui/dashboard-navbar";
import { 
  IconChevronLeft,
  IconSearch,
  IconHeadset,
  IconInfoCircle,
  IconRefresh,
  IconPlus,
  IconChevronRight,
  IconChevronDown,
  IconChevronUp,
  IconAdjustments,
  IconCurrencyDollar
} from "@tabler/icons-react";
import { fetchServices, Service, Subservice } from "@/services/services";
import { Typography, Button, Badge, Avatar, Select } from 'antd';
import dayjs from 'dayjs';
import { toast, Toaster } from 'react-hot-toast';

const { Title, Text } = Typography;

export default function ServicesPage() {
  const { isAuthenticated, isLoading: authLoading, user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get the category from URL query parameters
  const [category, setCategory] = useState<string | null>(null);
  
  useEffect(() => {
    // Get the category from URL on client-side
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('activeCategory');
    setCategory(categoryParam);
  }, []);
  
  // State for service data
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Expanded service state
  const [expandedServiceIds, setExpandedServiceIds] = useState<string[]>([]);

  // Toggle service details expansion
  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServiceIds(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId) 
        : [...prev, serviceId]
    );
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Reset to first page on search
    setCurrentPage(1);
    fetchServicesData(1, itemsPerPage, query);
  };

  // Fetch services on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchServicesData(currentPage, itemsPerPage, searchQuery);
    }
  }, [isAuthenticated]);

  // Function to fetch services
  const fetchServicesData = async (page: number = currentPage, limit: number = itemsPerPage, search: string = searchQuery) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching services - page: ${page}, limit: ${limit}, search: ${search}`);
      const response = await fetchServices(page, limit, search);
      console.log('Response from API:', response);
      
      if (response.status && response.code === 200) {
        setServices(response.data.services);
        setTotalItems(response.data.total);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      } else {
        setError(response.message || 'Failed to fetch services');
        toast.error(response.message || 'Failed to fetch services');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchServicesData(currentPage, itemsPerPage, searchQuery);
    toast.success('Refreshed services data');
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchServicesData(page, itemsPerPage, searchQuery);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMM D, YYYY');
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
      {/* Toast container */}
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <SidebarDemo />
      
      {/* Main content - with padding to accommodate fixed sidebar */}
      <div className="flex-1 ml-[90px] lg:ml-[90px] transition-all duration-300">
        {/* Dashboard Navbar */}
        <DashboardNavbar className="mb-4">
          <DashboardNavContent>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-lg font-semibold text-neutral-800 dark:text-white">
                Services
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
              Services
            </h1>
          </div>

          <div className="bg-white/20 dark:bg-neutral-800/20 backdrop-blur-md rounded-xl shadow-lg 
            border border-white/10 dark:border-neutral-700/30 p-6 md:p-8">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <IconHeadset size={24} className="text-amber-500 mr-2" />
                <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                  All Services
                </h2>
                <Badge 
                  count={totalItems} 
                  className="ml-2" 
                  style={{ backgroundColor: '#1890ff' }} 
                />
              </div>

              <div className="flex items-center space-x-4">
                {/* Search bar */}
                <div className="w-full md:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full md:w-64 py-2 pl-10 pr-4 rounded-lg border border-neutral-200 dark:border-neutral-700
                        bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500
                        text-neutral-800 dark:text-neutral-200"
                    />
                    <IconSearch className="absolute left-3 top-2.5 text-neutral-400 dark:text-neutral-500" size={18} />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select
                    value={itemsPerPage}
                    onChange={(value) => {
                      setItemsPerPage(value);
                      setCurrentPage(1); // Reset to first page when changing items per page
                      fetchServicesData(1, value, searchQuery);
                    }}
                    options={[
                      { value: 5, label: '5' },
                      { value: 10, label: '10' },
                      { value: 20, label: '20' },
                      { value: 50, label: '50' },
                    ]}
                    className="w-20"
                    size="small"
                    popupMatchSelectWidth={false}
                  />
                </div>
                
                <Button 
                  icon={<IconRefresh size={18} />}
                  onClick={handleRefresh}
                  className="border-neutral-200 dark:border-neutral-700 dark:text-neutral-300"
                >
                  Refresh
                </Button>
              </div>
            </div>
            
            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
                <p className="ml-4 text-neutral-600 dark:text-neutral-300">Loading services...</p>
              </div>
            )}
            
            {/* Error state */}
            {!isLoading && error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 
                rounded-lg p-4 text-red-700 dark:text-red-300 mb-6">
                <div className="flex items-center">
                  <IconInfoCircle size={24} className="mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Failed to load services</h3>
                    <p className="mt-1">{error}</p>
                    <button 
                      onClick={() => fetchServicesData()}
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-700 
                        text-red-700 dark:text-red-300 bg-white dark:bg-neutral-800 rounded-md text-sm font-medium 
                        hover:bg-red-50 dark:hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* No data state */}
            {!isLoading && !error && services.length === 0 && (
              <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-8 text-center">
                <IconHeadset size={48} className="text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">No services found</h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                  Try changing your search criteria or check back later.
                </p>
              </div>
            )}
            
            {/* Services list */}
            {!isLoading && !error && services.length > 0 && (
              <div className="space-y-4">
                {services.map((service) => (
                  <div 
                    key={service.id}
                    className="bg-white dark:bg-neutral-800 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 
                      overflow-hidden transition-all duration-300"
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mr-3">
                              <IconHeadset size={20} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">{service.name}</h3>
                              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                                Created on {formatDate(service.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0 flex items-center">
                          <div className="text-xl font-bold text-green-600 dark:text-green-400 mr-6">
                            {formatCurrency(service.price)}
                          </div>
                          
                          <Button
                            icon={expandedServiceIds.includes(service.id) ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                            onClick={() => toggleServiceExpansion(service.id)}
                            className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                          >
                            {expandedServiceIds.includes(service.id) ? 'Hide' : 'View'} Subservices
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Subservices section (expanded) */}
                    {expandedServiceIds.includes(service.id) && (
                      <div className="border-t border-neutral-200 dark:border-neutral-700 p-4 md:p-6 bg-neutral-50/50 dark:bg-neutral-800/50">
                        <h4 className="text-md font-medium text-neutral-800 dark:text-white mb-4 flex items-center">
                          <IconInfoCircle size={18} className="mr-2 text-blue-500" />
                          Included Subservices ({service.subservices.length})
                        </h4>
                        
                        {service.subservices.length === 0 ? (
                          <p className="text-neutral-500 dark:text-neutral-400 italic">No subservices available</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {service.subservices.map((subservice) => (
                              <div 
                                key={subservice.id}
                                className="p-2 rounded-lg bg-white/70 dark:bg-neutral-700/30 border border-neutral-200 dark:border-neutral-600 flex items-center"
                              >
                                <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                                <span className="text-sm text-neutral-700 dark:text-white">
                                  {subservice.name}
                                </span>
                                {subservice.price > 0 && (
                                  <span className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full flex items-center">
                                    <IconCurrencyDollar size={12} className="mr-0.5" />
                                    {formatCurrency(subservice.price)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!isLoading && !error && totalPages > 1 && (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-8 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, totalItems)}
                    </span>{" "}
                    of <span className="font-medium">{totalItems}</span> services
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Show</span>
                    <Select
                      value={itemsPerPage}
                      onChange={(value) => {
                        setItemsPerPage(value);
                        setCurrentPage(1); // Reset to first page when changing items per page
                        fetchServicesData(1, value, searchQuery);
                      }}
                      options={[
                        { value: 5, label: '5' },
                        { value: 10, label: '10' },
                        { value: 20, label: '20' },
                        { value: 50, label: '50' },
                      ]}
                      className="w-20"
                      size="small"
                      popupMatchSelectWidth={false}
                    />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">per page</span>
                  </div>
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
                    const pageNum = i + 1;
                    const isActive = pageNum === currentPage;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm ${
                          isActive
                            ? "bg-blue-500 text-white"
                            : "border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                        }`}
                      >
                        {pageNum}
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