import { useEffect, useState } from 'react';
import { getLeadDetails, LeadDetails } from '@/services/leads';
import { IconUser, IconMail, IconPhone, IconMapPin, IconCalendar, IconUserCheck, IconFlag, IconTag } from '@tabler/icons-react';

interface AboutTabProps {
  leadId: string | number;
}

export const AboutTab = ({ leadId }: AboutTabProps) => {
  const [lead, setLead] = useState<LeadDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getLeadDetails(leadId)
      .then((res) => {
        setLead(res.data.lead);
      })
      .catch(() => setError('Failed to fetch lead details'))
      .finally(() => setLoading(false));
  }, [leadId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error || !lead) {
    return <div className="text-red-500 text-center py-8">{error || 'No lead data found.'}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Static fields */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <IconUser className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-neutral-700 dark:text-neutral-200">{lead.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <IconMail className="w-5 h-5 text-blue-500" />
          <span>{lead.email}</span>
        </div>
        <div className="flex items-center gap-3">
          <IconPhone className="w-5 h-5 text-blue-500" />
          <span>{lead.phoneNumber}</span>
        </div>
        <div className="flex items-center gap-3">
          <IconMapPin className="w-5 h-5 text-blue-500" />
          <span>{lead.city}</span>
        </div>
        <div className="flex items-center gap-3">
          <IconUserCheck className="w-5 h-5 text-blue-500" />
          <span>Owner: {lead.leadOwnerName}</span>
        </div>
        <div className="flex items-center gap-3">
          <IconFlag className="w-5 h-5 text-blue-500" />
          <span>Source: {lead.leadSource}</span>
        </div>
        <div className="flex items-center gap-3">
          <IconTag className="w-5 h-5 text-blue-500" />
          <span>Status: <span style={{ color: lead.color }}>{lead.statusName}</span></span>
        </div>
        <div className="flex items-center gap-3">
          <IconCalendar className="w-5 h-5 text-blue-500" />
          <span>Created: {new Date(lead.createdAt).toLocaleString()}</span>
        </div>
      </div>
      {/* Dynamic otherDetails */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200 mb-2">Other Details</h3>
        <div className="bg-white/60 dark:bg-neutral-800/60 rounded-xl p-4 shadow border border-white/20 dark:border-neutral-700/30">
          {lead.otherDetails && Object.keys(lead.otherDetails).length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(lead.otherDetails).map(([key, value]) => (
                <li key={key} className="flex justify-between items-center text-neutral-700 dark:text-neutral-200">
                  <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="ml-4 text-neutral-600 dark:text-neutral-400">{value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-neutral-500">No additional details.</span>
          )}
        </div>
      </div>
    </div>
  );
}; 