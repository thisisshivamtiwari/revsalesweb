'use client';

import React, { useEffect, useState } from 'react';
import { Button, Input, Table, Skeleton, Alert, Empty, Tag, Spin, Tooltip, Badge, Select } from 'antd';
import { toast, Toaster } from 'react-hot-toast';
import { 
  IconRefresh, 
  IconSearch, 
  IconUsersGroup, 
  IconUser,
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
  IconInfoCircle
} from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import SidebarDemo from "@/components/ui/sidebar-demo";
import { DashboardNavbar, DashboardNavContent, NavbarUserMenu } from "@/components/ui/dashboard-navbar";
import { useAuth } from '@/context/AuthContext';
import { fetchTeams, Team } from '@/services/team';
import dayjs from 'dayjs';

export default function TeamsPage() {
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
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMM D, YYYY');
  };

  // Fetch teams data from API
  const getTeams = async (page = 1, search = '') => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching teams - page: ${page}, search: ${search}`);
      const response = await fetchTeams({
        pageNumber: page,
        search: search,
      });
      
      console.log('Response from API:', response);
      
      if (response.status && response.code === 200) {
        setTeams(response.data.team);
        setPagination({
          ...pagination,
          current: page,
          total: response.data.totalCount,
        });
      } else {
        setError(response.message || 'Failed to fetch teams');
        toast.error(response.message || 'Failed to fetch teams');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setLoading(true);
    getTeams(page, searchQuery);
  };

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Reset to page 1 when searching
    getTeams(1, value);
  };

  // Handle refresh button click
  const handleRefresh = () => {
    getTeams(pagination.current, searchQuery);
    toast.success('Teams list refreshed');
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value: number) => {
    setPagination({
      ...pagination,
      pageSize: value,
      current: 1 // Reset to first page when changing items per page
    });
    getTeams(1, searchQuery);
  };

  // Initial data fetch when component mounts or auth state changes
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      getTeams();
    } else if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated]);

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
                Team Management
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
              Team Management
            </h1>
          </div>

          <div className="bg-white/20 dark:bg-neutral-800/20 backdrop-blur-md rounded-xl shadow-lg border border-white/10 dark:border-neutral-700/30 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div className="flex items-center mb-4 md:mb-0">
                <IconUsersGroup size={24} className="text-blue-500 mr-2" />
                <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                  All Teams
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
                      placeholder="Search teams..."
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
                      { value: 5, label: '5' },
                      { value: 10, label: '10' },
                      { value: 20, label: '20' },
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
                    <h3 className="font-medium">Failed to load teams</h3>
                    <p className="mt-1">{error}</p>
                    <button 
                      onClick={() => getTeams()}
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
                <p className="ml-4 text-neutral-600 dark:text-neutral-300">Loading teams...</p>
              </div>
            ) : teams.length > 0 ? (
              <div className="space-y-4">
                {teams.map((team) => (
                  <div 
                    key={team.id}
                    className="bg-white dark:bg-neutral-800 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 
                      overflow-hidden transition-all duration-300"
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                              <IconUsersGroup size={20} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">{team.name}</h3>
                              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                                Created on {formatDate(team.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0 flex items-center">
                          <div className="flex items-center mr-6">
                            <IconUser size={16} className="text-neutral-500 dark:text-neutral-400 mr-1" />
                            <span className="text-neutral-700 dark:text-neutral-300">{team.teamSize} members</span>
                          </div>
                          
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                              toast.success(`Viewing details for team: ${team.name}`);
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-8 text-center">
                <IconUsersGroup size={48} className="text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">No teams found</h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                  Try changing your search criteria or check back later.
                </p>
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination.total > 0 && (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-8 gap-4">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    Showing <span className="font-medium">{Math.min((pagination.current - 1) * pagination.pageSize + 1, pagination.total)}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(pagination.current * pagination.pageSize, pagination.total)}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span> teams
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Show</span>
                    <Select
                      value={pagination.pageSize}
                      onChange={handleItemsPerPageChange}
                      options={[
                        { value: 5, label: '5' },
                        { value: 10, label: '10' },
                        { value: 20, label: '20' },
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
                    onClick={() => handlePageChange(Math.max(1, pagination.current - 1))}
                    disabled={pagination.current === 1}
                    className={`p-2 rounded-lg border ${
                      pagination.current === 1
                        ? "border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                        : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                    }`}
                  >
                    <IconChevronLeft size={18} />
                  </button>
                  
                  {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.pageSize)) }, (_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === pagination.current;
                    
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
                    onClick={() => handlePageChange(Math.min(Math.ceil(pagination.total / pagination.pageSize), pagination.current + 1))}
                    disabled={pagination.current === Math.ceil(pagination.total / pagination.pageSize)}
                    className={`p-2 rounded-lg border ${
                      pagination.current === Math.ceil(pagination.total / pagination.pageSize)
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