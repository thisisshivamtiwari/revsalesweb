"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import SidebarDemo from "@/components/ui/sidebar-demo";
import { DashboardNavbar, DashboardNavContent, NavbarUserMenu } from "@/components/ui/dashboard-navbar";
import Toast, { ToastType } from "@/components/ui/toast";
import { 
  IconChevronLeft, 
  IconUpload, 
  IconCalendar,
  IconSearch,
  IconFilter,
  IconCheck,
  IconDownload,
  IconAlertCircle,
  IconX,
  IconDatabaseExport,
  IconChevronRight,
  IconFileSpreadsheet,
  IconExternalLink,
  IconTable,
  IconEye,
  IconChevronDown,
  IconChevronUp,
  IconChevronsLeft,
  IconChevronsRight
} from "@tabler/icons-react";
import { getAuthToken } from '@/services/api';

// Base URL
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://rworldbelite.retvenslabs.com';

// Interface for a lead status
interface LeadStatus {
  id: string;
  name: string;
  color: string;
  isAssginedToNewLead: boolean;
  isFinalStatus: boolean;
  isProposal: boolean;
}

// Interface for Campaign
interface Campaign {
  id: number;
  name: string;
}

// Interface for Team Member
interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: number;
  profileImg: string;
  departmentId: number;
  designationId: number;
  designationName: string;
}

// Interface for API responses
interface ApiResponse {
  status: boolean;
  code: number;
  message: string;
  data?: {
    url?: string;
    lead?: LeadData[];
    status?: LeadStatus[];
    campaign?: Campaign[];
    members?: TeamMember[];
    total?: number;
    limit?: number;
    offset?: number;
  };
}

// Interface for Lead Data
interface LeadData {
  campaignId: string;
  formName: string;
  name: string;
  email: string;
  city: string;
  phoneNumber: string;
  leadOrigin: string;
  leadSource: string;
  leadStatus: string;
  leadOwnerName: string;
  hotelName: string;
  campaignName: string;
  noOfRooms: string | null;
  lastMeetingStatus: string | null;
  leadId: string;
  formId: string;
  lastCall: string | null;
  lastMeeting: string | null;
  createdTime: string;
  updatedAt: string;
}

