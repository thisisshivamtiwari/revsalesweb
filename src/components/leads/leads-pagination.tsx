import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LeadsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function LeadsPagination({ currentPage, totalPages, onPageChange }: LeadsPaginationProps) {
  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-400">
          Page {currentPage} of {totalPages}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-[#2F304D]/50 border-[#2F304D] hover:bg-[#2F304D]/70 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i + 1}
            variant={currentPage === i + 1 ? "default" : "outline"}
            onClick={() => onPageChange(i + 1)}
            className={cn(
              "min-w-[40px]",
              currentPage === i + 1
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-[#2F304D]/50 border-[#2F304D] hover:bg-[#2F304D]/70"
            )}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-[#2F304D]/50 border-[#2F304D] hover:bg-[#2F304D]/70 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 