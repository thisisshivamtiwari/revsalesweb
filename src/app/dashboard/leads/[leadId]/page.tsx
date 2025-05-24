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
import { getLeadDetails, LeadDetails } from "@/services/leads";

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

  useEffect(() => {
    setLoading(true);
    setError(null);
    getLeadDetails(leadId)
      .then((res) => setLead(res.data.lead))
      .catch(() => setError("Failed to fetch lead details"))
      .finally(() => setLoading(false));
  }, [leadId]);

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
                    <span className="px-3 py-1 rounded-full text-sm font-medium border" style={{ backgroundColor: `${lead.color}20`, color: lead.color || '#6b7280', borderColor: `${lead.color}40` }}>{lead.statusName}</span>
                  </div>
                </>
              )}
            </div>

            {/* Sticky Tab Navigation */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-xl shadow border border-white/10 dark:border-neutral-700/20 mb-8 flex gap-2 overflow-x-auto p-2">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 ${
                    activeTab === tab.key
                      ? "bg-blue-600 text-white shadow"
                      : "bg-white/0 dark:bg-neutral-800/0 text-neutral-700 dark:text-neutral-300 hover:bg-blue-500/10 dark:hover:bg-blue-500/10"
                  }`}
                  aria-label={tab.label}
                  tabIndex={0}
                >
                  {tab.label}
                </button>
              ))}
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
    </div>
  );
} 