"use client";

import { useEffect, useState } from 'react';
import { getLeadAudit, LeadAudit } from '@/services/leads';
import { IconFileReport, IconUser, IconCalendar, IconExternalLink } from '@tabler/icons-react';
import { format } from 'date-fns';

interface AuditTabProps {
  leadId: string | number;
}

const AuditTab = ({ leadId }: AuditTabProps) => {
  const [audits, setAudits] = useState<LeadAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLeadAudit(leadId);
      if (response.status && response.code === 200) {
        setAudits(response.data.audit);
      } else {
        setError(response.message || 'Failed to fetch audit reports');
      }
    } catch (err) {
      setError('Failed to fetch audit reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, [leadId]);

  const handleOpenReport = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-neutral-700/30 p-4 md:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-xl bg-purple-500/10 dark:bg-purple-500/20">
          <IconFileReport className="w-6 h-6 text-purple-500" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Audit Reports
        </h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
            <IconFileReport className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">{error}</h3>
        </div>
      ) : audits.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
            <IconFileReport className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">No audit reports found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audits.map((audit, index) => (
            <div
              key={index}
              className="group relative bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                    {audit.name}
                  </h3>
                  <button
                    onClick={() => handleOpenReport(audit.url)}
                    className="p-2 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 dark:hover:bg-purple-500/30 transition-colors duration-200"
                    aria-label="Open audit report"
                  >
                    <IconExternalLink className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <IconUser className="w-4 h-4" />
                    <span>{audit.createdByName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <IconCalendar className="w-4 h-4" />
                    <span>{format(new Date(audit.createdAt), 'PP, p')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditTab; 