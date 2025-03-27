import { Phone, PhoneMissed, PhoneIncoming, PhoneOutgoing, Clock, User, Loader2 } from 'lucide-react';
import { useGetCallDetailsQuery } from '@/lib/features/dashboard/dashboardApi';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const callTypeConfig = {
  missed: {
    icon: PhoneMissed,
    color: 'text-red-400',
    bgColor: 'bg-red-400/20',
    borderColor: 'border-red-400/30',
  },
  incoming: {
    icon: PhoneIncoming,
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    borderColor: 'border-green-400/30',
  },
  outgoing: {
    icon: PhoneOutgoing,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/20',
    borderColor: 'border-blue-400/30',
  },
  total: {
    icon: Phone,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/20',
    borderColor: 'border-purple-400/30',
  },
  'average call time': {
    icon: Clock,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/20',
    borderColor: 'border-yellow-400/30',
  },
  'not connected': {
    icon: User,
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/20',
    borderColor: 'border-gray-400/30',
  },
  unknown: {
    icon: Phone,
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/20',
    borderColor: 'border-gray-400/30',
  },
};

export function CallDetails() {
  const { data, isLoading } = useGetCallDetailsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!data?.data.calls) {
    return null;
  }

  return (
    <Card className="bg-[#2F304D]/50 border-[#2F304D]/20 p-6">
      <div className="flex items-center justify-between mb-6">
        {/* <h2 className="text-xl font-semibold text-white">Call Statistics</h2> */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <User className="w-4 h-4" />
          <span>{data.data.calls[0]?.userName}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.data.calls.map((call) => {
          const config = callTypeConfig[call.callType as keyof typeof callTypeConfig];
          const Icon = config?.icon || Phone;

          return (
            <Card
              key={call.callType}
              className="bg-[#242744] border-[#2F304D]/20 p-4 hover:bg-[#2F304D]/70 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  config?.bgColor
                )}>
                  <Icon className={cn("w-5 h-5", config?.color)} />
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  config?.bgColor,
                  config?.color,
                  config?.borderColor,
                  "border"
                )}>
                  {call.count} calls
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-medium text-gray-400 capitalize">
                  {call.callType}
                </h3>
                <p className={cn(
                  "text-lg font-semibold mt-1",
                  config?.color
                )}>
                  {call.duration}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
} 