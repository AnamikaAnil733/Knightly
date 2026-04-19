import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DollarSign, SearchIcon, User, ExternalLink } from "lucide-react";
import axios from "../../Service/Api/Axios/Adminaxios";

type PopulatedUser = {
  _id: string;
  displayname: string;
  email: string;
  avatarUrl?: string;
};

type Transaction = {
  _id: string;
  userId: PopulatedUser | string | null;
  amount: number;
  currency: string;
  status: string;
  stripeSessionId: string;
  type: string;
  createdAt: string;
};

/** Safely extract user fields regardless of whether userId is populated */
function getUser(userId: PopulatedUser | string | null): PopulatedUser {
  if (userId && typeof userId === "object" && "displayname" in userId) {
    return userId;
  }
  return { _id: typeof userId === "string" ? userId : "unknown", displayname: "Unknown User", email: "N/A" };
}

type TransactionsResponse = {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
};

const LIMIT = 10;

export function TransactionManagement() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError } = useQuery<TransactionsResponse>({
    queryKey: ["admin-transactions", page],
    queryFn: async () => {
      const res = await axios.get("/admin/transactions", {
        params: { page, limit: LIMIT },
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load transactions");
    }
  }, [isError]);

  const transactions = data?.transactions ?? [];
  const totalPages = data?.totalPages ?? 1;

  const filteredTransactions = transactions.filter((t) => {
    const user = getUser(t.userId);
    const term = searchTerm.toLowerCase();
    return (
      user.displayname.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      t.stripeSessionId.toLowerCase().includes(term)
    );
  });

  return (
    <div className="w-full min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[#FFD166]/10 rounded-lg">
            <DollarSign className="h-8 w-8 text-[#FFD166]" />
          </div>
          <h1 className="text-3xl font-bold text-white">Transaction History</h1>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-[#0A0F2C] rounded-xl p-4 mb-6 border border-[#1e2547]">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by user or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#11193F] border border-[#1e2547] rounded-lg text-white focus:outline-none focus:border-[#FFD166]"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-[#0A0F2C] rounded-xl overflow-hidden border border-[#1e2547]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#11193F] text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Stripe ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2547]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    <div className="animate-spin h-6 w-6 border-2 border-[#FFD166] border-t-transparent rounded-full mx-auto mb-4" />
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-[#11193F] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      {(() => {
                        const user = getUser(tx.userId);
                        return (
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#1e2547] flex items-center justify-center overflow-hidden border border-[#1e2547]">
                              {user.avatarUrl ? (
                                <img
                                  src={user.avatarUrl}
                                  alt="avatar"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {user.displayname}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      <span className="text-[#FFD166] font-bold">
                        {(tx.currency ?? "usd").toUpperCase() === "USD"
                          ? "$"
                          : (tx.currency ?? "usd").toUpperCase()}
                        {(tx.amount ?? 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          (tx.status ?? "") === "COMPLETED"
                            ? "bg-green-500/10 text-green-500"
                            : (tx.status ?? "") === "FAILED"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 group-hover:text-[#FFD166] transition-colors">
                        <span className="text-xs text-gray-500 font-mono truncate max-w-[100px]">
                          {tx.stripeSessionId}
                        </span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 cursor-pointer" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 bg-[#1e2547] px-2 py-1 rounded">
                        {tx.type}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-[#0A0F2C] border border-[#1e2547] text-white rounded-lg disabled:opacity-40 hover:bg-[#11193F]"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-[#0A0F2C] border border-[#1e2547] text-white rounded-lg disabled:opacity-40 hover:bg-[#11193F]"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
