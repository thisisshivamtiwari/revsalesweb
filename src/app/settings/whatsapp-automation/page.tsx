"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getWhatsAppRules, WhatsAppRule } from '@/services/whatsapp';
import { getUserData } from '@/services/api';
import Link from 'next/link';
import { IconArrowLeft, IconArrowRight, IconEdit, IconEye, IconMessage, IconMessageCircle, IconSearch, IconBrandWhatsapp } from '@tabler/icons-react';
import { debounce } from 'lodash';
import PageHeader from '@/components/PageHeader';

const WhatsAppAutomationPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rules, setRules] = useState<WhatsAppRule[]>([]);
  const [totalRules, setTotalRules] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  const itemsPerPage = 5;
  const maxPagesToShow = 5;

  // Check authentication
  useEffect(() => {
    const userData = getUserData();
    if (!userData) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      fetchWhatsAppRules(currentPage, searchQuery);
    }
  }, [currentPage]);

  // Fetch rules from API with debounced search
  const fetchWhatsAppRules = useCallback(async (page: number, search: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getWhatsAppRules(itemsPerPage, page, search);
      if (response.status && response.data) {
        setRules(response.data.rules);
        setTotalRules(response.data.total);
      } else {
        setError(response.message);
        setRules([]);
        setTotalRules(0);
      }
    } catch (err) {
      setError('Failed to fetch WhatsApp automation rules');
      setRules([]);
      setTotalRules(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle search with debounce
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setCurrentPage(1);
      fetchWhatsAppRules(1, value);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Toggle rule details expansion
  const toggleRuleDetails = (ruleId: string) => {
    if (expandedRule === ruleId) {
      setExpandedRule(null);
    } else {
      setExpandedRule(ruleId);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalRules / itemsPerPage);
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxPagesToShow) {
      // If total pages is less than max pages to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3);
      
      // Adjust start page if end page is too close to total pages
      if (endPage === totalPages - 1) {
        startPage = Math.max(2, endPage - (maxPagesToShow - 3));
      }
      
      // Add ellipsis if needed after first page
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed before last page
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="WhatsApp Automation" 
        description="Manage your WhatsApp automation rules"
        icon={<IconBrandWhatsapp size={24} stroke={1.5} className="text-green-500" />}
      />

      {/* Search and New Rule Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IconSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <input 
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
            placeholder="Search automation rules..."
          />
        </div>
        <Link 
          href="/settings/whatsapp-automation/new"
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <IconMessageCircle size={18} />
          <span>Create New Rule</span>
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {/* Rules List */}
          {rules.length === 0 ? (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
              <IconMessageCircle size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No automation rules found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery 
                  ? `No rules match your search: "${searchQuery}"`
                  : "You haven't created any WhatsApp automation rules yet."}
              </p>
              <Link
                href="/settings/whatsapp-automation/new"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors inline-flex items-center gap-2"
              >
                <IconMessageCircle size={18} />
                <span>Create Your First Rule</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Rules Cards */}
              <div className="space-y-4">
                {rules.map((rule) => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    <div 
                      className="p-4 cursor-pointer flex flex-col md:flex-row md:items-center justify-between"
                      onClick={() => toggleRuleDetails(rule.id)}
                    >
                      <div className="flex-1 mb-3 md:mb-0">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${rule.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {rule.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {rule.description.length > 100 
                            ? `${rule.description.substring(0, 100)}...` 
                            : rule.description}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {rule.leadStatus}
                        </span>
                        <div className="flex gap-2">
                          <button 
                            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/settings/whatsapp-automation/${rule.id}/edit`);
                            }}
                            aria-label="Edit rule"
                          >
                            <IconEdit size={18} />
                          </button>
                          <button 
                            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/settings/whatsapp-automation/${rule.id}/messages`);
                            }}
                            aria-label="View messages"
                          >
                            <IconMessage size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded details */}
                    {expandedRule === rule.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-200 dark:border-gray-700 p-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Trigger Type:</span> {rule.triggerType === 'status_change' ? 'Status Change' : rule.triggerType}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              <span className="font-medium">Trigger Value:</span> {rule.triggerValue}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              <span className="font-medium">Created By:</span> {rule.createdBy}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              <span className="font-medium">Created On:</span> {formatDate(rule.createdAt)}
                            </p>
                            {rule.updatedAt && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                <span className="font-medium">Last Updated:</span> {formatDate(rule.updatedAt)}
                              </p>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Message Template:</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                              {rule.messageTemplate || "No message template defined"}
                            </p>
                            {rule.imageUrl && (
                              <div className="mt-3">
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Template Image:</p>
                                <img 
                                  src={rule.imageUrl} 
                                  alt="WhatsApp template" 
                                  className="max-h-32 rounded border border-gray-200 dark:border-gray-600" 
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Link
                            href={`/settings/whatsapp-automation/${rule.id}`}
                            className="inline-flex items-center px-3 py-1.5 rounded text-sm font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          >
                            <IconEye size={16} className="mr-1" />
                            View Details
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav>
                    <ul className="inline-flex -space-x-px text-sm">
                      <li>
                        <button
                          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                          disabled={currentPage === 1}
                          className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <IconArrowLeft size={14} />
                        </button>
                      </li>
                      
                      {getPageNumbers().map((page, index) => (
                        <li key={index}>
                          {typeof page === 'number' ? (
                            <button
                              onClick={() => setCurrentPage(page)}
                              className={`flex items-center justify-center px-3 h-8 leading-tight ${
                                currentPage === page
                                  ? 'text-green-600 border-green-300 bg-green-50 hover:bg-green-100 hover:text-green-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                              }`}
                            >
                              {page}
                            </button>
                          ) : (
                            <span className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                              {page}
                            </span>
                          )}
                        </li>
                      ))}
                      
                      <li>
                        <button
                          onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                          disabled={currentPage === totalPages}
                          className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <IconArrowRight size={14} />
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default WhatsAppAutomationPage; 