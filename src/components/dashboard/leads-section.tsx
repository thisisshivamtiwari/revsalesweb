import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { IconUsers, IconSearch, IconChevronLeft, IconChevronRight, IconUser, IconPhone, IconCalendar, IconMapPin } from '@tabler/icons-react';
import { toast } from 'sonner';
import { getLeads, type Lead } from '@/services/leads';

export const LeadsSection = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 10
  });
  const router = useRouter();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLeads(
        startDate || format(new Date(), 'yyyy-MM-dd'),
        endDate || format(new Date(), 'yyyy-MM-dd'),
        '',
        pagination.pageSize,
        pagination.current
      );
      setLeads(response.data.leads);
      setPagination(prev => ({
        ...prev,
        total: response.data.total
      }));
    } catch (err) {
      setError('Failed to fetch leads');
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [pagination.current, startDate, endDate]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    setPagination(prev => ({
      ...prev,
      current: direction === 'prev' ? Math.max(1, prev.current - 1) : Math.min(Math.ceil(prev.total / prev.pageSize), prev.current + 1)
    }));
  };

  const handleLeadClick = (lead: Lead) => {
    router.push(`/dashboard/leads/${lead.leadId}?name=${encodeURIComponent(lead.name || '')}`);
  };

  const filteredLeads = leads.filter((lead) =>
    Object.values(lead).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-neutral-700/30 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
            <IconUsers className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            Leads
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full md:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 backdrop-blur-sm transition-all duration-200"
            />
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          </div>
          
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange(e, 'start')}
              className="px-4 py-2.5 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 backdrop-blur-sm transition-all duration-200"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleDateChange(e, 'end')}
              className="px-4 py-2.5 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 backdrop-blur-sm transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
            <IconUsers className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">{error}</h3>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
            <IconUsers className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">No leads found</h3>
          <p className="text-neutral-500 dark:text-neutral-500 mt-1">Try adjusting your search or date filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => (
              <div
                key={lead.leadId}
                className="group relative bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => handleLeadClick(lead)}
                tabIndex={0}
                aria-label={`View details for ${lead.name}`}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLeadClick(lead); }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 line-clamp-2">
                      {lead.name}
                    </h3>
                    {lead.statuName && (
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium border"
                        style={{
                          backgroundColor: `${lead.statusColor}20`,
                          color: lead.statusColor || '#6b7280',
                          borderColor: `${lead.statusColor}40`
                        }}
                      >
                        {lead.statuName}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                      <IconUser className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">{lead.leadOwnerName}</span>
                    </div>
                    
                    <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                      <IconPhone className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">{lead.phoneNumber}</span>
                    </div>
                    
                    <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                      <IconMapPin className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">{lead.city}</span>
                    </div>

                    <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                      <IconCalendar className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">
                        Created: {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-neutral-200/50 dark:border-neutral-700/50">
                      <div className="flex items-center text-neutral-600 dark:text-neutral-400">
                        <span className="text-sm font-medium">Source:</span>
                        <span className="text-sm ml-2">{lead.leadSource || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8">
            <p className="text-neutral-600 dark:text-neutral-400">
              Showing {filteredLeads.length} of {pagination.total} leads
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange('prev')}
                disabled={pagination.current === 1}
                className="p-2 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 transition-all duration-200"
              >
                <IconChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-neutral-600 dark:text-neutral-400">
                Page {pagination.current} of {Math.ceil(pagination.total / pagination.pageSize)}
              </span>
              <button
                onClick={() => handlePageChange('next')}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                className="p-2 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white/50 dark:bg-neutral-800/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100/50 dark:hover:bg-neutral-700/50 transition-all duration-200"
              >
                <IconChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 