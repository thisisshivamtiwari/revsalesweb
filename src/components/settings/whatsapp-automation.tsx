import { useState, Fragment, useEffect, useRef } from "react"
import { ChevronLeft, Plus, Search, Edit2, Trash2, Loader2, ChevronRight, AlertCircle, X,  Upload, ZoomIn } from "lucide-react"
import { useGetWhatsappRulesQuery, useGetLeadStatusQuery, useGetFormFieldsQuery, useAddRuleMutation, useUpdateRuleMutation, useDeleteRuleMutation } from "@/lib/features/whatsapp/whatsappApi"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { useImageUpload } from "@/lib/utils/image"

interface WhatsappAutomationProps {
  onBack: () => void
}

const ITEMS_PER_PAGE_OPTIONS = [6, 10, 20, 50]

interface RuleFormData {
  id?: string
  name: string
  leadStatus: string
  description: string
  imageUrl: string
  index: number
  keys: string[]
}

interface DeleteConfirmationModalProps {
  isOpen: boolean
  ruleName: string
  onClose: () => void
  onConfirm: () => void
}

function DeleteConfirmationModal({ isOpen, ruleName, onClose, onConfirm }: DeleteConfirmationModalProps) {
  const [confirmText, setConfirmText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#262837] rounded-2xl p-8 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Confirm Deactivation</h3>
            <p className="text-gray-400">
              This action will delete the rule "{ruleName}". Type "delete" to confirm.
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder='Type "delete" to confirm'
          className="w-full px-4 py-3 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600 mb-6"
        />

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-gray-300 hover:text-white transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={confirmText !== "delete"}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500"
          >
            Delete Rule
          </button>
        </div>
      </div>
    </div>
  )
}

interface WhatsappPreviewProps {
  message: string
  imageUrl?: string
  variables: Record<string, string>
}

interface ImagePreviewModalProps {
  imageUrl: string
  onClose: () => void
}

function ImagePreviewModal({ imageUrl, onClose }: ImagePreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
        >
          <X className="w-8 h-8" />
        </button>
        <img 
          src={imageUrl} 
          alt="Full size preview" 
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  )
}

function ImagePreview({ url, onRemove }: { url: string; onRemove: () => void }) {
  const [showFullSize, setShowFullSize] = useState(false)

  return (
    <>
      <div className="relative group">
        <img 
          src={url} 
          alt="Upload preview" 
          className="w-full h-32 object-cover rounded-lg"
        />
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => setShowFullSize(true)}
            className="p-1 bg-black/50 hover:bg-black/75 rounded-full transition-colors duration-200"
          >
            <ZoomIn className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={onRemove}
            className="p-1 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-200"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      {showFullSize && (
        <ImagePreviewModal
          imageUrl={url}
          onClose={() => setShowFullSize(false)}
        />
      )}
    </>
  )
}

