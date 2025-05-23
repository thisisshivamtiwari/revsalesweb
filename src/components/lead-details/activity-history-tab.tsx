import { useEffect, useState } from 'react';
import { getLeadActivity, LeadActivityItem } from '@/services/leads';
import { IconUser, IconClock } from '@tabler/icons-react';
import { format } from 'date-fns';

interface ActivityHistoryTabProps {
  leadId: string | number;
}

export const ActivityHistoryTab = ({ leadId }: ActivityHistoryTabProps) => {
  const [activities, setActivities] = useState<LeadActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getLeadActivity(leadId)
      .then((res) => setActivities(res.data.activity.activities))
      .catch(() => setError('Failed to fetch activity history'))
      .finally(() => setLoading(false));
  }, [leadId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }
  if (!activities || activities.length === 0) {
    return <div className="text-neutral-500 text-center py-8">No activity history found.</div>;
  }

  return (
    <div className="relative">
      <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400/30 via-blue-200/20 to-transparent dark:from-blue-900/40 dark:via-blue-900/10" />
      <ul className="space-y-10 pl-14">
        {activities.map((item, idx) => (
          <li key={idx} className="relative group focus-within:ring-2 focus-within:ring-blue-400">
            {/* Animated timeline dot */}
            <div className="absolute -left-7 top-4 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 border-4 border-white dark:border-neutral-900 shadow-lg group-hover:scale-110 group-focus:scale-110 transition-transform duration-200" />
            {/* Card background */}
            <div className="bg-white/70 dark:bg-neutral-800/70 backdrop-blur-xl rounded-xl shadow border border-white/20 dark:border-neutral-700/30 px-6 py-4 transition-all duration-200 group-hover:bg-blue-50/80 dark:group-hover:bg-blue-900/30 group-hover:shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <span className="flex items-center gap-2 text-base font-medium text-blue-700 dark:text-blue-300">
                  <IconUser className="w-5 h-5" />
                  {item.ownerName}
                </span>
                <span className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 md:ml-4">
                  <IconClock className="w-4 h-4" />
                  {format(new Date(item.createdAt), 'PP, p')}
                </span>
              </div>
              <div className="text-lg text-neutral-800 dark:text-neutral-100 font-semibold">
                {item.activity}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}; 