import { useState } from 'react';
import { format } from 'date-fns';
import { Mail, Phone, Star, Calendar, Loader2, PhoneCall, Infinity } from 'lucide-react';
import { useGetTodaysLeadsQuery } from '@/lib/features/leads/leadsApi';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { LeadsFilter } from './leads-filter';
import { LeadsPagination } from './leads-pagination';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';

export function LeadsList() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useGetTodaysLeadsQuery({
    limit,
    pageNumber: page,
    search,
    startDate: dateRange?.from?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    endDate: dateRange?.to?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
  });

  const totalPages = Math.ceil((data?.data?.total || 0) / limit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[200px] text-red-400">
        Failed to load leads
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LeadsFilter
        dateRange={dateRange}
        limit={limit}
        search={search}
        onDateRangeChange={(range) => {
          setDateRange(range);
          setPage(1);
        }}
        onLimitChange={(value) => {
          setLimit(Number(value));
          setPage(1);
        }}
        onSearchChange={setSearch}
      />

      {!data?.data.leads?.length ? (
        <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg">No leads found</p>
          <p className="text-sm mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.data.leads.map((lead) => (
            <Card 
              key={lead.leadId} 
              className="bg-[#2F304D]/50 border-[#2F304D]/20 p-4 hover:bg-[#2F304D]/70 transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative flex items-start gap-4">
                <Avatar className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-white/10">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold truncate text-white group-hover:text-blue-400 transition-colors">
                        {lead.name}
                      </h3>
                      {lead.statuName === "New Lead" && (
                        <Badge variant="secondary" className="mt-1 bg-blue-500/20 text-blue-400 border-blue-500/30 rounded-full">
                          <Infinity className="w-3 h-3 mr-1" />
                          New Lead
                        </Badge>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Star className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${lead.email}`} className="truncate hover:underline">
                        {lead.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${lead.phoneNumber}`} className="hover:underline">
                        {lead.phoneNumber}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(lead.createdTime), 'd MMM yy')}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <Badge 
                      variant="secondary"
                      className={cn(
                        "rounded-full px-3 py-1",
                        lead.statuName === "New Lead" && "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-blue-500/30",
                        lead.statuName === "Meeting Generated" && "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30"
                      )}
                    >
                      {lead.leadOrigin}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10"
                      onClick={() => window.open(`tel:${lead.phoneNumber}`)}
                    >
                      <PhoneCall className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <LeadsPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
} 