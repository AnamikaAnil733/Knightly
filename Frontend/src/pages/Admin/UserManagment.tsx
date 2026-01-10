import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { SearchIcon } from "lucide-react";

import axios from "../../Service/api/axios";
import { UserTable } from "../../components/admin/UserManagment/UserTable";
import { UserProfile } from "../../components/admin/UserManagment/UserProfile";
import { UserFilters } from "../../components/admin/UserManagment/UserFilters";

/* ===================== TYPES ===================== */

export interface AdminUser {
  id: string;
  displayname: string;
  email: string;
  role: string;
  isBlocked: boolean;
  isNewUser: boolean;
  createdAt?: string;
}

interface Filters {
  blocked: boolean;
  newUser: boolean;
}

/* ===================== COMPONENT ===================== */

export function UserManagment() {
  /* -------- UI STATE (NOT DERIVED) -------- */
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    blocked: false,
    newUser: false,
  });

  /* ===================== FETCH USERS ===================== */

  const {
    data: users = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axios.get("/admin/users");
      return res.data.users;
    },
  });

  if (isError) {
    toast.error("Failed to load users");
  }

  /* ===================== BAN / UNBAN ===================== */

  const banMutation = useMutation({
    mutationFn: async ({ id, block }: { id: string; block: boolean }) =>
      axios.patch(`/admin/${block ? "ban" : "unban"}/${id}`),
    onSuccess: () => {
      toast.success("User status updated");
      refetch();
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  const handleBanUser = (userId: string, block: boolean) => {
    banMutation.mutate({ id: userId, block });

    if (selectedUser?.id === userId) {
      setSelectedUser({ ...selectedUser, isBlocked: block });
    }
  };

  /* ===================== DERIVED DATA ===================== */

  const blockedCount = useMemo(
    () => users.filter((u) => u.isBlocked).length,
    [users]
  );

  const newUserCount = useMemo(
    () => users.filter((u) => u.isNewUser).length,
    [users]
  );

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (filters.blocked) {
      result = result.filter((u) => u.isBlocked);
    }

    if (filters.newUser) {
      result = result.filter((u) => u.isNewUser);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          (u.displayname?.toLowerCase().includes(lower) ?? false) ||
          (u.email?.toLowerCase().includes(lower) ?? false)
      );
    }

    return result;
  }, [users, filters, searchTerm]);

  /* ===================== UI ===================== */

  return (
    <div className="w-full min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          User Management
        </h1>

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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#11193F] border border-gray-700 rounded-md text-white focus:outline-none"
                  />
                  <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <UserFilters
                  filters={filters}
                  setFilters={setFilters}
                  blockedCount={blockedCount}
                  newUserCount={newUserCount}
                />
              </div>
            </div>

            {/* TABLE / EMPTY STATE */}
            <div className="bg-[#0A0F2C] rounded-lg overflow-hidden">
              {isLoading ? (
                <div className="text-center text-gray-300 p-6">
                  Loading users...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center text-gray-400 p-6 space-y-2">
                  <p className="text-lg font-medium">
                    {searchTerm || filters.blocked || filters.newUser
                      ? "No users found matching your filters"
                      : "No users available"}
                  </p>

                  {(searchTerm || filters.blocked || filters.newUser) && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilters({ blocked: false, newUser: false });
                      }}
                      className="text-sm text-[#6B2EFF] hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <UserTable
                  users={filteredUsers}
                  onSelectUser={setSelectedUser}
                  onBanUser={handleBanUser}
                  selectedUserId={selectedUser?.id || ""}
                />
              )}
            </div>
          </div>

          {/* RIGHT PROFILE */}
          <div className="lg:w-80 mt-6 lg:mt-0">
            {selectedUser ? (
              <UserProfile
                user={selectedUser}
                onBanUser={handleBanUser}
              />
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
