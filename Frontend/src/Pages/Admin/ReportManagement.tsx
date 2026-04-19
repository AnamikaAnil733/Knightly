import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../Service/Api/Axios/Adminaxios";
import toast from "react-hot-toast";
import {
  FlagIcon,
  CheckCircle,
  XSquare,
  EyeIcon,
  Clock,
  User,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";

interface IReport {
  id: string;
  reporterId: string;
  reporterName?: string;
  reportedId: string;
  reportedName?: string;
  reporterEmail?: string;
  reportedEmail?: string;
  reason: string;
  description: string;
  evidence?: {
    gameId?: string;
    chatSnapshot?: { sender: string; text: string; time: string }[];
  };
  status: ReportStatus;
  createdAt: string;
}

export function ReportManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">(
    "PENDING",
  );
  const [selectedReport, setSelectedReport] = useState<IReport | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["reports", page, statusFilter],
    queryFn: async () => {
      const res = await axios.get("/admin/reports", {
        params: {
          page,
          limit: 10,
          status: statusFilter !== "ALL" ? statusFilter : undefined,
        },
      });
      return res.data;
    },
  }) as {
    data: { reports: IReport[]; totalPages: number } | undefined;
    isLoading: boolean;
  };

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: ReportStatus;
    }) => {
      await axios.patch(`/admin/reports/${id}/status`, { status });
    },
    onSuccess: () => {
      toast.success("Report status updated");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setSelectedReport(null);
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "RESOLVED":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "DISMISSED":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="w-full min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FlagIcon className="text-red-500" />
              Report Center
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Review and manage user misconduct reports
            </p>
          </div>

          <div className="flex bg-[#0A0F2C] rounded-xl p-1 border border-white/5">
            {["ALL", "PENDING", "RESOLVED", "DISMISSED"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status as ReportStatus | "ALL");
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === status
                    ? "bg-[#6B2EFF] text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#0A0F2C] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#11193F] text-gray-400 border-b border-white/5">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">
                  Reporter
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">
                  Reported
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">
                  Reason
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">
                  Applied On
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    Loading reports...
                  </td>
                </tr>
              ) : data?.reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No reports found
                  </td>
                </tr>
              ) : (
                data?.reports.map((report: IReport) => (
                  <tr
                    key={report.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-xs">
                          {report.reporterName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            {report.reporterName || "Unknown"}
                          </p>
                          <p className="text-[10px] text-gray-500">Reporter</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-bold text-xs">
                          {report.reportedName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            {report.reportedName || "Unknown"}
                          </p>
                          <p className="text-[10px] text-gray-500">Accused</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black tracking-widest uppercase bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300">
                        {report.reason.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded border ${getStatusColor(report.status)}`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setIsEvidenceModalOpen(true);
                        }}
                        className="p-2 rounded-lg bg-[#6B2EFF]/10 text-[#6B2EFF] hover:bg-[#6B2EFF] hover:text-white transition-all shadow-sm"
                        title="View Details"
                      >
                        <EyeIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(data?.totalPages ?? 0) > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {[...Array(data?.totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold transition-all ${
                  page === i + 1
                    ? "bg-[#6B2EFF] text-white"
                    : "bg-[#0A0F2C] text-gray-400 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Evidence Viewer Modal */}
      <AnimatePresence>
        {isEvidenceModalOpen && selectedReport && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsEvidenceModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-[#11193F] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                    <FlagIcon size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Report Case #{selectedReport.id.slice(-6)}
                    </h2>
                    <p className="text-xs text-gray-400">
                      Reason: {selectedReport.reason.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEvidenceModalOpen(false)}
                  className="text-gray-500 hover:text-white p-2 hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10"
                >
                  <XSquare size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 grid md:grid-cols-3 gap-8">
                {/* User Details */}
                <div className="md:col-span-1 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#6B2EFF]">
                      Participants
                    </h3>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3 mb-4">
                        <User className="text-blue-500 w-4 h-4" />
                        <div>
                          <p className="text-sm font-bold text-white">
                            {selectedReport.reporterName}
                          </p>
                          <p className="text-[10px] text-gray-500">Reporter</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <User className="text-red-500 w-4 h-4" />
                        <div>
                          <p className="text-sm font-bold text-white">
                            {selectedReport.reportedName}
                          </p>
                          <p className="text-[10px] text-gray-500">Accused</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#6B2EFF]">
                      Description
                    </h3>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 italic text-sm text-gray-300 leading-relaxed">
                      "{selectedReport.description}"
                    </div>
                  </div>

                  {selectedReport.status === "PENDING" && (
                    <div className="space-y-4 pt-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-white">
                        Approve Resolution
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: selectedReport.id,
                              status: "RESOLVED",
                            })
                          }
                          className="flex-1 bg-green-600 hover:bg-green-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 font-bold text-sm"
                        >
                          <CheckCircle size={16} /> Resolve
                        </button>
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: selectedReport.id,
                              status: "DISMISSED",
                            })
                          }
                          className="flex-1 bg-gray-600 hover:bg-gray-500 text-white p-3 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-sm"
                        >
                          <XSquare size={16} /> Dismiss
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Evidence Panel */}
                <div className="md:col-span-2 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#6B2EFF] flex items-center gap-2">
                    <MessageSquare size={14} /> Collected Evidence
                  </h3>

                  <div className="bg-[#0A0F2C] rounded-2xl border border-white/10 p-6 flex flex-col gap-6 overflow-y-auto max-h-[500px]">
                    {selectedReport.evidence?.chatSnapshot && (
                      <div className="space-y-4">
                        <p className="text-xs font-bold text-gray-500 border-b border-white/5 pb-2">
                          Chat Context Captured at time of Report
                        </p>
                        <div className="space-y-3">
                          {selectedReport.evidence.chatSnapshot.map(
                            (
                              msg: {
                                sender: string;
                                text: string;
                                time: string;
                              },
                              i: number,
                            ) => (
                              <div
                                key={i}
                                className={`flex flex-col ${msg.sender === selectedReport.reportedName ? "border-l-2 border-red-500 pl-3 bg-red-500/5" : "pl-3 text-gray-500"} py-1`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={`text-[10px] font-bold ${msg.sender === selectedReport.reportedName ? "text-red-400" : "text-gray-400"}`}
                                  >
                                    {msg.sender}
                                  </span>
                                  <span className="text-[9px] text-gray-600">
                                    {msg.time}
                                  </span>
                                </div>
                                <p className="text-xs text-white/90">
                                  {msg.text}
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {selectedReport.evidence?.gameId && (
                      <div className="flex flex-col items-center justify-center py-6 text-center gap-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="p-4 bg-[#6B2EFF]/10 rounded-full text-[#6B2EFF]">
                          <ExternalLink size={32} />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">
                            Game Log Attached
                          </p>
                          <p className="text-gray-500 text-[10px] mb-4">
                            Case involves cheating or behavior in a specific
                            match
                          </p>
                          <Link
                            to={`/admin/reports/review/${selectedReport.evidence.gameId}`}
                            state={{
                              chatMessages:
                                selectedReport.evidence.chatSnapshot,
                            }}
                            className="px-6 py-2 bg-[#6B2EFF] text-white rounded-lg font-bold hover:shadow-[0_0_20px_rgba(107,46,255,0.4)] transition-all flex items-center gap-2 text-xs mx-auto"
                          >
                            Replay Match <ExternalLink size={14} />
                          </Link>
                        </div>
                      </div>
                    )}

                    {!selectedReport.evidence?.chatSnapshot &&
                      !selectedReport.evidence?.gameId && (
                        <div className="flex flex-col items-center justify-center h-full py-20 text-center text-gray-500 space-y-4">
                          <Clock className="w-12 h-12 opacity-20" />
                          <p className="italic">
                            No digital context was captured for this report.{" "}
                            <br /> Refer to user description for details.
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
