"use client";

import React from "react";
import { useEffect, useState } from "react";
import { getLeadCallSummary, LeadCallSummaryItem } from "@/services/leads";
import {
  IconPhoneIncoming,
  IconPhoneOutgoing,
  IconPhoneEnd,
  IconPhone,
  IconAlertTriangle,
  IconClock,
  IconPhoneOff,
} from "@tabler/icons-react";

interface CallingSummaryTabProps {
  phoneNumber: string;
}

const callTypeMeta: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  incoming: {
    label: "Incoming",
    icon: <IconPhoneIncoming className="w-6 h-6" />,
    color: "bg-green-100 text-green-700",
  },
  outgoing: {
    label: "Outgoing",
    icon: <IconPhoneOutgoing className="w-6 h-6" />,
    color: "bg-blue-100 text-blue-700",
  },
  missed: {
    label: "Missed",
    icon: <IconPhoneEnd className="w-6 h-6" />,
    color: "bg-red-100 text-red-700",
  },
  "not connected": {
    label: "Not Connected",
    icon: <IconPhoneOff className="w-6 h-6" />,
    color: "bg-gray-100 text-gray-700",
  },
  total: {
    label: "Total Calls",
    icon: <IconPhone className="w-6 h-6" />,
    color: "bg-purple-100 text-purple-700",
  },
  "average call time": {
    label: "Avg. Call Time",
    icon: <IconClock className="w-6 h-6" />,
    color: "bg-yellow-100 text-yellow-700",
  },
  unknown: {
    label: "Unknown",
    icon: <IconAlertTriangle className="w-6 h-6" />,
    color: "bg-orange-100 text-orange-700",
  },
};

const CallingSummaryTab = ({ phoneNumber }: CallingSummaryTabProps) => {
  const [calls, setCalls] = useState<LeadCallSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getLeadCallSummary(phoneNumber)
      .then((res) => {
        if (res.status && res.code === 200) {
          setCalls(res.data.calls);
        } else {
          setError(res.message || "Failed to fetch call summary");
        }
      })
      .catch(() => setError("Failed to fetch call summary"))
      .finally(() => setLoading(false));
  }, [phoneNumber]);

  return (
    <div className="bg-white/40 dark:bg-neutral-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-neutral-700/30 p-4 md:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-xl bg-purple-500/10 dark:bg-purple-500/20">
          <IconPhone className="w-6 h-6 text-purple-500" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Calling Summary
        </h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
            <IconAlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">{error}</h3>
        </div>
      ) : calls.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
            <IconPhone className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400">No call summary found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calls.map((call, idx) => {
            const meta = callTypeMeta[call.callType.toLowerCase()] || callTypeMeta.unknown;
            return (
              <div
                key={idx}
                className={`flex flex-col gap-2 p-5 rounded-xl shadow bg-white/70 dark:bg-neutral-900/70 border border-white/30 dark:border-neutral-700/40 ${meta.color}`}
                tabIndex={0}
                aria-label={`${meta.label} call summary`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`p-2 rounded-lg ${meta.color} bg-opacity-60`}>{meta.icon}</span>
                  <span className="text-lg font-semibold">{meta.label}</span>
                </div>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-neutral-700 dark:text-neutral-200">
                    <span className="font-medium">Count:</span> {call.count}
                  </span>
                  <span className="text-neutral-700 dark:text-neutral-200">
                    <span className="font-medium">Duration:</span> {call.duration}
                  </span>
                  {call.userName && (
                    <span className="text-neutral-500 dark:text-neutral-400">
                      <span className="font-medium">User:</span> {call.userName}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CallingSummaryTab; 