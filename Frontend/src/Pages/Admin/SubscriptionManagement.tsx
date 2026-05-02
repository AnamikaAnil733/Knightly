import { useEffect, useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { SearchIcon, CreditCard } from "lucide-react";

import axios from "../../Service/Api/Axios/Adminaxios";
import { IUser } from "../../Types/UserTypes";
import { UserTable } from "../../Components/Admin/UserManagement/UserTable";
import { UserProfile } from "../../Components/Admin/UserManagement/UserProfile";
import { SubscriptionStats } from "../../Components/Admin/Subscription/SubscriptionStats";
import {
  SubscriptionResponse,
  StatsResponse,
} from "../../Types/SubscriptionTypes";

const LIMIT = 10;

export function SubscriptionManagement() {
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  /* ===================== FETCH STATS ===================== */
  const { data: statsData } = useQuery<StatsResponse>({
    queryKey: ["subscription-stats"],
    queryFn: async () => {
      const res = await axios.get("/admin/subscriptions/stats");
      return res.data;
    },
  });

  /* ===================== FETCH PREMIUM USERS ===================== */
  const { data, isLoading, isError } = useQuery<SubscriptionResponse>({
    queryKey: ["admin-subscriptions", page, searchTerm],
    queryFn: async () => {
      const res = await axios.get("/admin/users", {
        params: {
          page,
          limit: LIMIT,
          search: searchTerm || undefined,
          filter: "PREMIUM",
        },
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load subscriptions");
    }
  }, [isError]);

  const users = useMemo(() => data?.users ?? [], [data]);
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="w-full min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[#FFD166]/10 rounded-lg">
            <CreditCard className="h-8 w-8 text-[#FFD166]" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Subscription Management
          </h1>
        </div>

        {/* STATS */}
        {statsData && <SubscriptionStats stats={statsData.stats} />}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT PANEL */}
          <div className="flex-1">
            {/* SEARCH */}
            <div className="bg-[#0A0F2C] rounded-xl p-4 mb-6 border border-[#1e2547]">
              <div className="flex items-center justify-between">
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Search premium subscribers..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-[#11193F] border border-[#1e2547] rounded-lg text-white focus:outline-none focus:border-[#FFD166] transition-colors"
                  />
                  <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <div className="text-gray-400 text-sm">
                  Found {data?.total || 0} active subscribers
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-[#0A0F2C] rounded-xl overflow-hidden border border-[#1e2547]">
              {isLoading ? (
                <div className="text-center text-gray-300 p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD166] mx-auto mb-4"></div>
                  Loading subscribers...
                </div>
              ) : users.length === 0 ? (
                <div className="text-center text-gray-400 p-12 border-2 border-dashed border-[#1e2547] m-4 rounded-xl">
                  {searchTerm
                    ? "No subscribers match your search"
                    : "No active subscribers found"}
                </div>
              ) : (
                <UserTable
                  users={users}
                  onSelectUser={setSelectedUser}
                  onBanUser={() => {}} // Not needed here, but kept for table compatibility
                  selectedUserId={selectedUser?.id || ""}
                />
              )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 px-4 py-3 bg-[#0A0F2C] rounded-xl border border-[#1e2547]">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-6 py-2 bg-[#11193F] text-white rounded-lg disabled:opacity-40 hover:bg-[#1e2547] transition-colors"
                >
                  Previous
                </button>

                <span className="text-sm font-medium text-gray-400">
                  Page <span className="text-white">{page}</span> of{" "}
                  {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-6 py-2 bg-[#11193F] text-white rounded-lg disabled:opacity-40 hover:bg-[#1e2547] transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* RIGHT PROFILE (Optional Detail View) */}
          <div className="lg:w-80">
            {selectedUser ? (
              <UserProfile user={selectedUser} onBanUser={() => {}} />
            ) : (
              <div className="bg-[#0A0F2C] border border-[#1e2547] rounded-xl p-8 text-center text-gray-400 h-full flex flex-col items-center justify-center min-h-[300px]">
                <div className="p-4 bg-[#11193F] rounded-full mb-4">
                  <CreditCard className="h-8 w-8 text-gray-500" />
                </div>
                <p className="text-sm">
                  Select a subscriber to view their full profile and membership
                  details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
