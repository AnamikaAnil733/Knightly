import { useEffect, useMemo, useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { SearchIcon } from "lucide-react";

import axios from "../../Service/Api/Axios/Adminaxios";
import { IUser, UserRole } from "../../Types/User";

import { UserTable } from "../../Components/Admin/UserManagement/UserTable";
import { UserProfile } from "../../Components/Admin/UserManagement/UserProfile";
import { UserFilters } from "../../Components/Admin/UserManagement/UserFilters";

/* ===================== TYPES ===================== */

export type UserFilter = "ALL" | "BLOCKED" | "UNBLOCKED" | "PREMIUM";

type UsersResponse = {
  users: IUser[];
  total: number;
  page: number;
  totalPages: number;
};

const LIMIT = 10;

/* ===================== COMPONENT ===================== */

export function UserManagement() {
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<UserFilter>("ALL");
  const [page, setPage] = useState(1);

  /* ===================== FETCH USERS ===================== */

  const { data, isLoading, isError } = useQuery<UsersResponse>({
    queryKey: ["admin-users", page, searchTerm, filter],
    queryFn: async () => {
      const res = await axios.get("/admin/users", {
        params: {
          page,
          limit: LIMIT,
          search: searchTerm || undefined,
          filter: filter !== "ALL" ? filter : undefined,
        },
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  /* ===================== ERROR HANDLING ===================== */

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load users");
    }
  }, [isError]);

  /* ===================== DERIVED DATA ===================== */

  const users = useMemo(() => {
    return (data?.users ?? []).filter((u) => u.role !== UserRole.ADMIN);
  }, [data]);

  const totalPages = data?.totalPages ?? 1;

  /* ===================== BAN / UNBAN (OPTIMISTIC) ===================== */

  const banMutation = useMutation({
    mutationFn: async ({ id, block }: { id: string; block: boolean }) => {
      const res = await axios.patch(
        `/admin/users/${block ? "ban" : "unban"}/${id}`,
      );
      return res.data;
    },

    /* 🔥 Optimistic Update */
    onMutate: async ({ id, block }) => {
      await queryClient.cancelQueries({
        queryKey: ["admin-users"],
      });

      const previousData = queryClient.getQueryData<UsersResponse>([
        "admin-users",
        page,
        searchTerm,
        filter,
      ]);

      queryClient.setQueryData<UsersResponse>(
        ["admin-users", page, searchTerm, filter],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            users: oldData.users.map((user) =>
              user.id === id ? { ...user, isBlocked: block } : user,
            ),
          };
        },
      );

      // Update selected user panel immediately
      if (selectedUser?.id === id) {
        setSelectedUser({
          ...selectedUser,
          isBlocked: block,
        });
      }

      return { previousData };
    },

    /* 🔥 Rollback if error */
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["admin-users", page, searchTerm, filter],
          context.previousData,
        );
      }

      toast.error("Failed to update user");
    },

    onSuccess: () => {
      toast.success("User status updated");
    },
  });

  const handleBanUser = (userId: string, block: boolean) => {
    banMutation.mutate({ id: userId, block });
  };

  /* ===================== COUNTS ===================== */

  const blockedCount = useMemo(
    () => users.filter((u) => u.isBlocked).length,
    [users],
  );

  const unblockedCount = useMemo(
    () => users.filter((u) => !u.isBlocked).length,
    [users],
  );

  const premiumCount = useMemo(
    () => users.filter((u) => u.premium).length,
    [users],
  );

  /* ===================== UI ===================== */

  return (
    <div className="w-full min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">User Management</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT PANEL */}
          <div className="flex-1">
            {/* SEARCH + FILTERS */}
            <div className="bg-[#0A0F2C] rounded-lg p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-[#11193F] border border-gray-700 rounded-md text-white"
                  />
                  <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <UserFilters
                  filter={filter}
                  setFilter={(value) => {
                    setFilter(value);
                    setPage(1);
                  }}
                  blockedCount={blockedCount}
                  unblockedCount={unblockedCount}
                  premiumCount={premiumCount}
                />
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-[#0A0F2C] rounded-lg overflow-hidden">
              {isLoading ? (
                <div className="text-center text-gray-300 p-6">
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <div className="text-center text-gray-400 p-6">
                  No users found
                </div>
              ) : (
                <UserTable
                  users={users}
                  onSelectUser={setSelectedUser}
                  onBanUser={handleBanUser}
                  selectedUserId={selectedUser?.id || ""}
                />
              )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 px-4 py-2 bg-[#0A0F2C] rounded-lg">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-[#11193F] text-white rounded disabled:opacity-40"
                >
                  Prev
                </button>

                <span className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-[#11193F] text-white rounded disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* RIGHT PROFILE */}
          <div className="lg:w-80 mt-6 lg:mt-0">
            {selectedUser ? (
              <UserProfile user={selectedUser} onBanUser={handleBanUser} />
            ) : (
              <div className="bg-[#0A0F2C] rounded-lg p-6 text-center text-gray-400 h-full flex items-center justify-center">
                <p>Select a user to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
