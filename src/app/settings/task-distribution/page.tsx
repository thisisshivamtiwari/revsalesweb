'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button, Input, Table, Skeleton, Alert, Empty, Tag, Spin, Tooltip, Badge, Select } from 'antd';
import { toast, Toaster } from 'react-hot-toast';
import { 
  IconRefresh, 
  IconSearch, 
  IconFilter,
  IconUser,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconInfoCircle,
  IconSettingsAutomation
} from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import SidebarDemo from "@/components/ui/sidebar-demo";
import { DashboardNavbar, DashboardNavContent, NavbarUserMenu } from "@/components/ui/dashboard-navbar";
import { useAuth } from '@/context/AuthContext';
import { fetchRules, TaskDistributionRule } from '@/services/taskDistribution';
import dayjs from 'dayjs';

export default function TaskDistributionPage() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get the category from URL query parameters
  const [category, setCategory] = useState<string | null>(null);
  
  useEffect(() => {
    // Get the category from URL on client-side
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');
    setCategory(categoryParam);
  }, []);
  
  const [rules, setRules] = useState<TaskDistributionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    total: 0,
  });

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMM D, YYYY');
  };

  // Format deadline to hours
  const formatDeadline = (seconds: number) => {
    return `${Math.round(seconds / 3600)} hours`;
  };

  // Fetch rules data from API
  const getRules = useCallback(async (page = 1, search = '') => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching task distribution rules - page: ${page}, search: ${search}`);
      const response = await fetchRules({
        pageNumber: page,
        limit: pagination.pageSize,
        search: search,
      });
      
      console.log('Response from API:', response);
      
      if (response.status && response.code === 200) {
        setRules(response.data.rules);
        setPagination({
          ...pagination,
          current: page,
          total: response.data.total,
        });
      } else {
        setError(response.message || 'Failed to fetch rules');
        toast.error(response.message || 'Failed to fetch rules');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching rules:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageSize]);

  // Handle pagination change
  const handlePageChange = useCallback((page: number) => {
    setLoading(true);
    getRules(page, searchQuery);
  }, [getRules, searchQuery]);

  // Handle search input change with debounce
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Reset to page 1 when searching
    getRules(1, value);
  }, [getRules]);

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    getRules(pagination.current, searchQuery);
    toast.success('Rules list refreshed');
  }, [getRules, pagination.current, searchQuery]);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((value: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize: value,
      current: 1 // Reset to first page when changing items per page
    }));
    getRules(1, searchQuery);
  }, [getRules, searchQuery]);

  // Initial data fetch when component mounts or auth state changes
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      getRules();
    } else if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, getRules]);

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
    return null; // Return null as the navigation will be handled by useEffect
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
                Task Distribution
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
              Task Distribution Rules
            </h1>
          </div>

          <div className="bg-white/20 dark:bg-neutral-800/20 backdrop-blur-md rounded-xl shadow-lg border border-white/10 dark:border-neutral-700/30 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <IconSettingsAutomation size={24} className="text-purple-500 mr-2" />
                <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                  Distribution Rules
                </h2>
                <Badge 
                  count={pagination.total} 
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
                      placeholder="Search rules..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full md:w-64 py-2 pl-10 pr-4 rounded-lg border border-neutral-200 dark:border-neutral-700
                        bg-white/50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500
                        text-neutral-800 dark:text-neutral-200"
                    />
                    <IconSearch className="absolute left-3 top-2.5 text-neutral-400 dark:text-neutral-500" size={18} />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Select
                    value={pagination.pageSize}
                    onChange={handleItemsPerPageChange}
                    options={[
                      { value: 6, label: '6' },
                      { value: 12, label: '12' },
                      { value: 24, label: '24' },
                    ]}
                    className="w-20"
                    size="small"
                    popupMatchSelectWidth={false}
                  />
                  <Button
                    icon={<IconRefresh size={18} />}
                    onClick={handleRefresh}
                    className="flex items-center"
                  >
                    Refresh
                  </Button>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 
                rounded-lg p-4 text-red-700 dark:text-red-300 mb-6">
                <div className="flex items-center">
                  <IconInfoCircle size={24} className="mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Failed to load rules</h3>
                    <p className="mt-1">{error}</p>
                    <button 
                      onClick={() => getRules()}
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

            {/* Loading state */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
                <p className="ml-4 text-neutral-600 dark:text-neutral-300">Loading rules...</p>
              </div>
            ) : rules.length > 0 ? (
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div 
                    key={rule.id}
                    className="bg-white dark:bg-neutral-800 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 
                      overflow-hidden transition-all duration-300"
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
                              <IconSettingsAutomation size={20} className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">{rule.name}</h3>
                              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                                Created by {rule.createdBy} on {formatDate(rule.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0 flex items-center">
                          <div className="flex items-center mr-6">
                            <IconUser size={16} className="text-neutral-500 dark:text-neutral-400 mr-1" />
                            <span className="text-neutral-700 dark:text-neutral-300">
                              {rule.assignedTo ? `Assigned to: ${rule.assignedTo}` : 'Not assigned'}
                            </span>
                          </div>
                          
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                              toast.success(`Viewing details for rule: ${rule.name}`);
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>

                      {/* Rule details */}
                      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                        <p className="text-neutral-700 dark:text-neutral-300 mb-4">{rule.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 w-24">Lead Status:</span>
                              <span className="text-neutral-800 dark:text-neutral-200">{rule.leadStatus}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 w-24">Type:</span>
                              <span className="text-neutral-800 dark:text-neutral-200">{rule.type}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 w-24">Deadline:</span>
                              <span className="text-neutral-800 dark:text-neutral-200">{formatDeadline(rule.deadline)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Tag color="blue" className="rounded-full px-3 py-1">
                            Status: {rule.leadStatus}
                          </Tag>
                          <Tag color="green" className="rounded-full px-3 py-1">
                            Type: {rule.type}
                          </Tag>
                          <Tag color="orange" className="rounded-full px-3 py-1">
                            Deadline: {formatDeadline(rule.deadline)}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                description="No rules found"
                className="py-16"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 