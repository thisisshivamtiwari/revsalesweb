import { useState } from 'react'
import { format } from 'date-fns'
import { Plus, Search, Loader2, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { useGetLeadRulesQuery } from '@/lib/features/teams/teamsApi'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { useToast } from '../ui/use-toast'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'

interface LeadDistributionProps {
  onBack: () => void
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50]

export default function LeadDistribution({ onBack }: LeadDistributionProps) {
  const { toast } = useToast()
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const { data: rulesData, isLoading } = useGetLeadRulesQuery({
    limit: itemsPerPage,
    pageNumber: currentPage,
    search: searchQuery
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  const totalPages = rulesData?.data ? Math.ceil(rulesData.data.total / itemsPerPage) : 0

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1D2E] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 bg-[#262837] rounded-lg hover:bg-[#2A2C3E]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h2 className="text-3xl font-bold ml-8">Lead Distribution Rules</h2>
        </div>

        <div className="bg-[#262837] rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search rules..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600 px-3 py-2"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map(option => (
                    <option key={option} value={option}>
                      {option} items
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-[#FF5A81] hover:bg-[#FF4371] text-white flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Rule
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF5A81]" />
            </div>
          ) : !rulesData?.data.rules.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-[#1C1D2E] rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">No rules found</h3>
              <p className="text-gray-400">Try adjusting your search or add a new rule</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {rulesData.data.rules.map((rule) => (
                  <div 
                    key={rule.id}
                    className="bg-[#1C1D2E] rounded-xl p-6 border-2 border-[#1C1D2E] hover:border-gray-600 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-medium text-white">{rule.name}</h3>
                          <Badge className="bg-[#FF5A81]/10 text-[#FF5A81] border border-[#FF5A81]/20">
                            {rule.isCampaign ? 'Campaign Rule' : 'Field Rule'}
                          </Badge>
                        </div>
                        <p className="text-gray-400">{rule.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Assigned to: {rule.assignedTo}</span>
                          <span>•</span>
                          <span>Created by: {rule.createdBy}</span>
                          <span>•</span>
                          <span>Created: {format(new Date(rule.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-gray-400 hover:text-white border-gray-700 hover:border-gray-600"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-400 hover:text-red-300 border-red-700 hover:border-red-600"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
                  <div className="text-sm text-gray-400">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, rulesData.data.total)} of {rulesData.data.total} rules
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-8 h-8 p-0 border-gray-700"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          const showAround = Math.abs(page - currentPage) <= 1
                          const isFirstOrLast = page === 1 || page === totalPages
                          return showAround || isFirstOrLast
                        })
                        .map((page, index, array) => (
                          <>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span key={`ellipsis-${page}`} className="text-gray-600">...</span>
                            )}
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              onClick={() => handlePageChange(page)}
                              className={`w-8 h-8 p-0 ${
                                currentPage === page
                                  ? "bg-[#FF5A81] hover:bg-[#FF4371]"
                                  : "border-gray-700"
                              }`}
                            >
                              {page}
                            </Button>
                          </>
                        ))}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 p-0 border-gray-700"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-[600px] bg-[#1C1D2E] border border-gray-800 text-white p-8 rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Rule</DialogTitle>
            <DialogDescription className="text-gray-400">
              Create a new lead distribution rule
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-6 mt-6">
            {/* Form implementation will be added in the next step */}
            <div className="flex justify-end space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-[#262837] border-gray-700 text-gray-300 hover:bg-[#2A2C3E] hover:text-white hover:border-gray-600 text-base font-medium transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 bg-[#FF5A81] hover:bg-[#FF4371] text-white text-base font-medium shadow-lg hover:shadow-[#FF5A81]/20 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Create Rule
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 