function WhatsappPreview({ message, imageUrl, variables }: WhatsappPreviewProps) {
  const [showFullSize, setShowFullSize] = useState(false)
  
  // Replace variables in message with their values
  const previewMessage = message.replace(/\/{{(.+?)}}/g, (match, key) => {
    return variables[key] || match
  })

  return (
    <>
      <div className="bg-[#0B141A] rounded-lg p-4 max-w-md w-full">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#202C33] flex-shrink-0" />
          <div className="flex-1">
            <div className="text-[#E9EDF0] font-medium mb-1">Business Name</div>
            {imageUrl && (
              <div className="mb-2 rounded-lg overflow-hidden group relative">
                <img 
                  src={imageUrl} 
                  alt="Message attachment" 
                  className="w-full h-auto max-h-48 object-cover cursor-pointer"
                  onClick={() => setShowFullSize(true)}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
            <div className="bg-[#202C33] rounded-lg p-3">
              <p className="text-[#E9EDF0] whitespace-pre-line text-sm">{previewMessage}</p>
            </div>
            <div className="text-[#8696A0] text-xs mt-1">12:00 PM</div>
          </div>
        </div>
      </div>
      {showFullSize && imageUrl && (
        <ImagePreviewModal
          imageUrl={imageUrl}
          onClose={() => setShowFullSize(false)}
        />
      )}
    </>
  )
}

export function WhatsappAutomation({ onBack }: WhatsappAutomationProps) {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [editingRule, setEditingRule] = useState<RuleFormData | null>(null)
  const [formData, setFormData] = useState<RuleFormData>({
    name: "",
    leadStatus: "",
    description: "",
    imageUrl: "",
    index: 1,
    keys: [],
  })
  const [showVariablesDropdown, setShowVariablesDropdown] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState<{ id: string; name: string } | null>(null)
  const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({
    name: "John Doe",
    email: "john@example.com",
    phoneNumber: "+1234567890",
    // Add more default preview values
  })
  const { uploadImageFile, isLoading: isImageUploading } = useImageUpload()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: rulesData, isLoading, isFetching, refetch } = useGetWhatsappRulesQuery({
    limit: itemsPerPage,
    pageNumber: currentPage,
    search: searchQuery,
  })

  const { data: leadStatusData } = useGetLeadStatusQuery({
    limit: 100,
    pageNumber: 1,
    search: "",
  })

  const { data: formFieldsData } = useGetFormFieldsQuery()

  const [addRule] = useAddRuleMutation()
  const [updateRule] = useUpdateRuleMutation()
  const [deleteRule] = useDeleteRuleMutation()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const totalPages = rulesData ? Math.ceil(rulesData.data.total / itemsPerPage) : 0

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value)
    setItemsPerPage(newLimit)
    setCurrentPage(1)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, description: value }))

    // Check if user just typed '/'
    if (value.endsWith('/')) {
      setShowVariablesDropdown(true)
    } else {
      setShowVariablesDropdown(false)
    }

    // Extract all dynamic variables from the entire text
    const variables = value.match(/\/{{([^}]+)}}/g) || []
    const extractedKeys = variables.map((v: string) => {
      // Extract the key from /{{key}} format
      const match = v.match(/\/{{(.+?)}}/)
      return match ? match[1] : ''
    }).filter(Boolean) // Remove any empty strings

    // Update the keys array with all found variables
    setFormData(prev => ({ ...prev, keys: extractedKeys }))
  }

  const handleVariableSelect = (field: { name: string; key: string }) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const cursorPosition = textarea.selectionStart
    const textBeforeCursor = formData.description.slice(0, cursorPosition)
    const textAfterCursor = formData.description.slice(cursorPosition)

    // Replace the '/' with the selected variable
    const newText = textBeforeCursor.slice(0, -1) + `/{{${field.key}}}` + textAfterCursor
    
    // Update description and add the new key to the keys array
    setFormData(prev => {
      const newKeys = [...new Set([...prev.keys, field.key])] // Use Set to ensure uniqueness
      return {
        ...prev,
        description: newText,
        keys: newKeys
      }
    })
    
    setShowVariablesDropdown(false)

    // Update cursor position after the inserted variable
    setTimeout(() => {
      if (textarea) {
        textarea.focus()
        const newPosition = cursorPosition + field.key.length + 4 // +4 for /{{ and }}
        textarea.setSelectionRange(newPosition, newPosition)
      }
    }, 0)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showVariablesDropdown && !target.closest('.variables-dropdown')) {
        setShowVariablesDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showVariablesDropdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingRule?.id) {
        await updateRule({
          id: editingRule.id,
          ...formData,
        }).unwrap()
        toast({
          title: "Success",
          description: "Rule updated successfully",
        })
      } else {
        await addRule({
          destributionRule: [formData],
        }).unwrap()
        toast({
          title: "Success",
          description: "Rule added successfully",
        })
      }
      setShowAddForm(false)
      setEditingRule(null)
      setFormData({
        name: "",
        leadStatus: "",
        description: "",
        imageUrl: "",
        index: 1,
        keys: [],
      })
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save rule",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (rule: any) => {
    // Extract all dynamic variables from the description
    const variables = rule.description.match(/\/{{([^}]+)}}/g) || []
    const extractedKeys = variables.map((v: string) => {
      // Extract the key from /{{key}} format
      const match = v.match(/\/{{(.+?)}}/)
      return match ? match[1] : ''
    }).filter(Boolean) // Remove any empty strings

    const ruleData = {
      id: rule.id,
      name: rule.name,
      leadStatus: rule.leadStatus,
      description: rule.description,
      imageUrl: rule.imageUrl || "",
      index: rule.index,
      keys: rule.keys?.length ? rule.keys : extractedKeys, // Use existing keys if available, otherwise use extracted ones
    }

    setEditingRule(ruleData)
    setFormData(ruleData)
    setShowAddForm(true)
  }

  const handleDelete = async (id: string, name: string) => {
    setRuleToDelete({ id, name })
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!ruleToDelete) return

    try {
      await deleteRule(ruleToDelete.id).unwrap()
      toast({
        title: "Success",
        description: "Rule deleted successfully",
      })
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete rule",
        variant: "destructive",
      })
    } finally {
      setDeleteModalOpen(false)
      setRuleToDelete(null)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imageUrl = await uploadImageFile(file)
      setFormData(prev => ({ ...prev, imageUrl }))
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handlePreviewVariableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPreviewVariables(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-[#1C1D2E] text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8 flex items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200 bg-[#262837] rounded-lg hover:bg-[#2A2C3E]"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h2 className="text-3xl font-bold ml-8">Whatsapp Automation Rules</h2>
        </div>

        <div className="bg-[#262837] rounded-2xl p-8 shadow-xl">
          {/* Search, Limit Select, and Add Section */}
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search automation rules..."
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
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-3 bg-[#FF5A81] text-white rounded-lg font-medium hover:bg-[#FF4371] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Rule
            </button>
          </div>

          {/* Rules List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF5A81]" />
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {rulesData?.data.rules.map((rule) => (
                  <div 
                    key={rule.id}
                    className="bg-[#1C1D2E] rounded-xl p-6 border-2 border-[#1C1D2E] hover:border-gray-600 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{rule.name}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-400">Created by: {rule.createdBy}</span>
                          <span className="text-sm text-gray-400">
                            {format(new Date(rule.createdAt), "MMM d, yyyy")}
                          </span>
                          <span className="px-2 py-1 text-xs rounded-full bg-[#FF5A81]/10 text-[#FF5A81] border border-[#FF5A81]/20">
                            {rule.leadStatus}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                          onClick={() => handleEdit(rule)}
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                          onClick={() => handleDelete(rule.id, rule.name)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-gray-300 whitespace-pre-line">{rule.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {rulesData && rulesData.data.total > 0 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-700 pt-4">
                  <div className="text-sm text-gray-400">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, rulesData.data.total)} of {rulesData.data.total} rules
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isFetching}
                      className="p-2 text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          // Show first page, last page, current page, and pages around current page
                          const showAround = Math.abs(page - currentPage) <= 1
                          const isFirstOrLast = page === 1 || page === totalPages
                          return showAround || isFirstOrLast
                        })
                        .map((page, index, array) => (
                          <Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="text-gray-600">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              disabled={isFetching}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                                currentPage === page
                                  ? "bg-[#FF5A81] text-white"
                                  : "text-gray-400 hover:text-white hover:bg-[#2A2C3E]"
                              }`}
                            >
                              {page}
                            </button>
                          </Fragment>
                        ))}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || isFetching}
                      className="p-2 text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Rule Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#262837] rounded-2xl p-8 w-full max-w-5xl modal-content">
            <h3 className="text-2xl font-bold mb-6">
              {editingRule ? "Edit Automation Rule" : "Add Automation Rule"}
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Rule Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Enter rule name"
                    className="w-full px-4 py-3 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Lead Status</label>
                  <select
                    name="leadStatus"
                    value={formData.leadStatus}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600"
                  >
                    <option value="">Select Lead Status</option>
                    {leadStatusData?.data.status.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 relative">
                  <label className="block text-sm font-medium text-gray-300">Message Template</label>
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      name="description"
                      value={formData.description}
                      onChange={handleDescriptionChange}
                      placeholder="Enter message template"
                      rows={4}
                      className="w-full px-4 py-3 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600"
                    />
                    {showVariablesDropdown && formFieldsData?.data && (
                      <div 
                        className="variables-dropdown absolute z-50 w-full max-h-48 overflow-y-auto bg-[#1C1D2E] border border-gray-700 rounded-lg shadow-lg mt-1"
                      >
                        {formFieldsData.data.map((field) => (
                          <button
                            key={field.id}
                            type="button"
                            onClick={() => handleVariableSelect(field)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-[#2A2C3E] hover:text-white transition-colors duration-200"
                          >
                            {field.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    Type / to add dynamic variables (e.g., {`/{{Full Name}}`})
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Image</label>
                  <div className="space-y-4">
                    {formData.imageUrl ? (
                      <ImagePreview 
                        url={formData.imageUrl} 
                        onRemove={handleRemoveImage}
                      />
                    ) : (
                      <div 
                        className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-[#FF5A81] transition-colors duration-200 cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {isImageUploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 animate-spin text-[#FF5A81]" />
                            <span className="text-sm text-gray-400">Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-gray-400" />
                            <span className="text-sm text-gray-400">Click to upload image</span>
                          </div>
                        )}
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Index (1-5)</label>
                  <select
                    name="index"
                    value={formData.index}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingRule(null)
                      setFormData({
                        name: "",
                        leadStatus: "",
                        description: "",
                        imageUrl: "",
                        index: 1,
                        keys: [],
                      })
                    }}
                    className="px-6 py-3 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#FF5A81] text-white rounded-lg font-medium hover:bg-[#FF4371] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {editingRule ? "Update Rule" : "Save Rule"}
                  </button>
                </div>
              </form>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Preview Variables</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.keys.map(key => (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          {key}
                        </label>
                        <input
                          type="text"
                          name={key}
                          value={previewVariables[key] || ""}
                          onChange={handlePreviewVariableChange}
                          placeholder={`Enter ${key}`}
                          className="w-full px-3 py-2 bg-[#1C1D2E] text-white rounded-lg border-2 border-[#1C1D2E] focus:border-[#FF5A81] focus:outline-none transition-all duration-200 shadow-inner hover:border-gray-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Message Preview</h4>
                  <WhatsappPreview
                    message={formData.description}
                    imageUrl={formData.imageUrl}
                    variables={previewVariables}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        ruleName={ruleToDelete?.name || ""}
        onClose={() => {
          setDeleteModalOpen(false)
          setRuleToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
} 