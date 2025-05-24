"use client";

import React, { useState, useEffect } from "react";
import SidebarDemo from "@/components/ui/sidebar-demo";
import { AboutTab } from "@/components/lead-details/about-tab";
import { ActivityHistoryTab } from "@/components/lead-details/activity-history-tab";
import { TasksTab } from "@/components/lead-details/tasks-tab";
import { NotesTab } from "@/components/lead-details/notes-tab";
import { ProposalsTab } from "@/components/lead-details/proposals-tab";
import AuditTab from "@/components/lead-details/audit-tab";
import ScriptQuestionsTab from "@/components/lead-details/script-questions-tab";
import CallingSummaryTab from "@/components/lead-details/calling-summary-tab";
import ChatTab from "@/components/lead-details/chat-tab";
import { getLeadDetails, getLeadStatuses, updateLeadStatus, LeadDetails, LeadStatus } from "@/services/leads";

const TABS = [
  { key: "about", label: "About" },
  { key: "activity", label: "Activity History" },
  { key: "tasks", label: "Tasks" },
  { key: "notes", label: "Notes" },
  { key: "proposals", label: "Proposals" },
  { key: "audit", label: "Audit Report" },
  { key: "script", label: "Script Questions" },
  { key: "chat", label: "Chat" },
  { key: "calling", label: "Calling Summary" },
];

export default function LeadDetailsPage({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = React.use(params);
  const [activeTab, setActiveTab] = useState("about");
  const [lead, setLead] = useState<LeadDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Status modal state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statuses, setStatuses] = useState<LeadStatus[]>([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getLeadDetails(leadId)
      .then((res) => setLead(res.data.lead))
      .catch(() => setError("Failed to fetch lead details"))
      .finally(() => setLoading(false));
  }, [leadId]);

  const handleOpenStatusModal = async () => {
    setStatusModalOpen(true);
    setStatusLoading(true);
    setStatusError(null);
    try {
      const res = await getLeadStatuses();
      if (res.status && res.code === 200) {
        setStatuses(res.data.status);
      } else {
        setStatusError(res.message || "Failed to fetch statuses");
      }
    } catch (err) {
      setStatusError("Failed to fetch statuses");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSelectStatus = async (statusId: string, color: string, name: string) => {
    if (!lead) return;
    setStatusUpdating(true);
    setStatusUpdateError(null);
    try {
      const res = await updateLeadStatus(lead.leadId, statusId);
      if (res.status && res.code === 200) {
        setLead({ ...lead, status: statusId, statusName: name, color });
        setStatusModalOpen(false);
      } else {
        setStatusUpdateError(res.message || "Failed to update status");
      }
    } catch (err) {
      setStatusUpdateError("Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-row w-full bg-neutral-100 dark:bg-neutral-900">
      {/* Sidebar */}
      <SidebarDemo />
      {/* Main content - with padding to accommodate fixed sidebar */}
      <div className="flex-1 ml-[90px] lg:ml-[90px] transition-all duration-300">
        <main className="flex-grow py-8 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            {/* Lead Summary Header */}
            <div className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-neutral-700/30 p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {loading ? (
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="h-8 w-32 bg-neutral-200 dark:bg-neutral-700 rounded" />
                  <div className="h-5 w-48 bg-neutral-200 dark:bg-neutral-700 rounded" />
                </div>
              ) : error || !lead ? (
                <div className="text-red-500">{error || "No lead data found."}</div>
              ) : (
                <>
                  <div>
                    <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-1">{lead.name}</h1>
                    <p className="text-neutral-600 dark:text-neutral-400">{lead.email} • {lead.phoneNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium border cursor-pointer transition-all duration-150 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      style={{ backgroundColor: `${lead.color}20`, color: lead.color || '#6b7280', borderColor: `${lead.color}40` }}
                      tabIndex={0}
                      role="button"
                      aria-label="Change lead status"
                      onClick={handleOpenStatusModal}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleOpenStatusModal(); }}
                    >
                      {lead.statusName}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Sticky Tab Navigation */}
            <div className="sticky top-0 z-30 w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-xl shadow border border-white/10 dark:border-neutral-700/20 mb-8 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
              <div className="flex gap-2 min-w-max px-2">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 shadow-sm whitespace-nowrap
                      ${activeTab === tab.key
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "bg-white/0 dark:bg-neutral-800/0 text-neutral-700 dark:text-neutral-300 hover:bg-blue-500/10 dark:hover:bg-blue-500/10"}
                    `}
                    aria-label={tab.label}
                    tabIndex={0}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-neutral-700/30 p-6 min-h-[300px]">
              {activeTab === "about" && <AboutTab leadId={leadId} />}
              {activeTab === "activity" && <ActivityHistoryTab leadId={leadId} />}
              {activeTab === "tasks" && <TasksTab leadId={leadId} />}
              {activeTab === "notes" && <NotesTab leadId={leadId} />}
              {activeTab === "proposals" && <ProposalsTab leadId={leadId} />}
              {activeTab === "audit" && <AuditTab leadId={leadId} />}
              {activeTab === "script" && <ScriptQuestionsTab leadId={leadId} />}
              {activeTab === "chat" && <ChatTab leadId={leadId} />}
              {activeTab === "calling" && (
                loading || !lead ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
                  </div>
                ) : (
                  <CallingSummaryTab phoneNumber={lead.phoneNumber} />
                )
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Status Modal */}
      {statusModalOpen && lead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-xl font-bold focus:outline-none"
              onClick={() => setStatusModalOpen(false)}
              aria-label="Close status modal"
            >
              ×
            </button>
            <h2 className="text-lg font-bold mb-4 text-neutral-800 dark:text-neutral-100">Select Lead Status</h2>
            {statusLoading ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : statusError ? (
              <div className="text-red-500 text-center py-4">{statusError}</div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {statuses.map((s) => (
                  <button
                    key={s.id}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    style={{ backgroundColor: `${s.color}10`, color: s.color, borderColor: `${s.color}40` }}
                    onClick={() => handleSelectStatus(s.id, s.color, s.name)}
                    disabled={statusUpdating}
                    aria-label={`Set status to ${s.name}`}
                  >
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: s.color, display: 'inline-block' }}></span>
                    <span className="flex-1 text-left">{s.name}</span>
                    {lead.status === s.id && <span className="ml-2 text-xs text-blue-600 font-semibold">Current</span>}
                  </button>
                ))}
              </div>
            )}
            {statusUpdateError && <div className="text-red-500 text-center mt-3">{statusUpdateError}</div>}
          </div>
        </div>
      )}
    </div>
  );
} 