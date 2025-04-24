"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
  IconUsers,
  IconFileText,
  IconNotes,
  IconList,
  IconSubtask,
  IconDatabaseExport,
  IconFileSpreadsheet,
  IconTable,
  IconEye,
  IconCalendarEvent
} from "@tabler/icons-react";
import { exportAllData, ExportResponse } from '@/services/api';
import { isAuthenticated, checkAuthentication } from '@/utils/auth';
import { 
  Card, 
  Select, 
  Button, 
  DatePicker, 
  message, 
  Spin, 
  Table, 
  Alert,
  Space,
  Tooltip
} from 'antd';
import dayjs from 'dayjs';

// Data type interface
interface DataType {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  filters?: {
    id: string;
    name: string;
    placeholder: string;
    type: "text" | "select" | "date" | "checkbox";
    options?: Array<{value: string, label: string}>;
  }[];
}

export default function ExportAllDataPage() {
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
  
  // Data types
  const dataTypes: DataType[] = [
    {
      id: "leads",
      name: "Leads",
      icon: <IconUsers size={20} className="text-blue-500" />,
      description: "Export your leads data including contact information and statuses",
      filters: [
        {
          id: "status",
          name: "Lead Status",
          placeholder: "Filter by status",
          type: "text"
        }
      ]
    },
    {
      id: "tasks",
      name: "Tasks",
      icon: <IconList size={20} className="text-green-500" />,
      description: "Export tasks data including deadlines and assignments",
      filters: [
        {
          id: "status",
          name: "Task Status",
          placeholder: "Filter by status",
          type: "select",
          options: [
            { value: "pending", label: "Pending" },
            { value: "in_progress", label: "In Progress" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" }
          ]
        },
        {
          id: "assignee",
          name: "Assignee",
          placeholder: "Filter by assignee",
          type: "text"
        }
      ]
    },
    {
      id: "proposals",
      name: "Proposals",
      icon: <IconFileText size={20} className="text-purple-500" />,
      description: "Export proposals data including client details and values",
      filters: [
        {
          id: "status",
          name: "Proposal Status",
          placeholder: "Filter by status",
          type: "select",
          options: [
            { value: "draft", label: "Draft" },
            { value: "sent", label: "Sent" },
            { value: "accepted", label: "Accepted" },
            { value: "rejected", label: "Rejected" }
          ]
        }
      ]
    },
    {
      id: "scripts",
      name: "Scripts",
      icon: <IconNotes size={20} className="text-amber-500" />,
      description: "Export sales scripts data including all versions and usage metrics",
      filters: []
    },
    {
      id: "meetings",
      name: "Meetings",
      icon: <IconCalendar size={20} className="text-red-500" />,
      description: "Export meetings data including attendees and notes",
      filters: []
    }
  ];
  
  // State for selected data type and filters
  const [selectedDataType, setSelectedDataType] = useState<string>(dataTypes[0].id);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  
  // Date range state with improved initial values (current month)
  const [startDate, setStartDate] = useState<dayjs.Dayjs>(dayjs().startOf('month'));
  const [endDate, setEndDate] = useState<dayjs.Dayjs>(dayjs().endOf('month'));
  const [dateError, setDateError] = useState<string | null>(null);
  
  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Show data state
  const [exportedData, setExportedData] = useState<any[]>([]);
  const [showDataTable, setShowDataTable] = useState(false);
  
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

  // Function to validate date range
  const validateDateRange = (): boolean => {
    // Clear previous error
    setDateError(null);
    
    // Check if dates are null
    if (!startDate || !endDate) {
      setDateError('Please select both start and end dates');
      return false;
    }
    
    // Check if start date is before end date
    if (startDate.isAfter(endDate)) {
      setDateError('Start date must be before end date');
      return false;
    }
    
    // Check if the date range is not more than 1 year
    const oneYearFromStart = startDate.clone().add(1, 'year');
    
    if (endDate.isAfter(oneYearFromStart)) {
      setDateError('Date range cannot exceed 1 year');
      return false;
    }
    
    return true;
  };

  // Function to export data
  const handleExport = async () => {
    // Validate date range
    if (!validateDateRange()) {
      return;
    }

    setIsExporting(true);
    setError(null);
    setExportUrl(null);
    setExportedData([]);
    setShowDataTable(false);

    try {
      const response = await exportAllData(
        selectedDataType,
        startDate.format('YYYY-MM-DD'),
        endDate.format('YYYY-MM-DD'),
        filterValues
      );
      
      if (response.status && response.code === 200 && response.data) {
        setExportUrl(response.data.url || null);
        
        // Save exported data if available
        if (response.data[selectedDataType] && Array.isArray(response.data[selectedDataType])) {
          setExportedData(response.data[selectedDataType]);
        } else if (response.data.lead && Array.isArray(response.data.lead)) {
          setExportedData(response.data.lead);
        }
        
        showToast(`${getSelectedDataType()?.name} data exported successfully`, 'success');
      } else {
        setError(response.message || `Failed to export ${getSelectedDataType()?.name} data`);
        showToast(response.message || `Failed to export ${getSelectedDataType()?.name} data`, 'error');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Update filter values
  const handleFilterChange = (filterId: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  // Get the selected data type object
  const getSelectedDataType = (): DataType | undefined => {
    return dataTypes.find(dt => dt.id === selectedDataType);
  };

  // Toggle data table visibility
  const toggleDataTable = () => {
    setShowDataTable(!showDataTable);
  };

  // Handle date changes with validation
  const handleStartDateChange = (date: dayjs.Dayjs | null) => {
    if (!date) return;
    setStartDate(date);
    setDateError(null);
    
    // Auto-validate when both dates are set
    if (date && endDate) {
      // If start date is after end date, update end date
      if (date.isAfter(endDate)) {
        // Set end date to start date + 30 days, but not exceeding a year
        const newEndDate = date.clone().add(30, 'days');
        const oneYear = date.clone().add(1, 'year');
        setEndDate(newEndDate.isAfter(oneYear) ? oneYear : newEndDate);
      }
      
      // Revalidate the date range
      setTimeout(() => validateDateRange(), 0);
    }
  };

  const handleEndDateChange = (date: dayjs.Dayjs | null) => {
    if (!date) return;
    setEndDate(date);
    setDateError(null);
    
    // Auto-validate when both dates are set
    if (startDate && date) {
      setTimeout(() => validateDateRange(), 0);
    }
  };

  // Reset filters when changing data type
  useEffect(() => {
    setFilterValues({});
  }, [selectedDataType]);

  // Custom date disabling functions for the date pickers
  const disabledStartDate = (current: dayjs.Dayjs) => {
    // Cannot select days after the end date
    return endDate ? current.isAfter(endDate) : false;
  };

  const disabledEndDate = (current: dayjs.Dayjs) => {
    // Cannot select days before the start date
    return startDate ? current.isBefore(startDate) : false;
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-xl text-neutral-600 dark:text-neutral-300">Loading...</p>
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
                Export All Data
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
                router.push('/settings/export-data');
              }}
              className="p-2 rounded-full bg-white/20 dark:bg-neutral-800/40 backdrop-blur-sm 
              border border-white/10 dark:border-neutral-700/30 mr-4 hover:bg-white/30 dark:hover:bg-neutral-700/50 transition-all duration-200"
            >
              <IconChevronLeft className="text-neutral-800 dark:text-neutral-200" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              Export All Data
            </h1>
          </div>

          <div className="bg-white/20 dark:bg-neutral-800/20 backdrop-blur-md rounded-xl shadow-lg 
            border border-white/10 dark:border-neutral-700/30 p-6 md:p-8">
            
            <div className="flex items-center mb-8">
              <IconDatabaseExport size={24} className="text-teal-500 mr-2" />
              <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
                Export Company Data
              </h2>
            </div>

            <div className="space-y-6">
              {/* Data Type Selection */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5">
                <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4">
                  Select Data Type
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dataTypes.map((dataType) => (
                    <div
                      key={dataType.id}
                      onClick={() => setSelectedDataType(dataType.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedDataType === dataType.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`mt-0.5 ${selectedDataType === dataType.id ? 'text-blue-500' : ''}`}>
                          {dataType.icon}
                        </div>
                        <div>
                          <h4 className={`font-medium ${
                            selectedDataType === dataType.id 
                              ? 'text-blue-700 dark:text-blue-300' 
                              : 'text-neutral-800 dark:text-white'
                          }`}>
                            {dataType.name}
                          </h4>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            {dataType.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range Selection - Improved UI with DatePicker */}
              <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5">
                <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4 flex items-center">
                  <IconCalendarEvent size={20} className="mr-2 text-blue-500" />
                  Select Date Range
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Start Date
                      <Tooltip title="Select the beginning date for data export">
                        <IconAlertCircle size={14} className="ml-1 inline-block text-neutral-400" />
                      </Tooltip>
                    </label>
                    <DatePicker
                      className="w-full py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700
                        bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500
                        text-neutral-800 dark:text-neutral-200"
                      value={startDate}
                      onChange={handleStartDateChange}
                      disabledDate={disabledStartDate}
                      format="YYYY-MM-DD"
                      placeholder="Select start date"
                      allowClear={false}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      End Date
                      <Tooltip title="Select the end date for data export">
                        <IconAlertCircle size={14} className="ml-1 inline-block text-neutral-400" />
                      </Tooltip>
                    </label>
                    <DatePicker
                      className="w-full py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700
                        bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500
                        text-neutral-800 dark:text-neutral-200"
                      value={endDate}
                      onChange={handleEndDateChange}
                      disabledDate={disabledEndDate}
                      format="YYYY-MM-DD"
                      placeholder="Select end date"
                      allowClear={false}
                    />
                  </div>
                </div>
                
                {dateError && (
                  <Alert
                    message="Date Error"
                    description={dateError}
                    type="error"
                    showIcon
                    className="mt-3"
                    closable
                  />
                )}
                
                <div className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                  <p className="flex items-center">
                    <IconAlertCircle size={14} className="mr-1" />
                    Date range cannot exceed 1 year. Current selection: {startDate.format('MMM D, YYYY')} - {endDate.format('MMM D, YYYY')}
                    {" "}({endDate.diff(startDate, 'days')} days)
                  </p>
                </div>
              </div>

              {/* Additional Filters */}
              {getSelectedDataType()?.filters && getSelectedDataType()?.filters?.length > 0 && (
                <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-5">
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4 flex items-center">
                    <IconFilter size={20} className="mr-2 text-indigo-500" />
                    Additional Filters
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getSelectedDataType()?.filters?.map(filter => (
                      <div key={filter.id}>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          {filter.name}
                        </label>
                        
                        {filter.type === 'select' ? (
                          <Select
                            style={{ width: '100%' }}
                            value={filterValues[filter.id] || undefined}
                            onChange={(value) => handleFilterChange(filter.id, value)}
                            placeholder={`Select ${filter.name.toLowerCase()}`}
                            allowClear
                            options={[
                              { value: '', label: `All ${filter.name}s` },
                              ...(filter.options || [])
                            ]}
                          />
                        ) : (
                          <input
                            type={filter.type}
                            placeholder={filter.placeholder}
                            value={filterValues[filter.id] || ''}
                            onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                            className="w-full py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700
                              bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500
                              text-neutral-800 dark:text-neutral-200"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Export button and result */}
              <div className="mt-8 flex flex-col items-center">
                <Button
                  type="primary"
                  size="large"
                  onClick={handleExport}
                  loading={isExporting}
                  icon={<IconDownload size={16} className="mr-2" />}
                  className="px-6 py-6 h-auto rounded-xl text-white font-medium w-full md:w-auto"
                >
                  Export {getSelectedDataType()?.name} Data
                </Button>
                
                {exportUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 w-full"
                  >
                    <Alert
                      message="Export Successful"
                      description={
                        <Space direction="vertical" className="mt-2">
                          <p>Your data export is ready! {exportedData.length} records have been exported.</p>
                          <Space>
                            <Button 
                              type="primary"
                              href={exportUrl} 
                              target="_blank" 
                              icon={<IconDownload size={16} className="mr-1" />}
                            >
                              Download File
                            </Button>
                            
                            {exportedData.length > 0 && (
                              <Button 
                                type="default"
                                onClick={toggleDataTable}
                                icon={showDataTable ? 
                                  <IconEye size={16} className="mr-1" /> : 
                                  <IconTable size={16} className="mr-1" />
                                }
                              >
                                {showDataTable ? "Hide Data Preview" : "View Data Preview"}
                              </Button>
                            )}
                          </Space>
                        </Space>
                      }
                      type="success"
                      showIcon
                    />
                  </motion.div>
                )}
                
                {error && (
                  <Alert
                    message="Export Error"
                    description={error}
                    type="error"
                    showIcon
                    className="mt-4 w-full"
                  />
                )}
              </div>
            </div>
            
            {/* Data Preview Table */}
            {showDataTable && exportedData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden"
              >
                <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80">
                  <h3 className="text-lg font-medium text-neutral-800 dark:text-white flex items-center">
                    <IconTable size={20} className="mr-2 text-blue-500" />
                    {getSelectedDataType()?.name} Data Preview ({exportedData.length} records)
                  </h3>
                </div>
                
                <Table 
                  dataSource={exportedData.slice(0, 5).map((item, i) => ({...item, key: i}))}
                  columns={Object.keys(exportedData[0]).slice(0, 6).map(key => ({
                    title: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                    dataIndex: key,
                    key: key,
                    render: (text) => {
                      // Format dates if the value looks like a date
                      if (typeof text === 'string' && text.match(/^\d{4}-\d{2}-\d{2}/)) {
                        return dayjs(text).format('MMM D, YYYY');
                      }
                      return text !== null ? String(text) : '-';
                    }
                  }))}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                  footer={() => exportedData.length > 5 ? 
                    <div className="text-neutral-600 dark:text-neutral-400 text-sm text-center">
                      Displaying 5 of {exportedData.length} records. Download the file to view all data.
                    </div> : null
                  }
                  className="custom-table"
                />
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 