"use client";

import { useEffect, useState } from 'react';
import { getLeadAudit, LeadAudit } from '@/services/leads';
import { AddAuditModal } from './add-audit-modal';
import { IconPlus, IconExternalLink } from '@tabler/icons-react';

interface AuditTabProps {
  leadId: number;
}

export const AuditTab = ({ leadId }: AuditTabProps) => {
  const [audits, setAudits] = useState<LeadAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchAudits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLeadAudit(leadId);
      setAudits(res.data.audit || []);
    } catch (err) {
      setError('Failed to load audits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadId]);

  return (
    <div className="relative min-h-[300px]">
      {/* Floating Add Audit Button */}
      <button
        className="fixed bottom-8 right-8 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setIsAddModalOpen(true)}
        aria-label="Add Audit"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setIsAddModalOpen(true); }}
      >
        <IconPlus className="w-6 h-6" />
      </button>

      {/* Add Audit Modal */}
      <AddAuditModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        leadId={leadId}
        onAuditAdded={fetchAudits}
      />

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-blue-600 font-semibold animate-pulse">Loading audits...</span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-red-500 font-semibold">{error}</span>
        </div>
      ) : audits.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-neutral-500">
          <span className="text-lg font-semibold">No audits found</span>
          <span className="text-sm">Click the + button to add a new audit.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {audits.map((audit, idx) => (
            <div
              key={idx}
              className="bg-white/60 dark:bg-neutral-800/60 border border-blue-100 dark:border-blue-900 rounded-2xl shadow-lg p-5 flex flex-col gap-2 backdrop-blur-xl transition hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-blue-700 dark:text-blue-300 text-base">{audit.name}</span>
                <a
                  href={audit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                  aria-label={`Open audit link for ${audit.name}`}
                  tabIndex={0}
                >
                  <IconExternalLink className="w-4 h-4 inline" />
                </a>
              </div>
              <div className="text-xs text-neutral-500 mb-1">
                Added by {audit.createdByName || audit.createdBy} on {new Date(audit.createdAt).toLocaleString()}
              </div>
              <div className="text-xs text-neutral-400">Lead ID: {audit.leadId}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditTab; 