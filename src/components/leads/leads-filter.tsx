import { Calendar as CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRange } from 'react-day-picker';

interface LeadsFilterProps {
  dateRange: DateRange | undefined;
  limit: number;
  search: string;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onLimitChange: (limit: string) => void;
  onSearchChange: (search: string) => void;
}

export function LeadsFilter({
  dateRange,
  limit,
  search,
  onDateRangeChange,
  onLimitChange,
  onSearchChange,
}: LeadsFilterProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search leads..."
          className="pl-10 bg-[#2F304D]/50 border-[#2F304D] text-white placeholder:text-gray-400 focus-visible:ring-blue-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal bg-[#2F304D]/50 border-[#2F304D] hover:bg-[#2F304D]/70",
                !dateRange?.from && "text-gray-400"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "d MMM yy")} -{" "}
                    {format(dateRange.to, "d MMM yy")}
                  </>
                ) : (
                  format(dateRange.from, "d MMM yy")
                )
              ) : (
                "Select dates"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#242744] border-[#2F304D]" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
              className="bg-[#242744] text-white"
            />
          </PopoverContent>
        </Popover>

        <Select value={limit.toString()} onValueChange={onLimitChange}>
          <SelectTrigger className="w-[130px] bg-[#2F304D]/50 border-[#2F304D] hover:bg-[#2F304D]/70">
            <SelectValue placeholder="Rows per page" />
          </SelectTrigger>
          <SelectContent className="bg-[#242744] border-[#2F304D]">
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 