export default function ExportDataPage() {
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
  
  // State for lead statuses
  const [leadStatuses, setLeadStatuses] = useState<LeadStatus[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  
  // State for campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([]);
  const [isCampaignDropdownOpen, setIsCampaignDropdownOpen] = useState(false);
  const [campaignSearchQuery, setCampaignSearchQuery] = useState("");
  
  // State for lead owners
  const [leadOwners, setLeadOwners] = useState<TeamMember[]>([]);
  const [selectedLeadOwners, setSelectedLeadOwners] = useState<string[]>([]);
  const [isLeadOwnerDropdownOpen, setIsLeadOwnerDropdownOpen] = useState(false);
  const [leadOwnerSearchQuery, setLeadOwnerSearchQuery] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Search state for statuses
  const [searchQuery, setSearchQuery] = useState("");
  
  // Date range state
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(
    (() => {
      const date = new Date();
      date.setDate(date.getDate() + 30); // Default to 30 days from now
      return date.toISOString().split('T')[0];
    })()
  );
  const [dateError, setDateError] = useState<string | null>(null);
  
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

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  
  // State for lead data
  const [leadData, setLeadData] = useState<LeadData[]>([]);
  const [showDataTable, setShowDataTable] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  // Fetch lead statuses, campaigns, and lead owners
  useEffect(() => {
    if (isAuthenticated) {
      fetchLeadStatuses();
      fetchCampaigns();
      fetchLeadOwners();
    }
  }, [isAuthenticated]);

  // Function to fetch lead statuses
  const fetchLeadStatuses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('Authentication token is missing. Please log in again.');
        showToast('Authentication token is missing. Please log in again.', 'error');
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${BASE_URL}/api/sales/lead/getLeadStatus?limit=100&pageNumber=1&search=`,
        {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          },
        }
      );

      const data: ApiResponse = await response.json();
      
      if (data.status && data.code === 200 && data.data) {
        if (data.data.status) {
          setLeadStatuses(data.data.status);
        } else {
          setError('No status data found');
          showToast('No status data found', 'error');
        }
      } else {
        setError(data.message || 'Failed to fetch lead statuses');
        showToast(data.message || 'Failed to fetch lead statuses', 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch campaigns
  const fetchCampaigns = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('Authentication token is missing. Please log in again.');
        showToast('Authentication token is missing. Please log in again.', 'error');
        return;
      }

      const response = await fetch(
        `${BASE_URL}/api/sales/lead/getCampaign?limit=100&pageNumber=1&search=`,
        {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          },
        }
      );

      const data: ApiResponse = await response.json();
      
      if (data.status && data.code === 200 && data.data && data.data.campaign) {
        setCampaigns(data.data.campaign);
      } else {
        console.error('Failed to fetch campaigns:', data.message);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  // Function to fetch lead owners
  const fetchLeadOwners = async () => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('Authentication token is missing. Please log in again.');
        showToast('Authentication token is missing. Please log in again.', 'error');
        return;
      }

      const response = await fetch(
        `${BASE_URL}/api/sales/team/getMembers?pageNumber=1&limit=100&search=&id=`,
        {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          },
        }
      );

      const data: ApiResponse = await response.json();
      
      if (data.status && data.code === 200 && data.data && data.data.members) {
        setLeadOwners(data.data.members);
      } else {
        console.error('Failed to fetch lead owners:', data.message);
      }
    } catch (error) {
      console.error('Error fetching lead owners:', error);
    }
  };

  // Function to export leads
  const exportLeads = async () => {
    // Validate date range
    if (!validateDateRange()) {
      return;
    }

    // Validate at least one status is selected
    if (selectedStatuses.length === 0) {
      showToast('Please select at least one lead status', 'error');
      return;
    }

    setIsExporting(true);
    setError(null);
    setExportUrl(null);
    setLeadData([]);
    setShowDataTable(false);

    try {
      const token = getAuthToken();
      
      if (!token) {
        setError('Authentication token is missing. Please log in again.');
        showToast('Authentication token is missing. Please log in again.', 'error');
        setIsExporting(false);
        return;
      }

      // Ensure IDs are joined with commas and no spaces
      const statusParam = selectedStatuses.join(',');
      const campaignParam = selectedCampaigns.join(',');
      const leadOwnerParam = selectedLeadOwners.join(',');
      
      let url = `${BASE_URL}/api/sales/lead/exportLead?startDate=${startDate}&endDate=${endDate}&status=${statusParam}`;
      
      // Add campaign parameter if campaigns are selected
      if (selectedCampaigns.length > 0) {
        url += `&campaign=${campaignParam}`;
      }
      
      // Add lead owner parameter if lead owners are selected
      if (selectedLeadOwners.length > 0) {
        url += `&owner=${leadOwnerParam}`;
      }
      
      const response = await fetch(
        url,
        {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          },
        }
      );

      const data: ApiResponse = await response.json();
      
      if (data.status && data.code === 200 && data.data) {
        setExportUrl(data.data.url || null);
        if (data.data.lead && data.data.lead.length > 0) {
          setLeadData(data.data.lead);
        }
        showToast('Leads exported successfully', 'success');
      } else {
        setError(data.message || 'Failed to export leads');
        showToast(data.message || 'Failed to export leads', 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Function to validate date range
  const validateDateRange = () => {
    // Clear previous error
    setDateError(null);
    
    // Convert to Date objects for comparison
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setDateError('Please enter valid dates');
      return false;
    }
    
    // Check if start date is before end date
    if (start > end) {
      setDateError('Start date must be before end date');
      // Reset end date to start date + 7 days
      const newEndDate = new Date(start);
      newEndDate.setDate(newEndDate.getDate() + 7);
      setEndDate(newEndDate.toISOString().split('T')[0]);
      return false;
    }
    
    // Check if the date range is not more than 1 year
    const oneYearFromStart = new Date(start);
    oneYearFromStart.setFullYear(oneYearFromStart.getFullYear() + 1);
    
    if (end > oneYearFromStart) {
      setDateError('Date range cannot exceed 1 year');
      // Reset end date to one year from start
      setEndDate(oneYearFromStart.toISOString().split('T')[0]);
      return false;
    }
    
    return true;
  };

  // Toggle status selection
  const toggleStatusSelection = (statusId: string) => {
    setSelectedStatuses(prev => {
      if (prev.includes(statusId)) {
        return prev.filter(id => id !== statusId);
      } else {
        return [...prev, statusId];
      }
    });
  };

  // Toggle campaign selection
  const toggleCampaignSelection = (campaignId: number) => {
    setSelectedCampaigns(prev => {
      if (prev.includes(campaignId)) {
        return prev.filter(id => id !== campaignId);
      } else {
        return [...prev, campaignId];
      }
    });
  };

  // Toggle lead owner selection
  const toggleLeadOwnerSelection = (ownerId: string) => {
    setSelectedLeadOwners(prev => {
      if (prev.includes(ownerId)) {
        return prev.filter(id => id !== ownerId);
      } else {
        return [...prev, ownerId];
      }
    });
  };

  // Filter statuses by search query
  const filteredStatuses = leadStatuses.filter(status => 
    status.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter campaigns by search query
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign && campaign.name && campaign.name.toLowerCase().includes(campaignSearchQuery.toLowerCase())
  );

  // Filter lead owners by search query
  const filteredLeadOwners = leadOwners.filter(owner => 
    owner && owner.fullName && owner.fullName.toLowerCase().includes(leadOwnerSearchQuery.toLowerCase())
  );

  // Sort function for table data
  const sortData = (data: LeadData[], field: string, direction: 'asc' | 'desc') => {
    return [...data].sort((a, b) => {
      const aValue = a[field as keyof LeadData] || '';
      const bValue = b[field as keyof LeadData] || '';
      
      if (direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  // Handle sorting when a column header is clicked
  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortField(field);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  // Get current records for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const getCurrentRecords = () => {
    let dataToDisplay = [...leadData];
    
    if (sortField) {
      dataToDisplay = sortData(dataToDisplay, sortField, sortDirection);
    }
    
    return dataToDisplay.slice(indexOfFirstRecord, indexOfLastRecord);
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Export to CSV
  const exportToCSV = () => {
    if (leadData.length === 0) return;
    
    // Get all headers
    const headers = Object.keys(leadData[0]);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    leadData.forEach(item => {
      const row = headers.map(header => {
        let cell = item[header as keyof LeadData];
        // Handle null, undefined and commas
        cell = cell === null || cell === undefined ? '' : String(cell);
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          cell = `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      });
      csvContent += row.join(',') + '\n';
    });
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `lead_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle data table visibility
  const toggleDataTable = () => {
    setShowDataTable(!showDataTable);
  };

  // Handle start date change with validation
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    
    // Auto-validate when both dates are set
    if (newStartDate && endDate) {
      const start = new Date(newStartDate);
      const end = new Date(endDate);
      
      // If start date is after end date, update end date
      if (start > end) {
        // Set end date to start date + 7 days
        const newEndDate = new Date(start);
        newEndDate.setDate(newEndDate.getDate() + 7);
        setEndDate(newEndDate.toISOString().split('T')[0]);
      }
    }
  };

  // Handle end date change with validation
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    
    // Auto-validate when both dates are set
    if (startDate && newEndDate) {
      const start = new Date(startDate);
      const end = new Date(newEndDate);
      
      // If end date is before start date, show error
      if (end < start) {
        setDateError('End date cannot be before start date');
      } else {
        setDateError(null);
      }
    }
  };

  // Focus handling to improve date picker UX
  const handleStartDateFocus = () => {
    if (startDateRef.current) {
      startDateRef.current.showPicker();
    }
  };

  const handleEndDateFocus = () => {
    if (endDateRef.current) {
      endDateRef.current.showPicker();
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
                Export Data
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
              Export Lead Data
            </h1>
          </div>

          {/* Export All Data Link Card */}
          {/* <div 
            onClick={() => router.push('/settings/export-data/all')}
            className="bg-gradient-to-r from-blue-500/20 to-teal-500/20 dark:from-blue-900/30 dark:to-teal-900/30 
              backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-blue-700/30 p-5 md:p-6 mb-6
              hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <IconDatabaseExport size={32} className="text-teal-500 mr-3" />
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-neutral-800 dark:text-white">
                    Export All Company Data
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-300 mt-1">
                    Export leads, tasks, proposals, scripts, and more with our comprehensive data export tool
                  </p>
                </div>
              </div>
              <IconChevronRight size={24} className="text-neutral-400 dark:text-neutral-500" />
            </div>
          </div> */}

          <div className="bg-white/20 dark:bg-neutral-800/20 backdrop-blur-md rounded-xl shadow-lg 
            border border-white/10 dark:border-neutral-700/30 p-6 md:p-8">
            
            <div className="flex items-center mb-8">
              <IconUpload size={24} className="text-teal-500 mr-2" />
              <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                Export Leads
              </h2>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
                <p className="ml-4 text-neutral-600 dark:text-neutral-300">Loading lead statuses...</p>
              </div>
            )}

            {/* Error state */}
            {!isLoading && error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 
                rounded-lg p-4 text-red-700 dark:text-red-300 mb-6">
                <p>{error}</p>
                <button 
                  onClick={fetchLeadStatuses}
                  className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800/30 rounded-md hover:bg-red-200 
                  dark:hover:bg-red-700/40 transition-colors text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            )}

            {!isLoading && !error && (
              <div className="space-y-6">
                {/* Lead Status Selection */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5">
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4 flex items-center">
                    <IconFilter size={20} className="mr-2 text-indigo-500" />
                    Select Lead Status
                  </h3>
                  
                  <div className="relative">
                    <div 
                      className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 
                      flex items-center justify-between cursor-pointer"
                      onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    >
                      <div className="flex-grow">
                        {selectedStatuses.length === 0 ? (
                          <span className="text-neutral-500 dark:text-neutral-400">Select status...</span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {selectedStatuses.map(statusId => {
                              const status = leadStatuses.find(s => s.id === statusId);
                              return status ? (
                                <span 
                                  key={statusId}
                                  className="px-2 py-1 rounded-md text-xs font-medium flex items-center"
                                  style={{ backgroundColor: `${status.color}20`, color: status.color }}
                                >
                                  {status.name}
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleStatusSelection(statusId);
                                    }}
                                    className="ml-1 hover:text-neutral-700 dark:hover:text-neutral-300"
                                  >
                                    <IconX size={14} />
                                  </button>
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {isStatusDropdownOpen ? "▲" : "▼"}
                      </span>
                    </div>

                    {isStatusDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 
                        rounded-lg shadow-lg max-h-64 overflow-auto">
                        <div className="p-2 sticky top-0 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search statuses..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full py-2 pl-8 pr-4 rounded-lg border border-neutral-200 dark:border-neutral-700
                                bg-neutral-50 dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                                text-neutral-800 dark:text-neutral-200"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <IconSearch className="absolute left-2 top-2.5 text-neutral-400 dark:text-neutral-500" size={16} />
                          </div>
                        </div>
                        
                        <div className="p-1">
                          {filteredStatuses.length === 0 ? (
                            <div className="p-3 text-center text-neutral-500 dark:text-neutral-400">
                              No statuses found
                            </div>
                          ) : (
                            filteredStatuses.map(status => (
                              <div 
                                key={status.id}
                                className="flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleStatusSelection(status.id);
                                }}
                              >
                                <div 
                                  className="w-4 h-4 mr-2 border rounded flex items-center justify-center"
                                  style={{ 
                                    backgroundColor: selectedStatuses.includes(status.id) ? status.color : 'transparent',
                                    borderColor: status.color 
                                  }}
                                >
                                  {selectedStatuses.includes(status.id) && (
                                    <IconCheck size={12} className="text-white" />
                                  )}
                                </div>
                                <div 
                                  className="w-3 h-3 mr-2 rounded-full" 
                                  style={{ backgroundColor: status.color }}
                                ></div>
                                <span className="text-neutral-800 dark:text-neutral-200">{status.name}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {selectedStatuses.length} status{selectedStatuses.length !== 1 ? 'es' : ''} selected
                  </div>
                </div>

                {/* Campaign Selection */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5">
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4 flex items-center">
                    <IconFilter size={20} className="mr-2 text-orange-500" />
                    Select Campaign (Optional)
                  </h3>
                  
                  <div className="relative">
                    <div 
                      className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 
                      flex items-center justify-between cursor-pointer"
                      onClick={() => setIsCampaignDropdownOpen(!isCampaignDropdownOpen)}
                    >
                      <div className="flex-grow">
                        {selectedCampaigns.length === 0 ? (
                          <span className="text-neutral-500 dark:text-neutral-400">Select campaign...</span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {selectedCampaigns.map(campaignId => {
                              const campaign = campaigns.find(c => c.id === campaignId);
                              return campaign ? (
                                <span 
                                  key={campaignId}
                                  className="px-2 py-1 rounded-md text-xs font-medium flex items-center bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                                >
                                  {campaign.name}
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleCampaignSelection(campaignId);
                                    }}
                                    className="ml-1 hover:text-neutral-700 dark:hover:text-neutral-300"
                                  >
                                    <IconX size={14} />
                                  </button>
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {isCampaignDropdownOpen ? "▲" : "▼"}
                      </span>
                    </div>

                    {isCampaignDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 
                        rounded-lg shadow-lg max-h-64 overflow-auto">
                        <div className="p-2 sticky top-0 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search campaigns..."
                              value={campaignSearchQuery}
                              onChange={(e) => setCampaignSearchQuery(e.target.value)}
                              className="w-full py-2 pl-8 pr-4 rounded-lg border border-neutral-200 dark:border-neutral-700
                                bg-neutral-50 dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                                text-neutral-800 dark:text-neutral-200"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <IconSearch className="absolute left-2 top-2.5 text-neutral-400 dark:text-neutral-500" size={16} />
                          </div>
                        </div>
                        
                        <div className="p-1">
                          {filteredCampaigns.length === 0 ? (
                            <div className="p-3 text-center text-neutral-500 dark:text-neutral-400">
                              No campaigns found
                            </div>
                          ) : (
                            filteredCampaigns.map(campaign => (
                              <div 
                                key={campaign.id}
                                className="flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCampaignSelection(campaign.id);
                                }}
                              >
                                <div 
                                  className="w-4 h-4 mr-2 border rounded flex items-center justify-center"
                                  style={{ 
                                    backgroundColor: selectedCampaigns.includes(campaign.id) ? '#f97316' : 'transparent',
                                    borderColor: '#f97316' 
                                  }}
                                >
                                  {selectedCampaigns.includes(campaign.id) && (
                                    <IconCheck size={12} className="text-white" />
                                  )}
                                </div>
                                <span className="text-neutral-800 dark:text-neutral-200">{campaign.name}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {selectedCampaigns.length} campaign{selectedCampaigns.length !== 1 ? 's' : ''} selected
                  </div>
                </div>

                {/* Lead Owner Selection */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5">
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4 flex items-center">
                    <IconFilter size={20} className="mr-2 text-green-500" />
                    Select Lead Owner (Optional)
                  </h3>
                  
                  <div className="relative">
                    <div 
                      className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 
                      flex items-center justify-between cursor-pointer"
                      onClick={() => setIsLeadOwnerDropdownOpen(!isLeadOwnerDropdownOpen)}
                    >
                      <div className="flex-grow">
                        {selectedLeadOwners.length === 0 ? (
                          <span className="text-neutral-500 dark:text-neutral-400">Select lead owner...</span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {selectedLeadOwners.map(ownerId => {
                              const owner = leadOwners.find(o => o.id === ownerId);
                              return owner ? (
                                <span 
                                  key={ownerId}
                                  className="px-2 py-1 rounded-md text-xs font-medium flex items-center bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                >
                                  {owner.fullName}
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleLeadOwnerSelection(ownerId);
                                    }}
                                    className="ml-1 hover:text-neutral-700 dark:hover:text-neutral-300"
                                  >
                                    <IconX size={14} />
                                  </button>
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {isLeadOwnerDropdownOpen ? "▲" : "▼"}
                      </span>
                    </div>

                    {isLeadOwnerDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 
                        rounded-lg shadow-lg max-h-64 overflow-auto">
                        <div className="p-2 sticky top-0 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search lead owners..."
                              value={leadOwnerSearchQuery}
                              onChange={(e) => setLeadOwnerSearchQuery(e.target.value)}
                              className="w-full py-2 pl-8 pr-4 rounded-lg border border-neutral-200 dark:border-neutral-700
                                bg-neutral-50 dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                                text-neutral-800 dark:text-neutral-200"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <IconSearch className="absolute left-2 top-2.5 text-neutral-400 dark:text-neutral-500" size={16} />
                          </div>
                        </div>
                        
                        <div className="p-1">
                          {filteredLeadOwners.length === 0 ? (
                            <div className="p-3 text-center text-neutral-500 dark:text-neutral-400">
                              No lead owners found
                            </div>
                          ) : (
                            filteredLeadOwners.map(owner => (
                              <div 
                                key={owner.id}
                                className="flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLeadOwnerSelection(owner.id);
                                }}
                              >
                                <div 
                                  className="w-4 h-4 mr-2 border rounded flex items-center justify-center"
                                  style={{ 
                                    backgroundColor: selectedLeadOwners.includes(owner.id) ? '#22c55e' : 'transparent',
                                    borderColor: '#22c55e' 
                                  }}
                                >
                                  {selectedLeadOwners.includes(owner.id) && (
                                    <IconCheck size={12} className="text-white" />
                                  )}
                                </div>
                                <span className="text-neutral-800 dark:text-neutral-200">{owner.fullName}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {selectedLeadOwners.length} lead owner{selectedLeadOwners.length !== 1 ? 's' : ''} selected
                  </div>
                </div>

                {/* Date Range Selection - Improved UI */}
                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5">
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4 flex items-center">
                    <IconCalendar size={20} className="mr-2 text-blue-500" />
                    Select Date Range
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Start Date
                      </label>
                      <div className="relative">
                        <input
                          ref={startDateRef}
                          type="date"
                          value={startDate}
                          onChange={handleStartDateChange}
                          className="w-full py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700
                            bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500
                            text-neutral-800 dark:text-neutral-200"
                        />
                        <button 
                          onClick={handleStartDateFocus}
                          className="absolute right-2 top-2 text-neutral-400 hover:text-blue-500 dark:text-neutral-500"
                        >
                          <IconCalendar size={20} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        End Date
                      </label>
                      <div className="relative">
                        <input
                          ref={endDateRef}
                          type="date"
                          value={endDate}
                          onChange={handleEndDateChange}
                          min={startDate} // Prevent selecting a date before start date
                          className="w-full py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700
                            bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500
                            text-neutral-800 dark:text-neutral-200"
                        />
                        <button 
                          onClick={handleEndDateFocus}
                          className="absolute right-2 top-2 text-neutral-400 hover:text-blue-500 dark:text-neutral-500"
                        >
                          <IconCalendar size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {dateError && (
                    <div className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <IconAlertCircle size={14} className="mr-1" />
                      {dateError}
                    </div>
                  )}
                </div>

                {/* Export button and result */}
                <div className="mt-8 flex flex-col items-center">
                  <button
                    onClick={exportLeads}
                    disabled={isExporting}
                    className={`px-6 py-3 rounded-xl text-white font-medium flex items-center justify-center w-full md:w-auto
                      ${isExporting 
                        ? 'bg-blue-400 dark:bg-blue-600 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                      } transition-colors`}
                  >
                    {isExporting ? (
                      <>
                        <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                        Exporting...
                      </>
                    ) : (
                      <>
                        <IconDownload size={20} className="mr-2" />
                        Export Leads
                      </>
                    )}
                  </button>
                  
                  {exportUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 
                        rounded-lg text-green-700 dark:text-green-300 flex flex-col items-center w-full"
                    >
                      <div className="flex items-center mb-3">
                        <IconFileSpreadsheet size={20} className="mr-2" />
                        <p className="font-medium">Export successful! Your file is ready.</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 justify-center">
                        <a 
                          href={exportUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-green-100 dark:bg-green-800/30 rounded-md hover:bg-green-200 
                            dark:hover:bg-green-700/40 transition-colors text-sm font-medium flex items-center"
                        >
                          <IconDownload size={16} className="mr-1" />
                          Download File
                        </a>
                        
                        {leadData.length > 0 && (
                          <button 
                            onClick={toggleDataTable}
                            className="px-4 py-2 bg-blue-100 dark:bg-blue-800/30 rounded-md hover:bg-blue-200 
                              dark:hover:bg-blue-700/40 transition-colors text-sm font-medium flex items-center text-blue-700 dark:text-blue-300"
                          >
                            {showDataTable ? (
                              <>
                                <IconEye size={16} className="mr-1" />
                                Hide Data Preview
                              </>
                            ) : (
                              <>
                                <IconTable size={16} className="mr-1" />
                                View Data Preview
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {/* Data Table */}
                {showDataTable && leadData.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden"
                  >
                    <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 flex justify-between items-center">
                      <h3 className="text-lg font-medium text-neutral-800 dark:text-white flex items-center">
                        <IconTable size={20} className="mr-2 text-blue-500" />
                        Lead Data Preview ({leadData.length} records)
                      </h3>
                      <div className="flex items-center space-x-2">
                        <select 
                          value={recordsPerPage} 
                          onChange={(e) => {
                            setRecordsPerPage(Number(e.target.value));
                            setCurrentPage(1); // Reset to first page when changing records per page
                          }}
                          className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm text-neutral-700 dark:text-neutral-200"
                        >
                          <option value={5}>5 per page</option>
                          <option value={10}>10 per page</option>
                          <option value={25}>25 per page</option>
                          <option value={50}>50 per page</option>
                        </select>
                        <button 
                          onClick={exportToCSV}
                          className="flex items-center space-x-1 px-3 py-2 bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-700/40 transition-colors text-sm font-medium"
                        >
                          <IconDownload size={16} />
                          <span>Export CSV</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                        <thead className="bg-neutral-50 dark:bg-neutral-800/50">
                          <tr>
                            {['name', 'email', 'phoneNumber', 'leadStatus', 'leadOwnerName', 'leadSource', 'createdTime'].map((field) => (
                              <th 
                                key={field}
                                scope="col" 
                                className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700/50 select-none"
                                onClick={() => handleSort(field)}
                              >
                                <div className="flex items-center space-x-1">
                                  <span>
                                    {field === 'name' ? 'Name' : 
                                     field === 'email' ? 'Email' : 
                                     field === 'phoneNumber' ? 'Phone' : 
                                     field === 'leadStatus' ? 'Status' : 
                                     field === 'leadOwnerName' ? 'Owner' : 
                                     field === 'leadSource' ? 'Source' : 
                                     field === 'createdTime' ? 'Created' : field}
                                  </span>
                                  {sortField === field ? (
                                    sortDirection === 'asc' ? 
                                      <IconChevronUp size={14} className="text-blue-500" /> : 
                                      <IconChevronDown size={14} className="text-blue-500" />
                                  ) : (
                                    <IconChevronDown size={14} className="text-neutral-300 dark:text-neutral-600" />
                                  )}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                          {getCurrentRecords().map((lead, index) => (
                            <tr key={lead.leadId + index} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-800 dark:text-neutral-200">{lead.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">{lead.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">{lead.phoneNumber}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                  {lead.leadStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">{lead.leadOwnerName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">{lead.leadSource}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-400">
                                {new Date(lead.createdTime).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    {leadData.length > recordsPerPage && (
                      <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                        <div className="text-neutral-600 dark:text-neutral-400 text-sm">
                          Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, leadData.length)} of {leadData.length} entries
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => paginate(1)}
                            disabled={currentPage === 1}
                            className={`p-1 rounded ${
                              currentPage === 1 
                                ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed' 
                                : 'text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                            }`}
                          >
                            <IconChevronsLeft size={18} />
                          </button>
                          <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-1 rounded ${
                              currentPage === 1 
                                ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed' 
                                : 'text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                            }`}
                          >
                            <IconChevronLeft size={18} />
                          </button>
                          
                          {/* Page numbers */}
                          {Array.from({ length: Math.ceil(leadData.length / recordsPerPage) }).slice(
                            Math.max(0, Math.min(currentPage - 3, Math.ceil(leadData.length / recordsPerPage) - 5)),
                            Math.max(5, Math.min(currentPage + 2, Math.ceil(leadData.length / recordsPerPage)))
                          ).map((_, i) => {
                            const pageNumber = Math.max(1, Math.min(currentPage - 2, Math.ceil(leadData.length / recordsPerPage) - 4)) + i;
                            const isCurrentPage = pageNumber === currentPage;
                            
                            return (
                              <button
                                key={i}
                                onClick={() => paginate(pageNumber)}
                                className={`px-3 py-1 rounded ${
                                  isCurrentPage 
                                    ? 'bg-blue-500 text-white' 
                                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                }`}
                              >
                                {pageNumber}
                              </button>
                            );
                          })}
                          
                          <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === Math.ceil(leadData.length / recordsPerPage)}
                            className={`p-1 rounded ${
                              currentPage === Math.ceil(leadData.length / recordsPerPage)
                                ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed' 
                                : 'text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                            }`}
                          >
                            <IconChevronRight size={18} />
                          </button>
                          <button
                            onClick={() => paginate(Math.ceil(leadData.length / recordsPerPage))}
                            disabled={currentPage === Math.ceil(leadData.length / recordsPerPage)}
                            className={`p-1 rounded ${
                              currentPage === Math.ceil(leadData.length / recordsPerPage)
                                ? 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed' 
                                : 'text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                            }`}
                          >
                            <IconChevronsRight size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 
