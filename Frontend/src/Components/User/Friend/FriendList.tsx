import React, { useEffect, useState } from "react";
import {
  getFriendsList,
  unfriendUser,
  blockUser,
  unblockUser,
} from "../../../Service/Api/FriendApi";
import { socket } from "../../../Service/Socket";
import {
  User,
  Swords,
  UserPlus,
  UserMinus,
  Ban,
  Unlock,
  Flag,
} from "lucide-react";
import { ReportUserModal } from "../Common/ReportUserModal";
import toast from "react-hot-toast";
import { IFriend } from "../../../Types/Friend";

interface FriendListProps {
  userId?: string;
}

const FriendList: React.FC<FriendListProps> = ({ userId }) => {
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedFriendForReport, setSelectedFriendForReport] =
    useState<IFriend | null>(null);

  useEffect(() => {
    fetchFriends();

    socket.on("friend_offline", () => {
      toast.error("Friend is offline");
    });

    // Refresh when a friend request is accepted (we could add a specific event if needed)
    // For now, let's listen for "receive_friend_request" as a hint or a generic "friendship_changed"
    socket.on("friendship_changed", () => {
      fetchFriends();
    });

    return () => {
      socket.off("friend_offline");
      socket.off("friendship_changed");
    };
  }, []);

  const fetchFriends = async () => {
    try {
      const data = await getFriendsList();
      setFriends(data.friends || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedFormat, setSelectedFormat] = useState("5+0");
  const [isPublic, setIsPublic] = useState(false);

  const inviteFriend = (friendId: string, senderId: string | undefined) => {
    const finalSenderId =
      senderId ||
      (window as Window & typeof globalThis & { userId?: string }).userId;
    if (!finalSenderId) {
      toast.error("Authentication error. Please refresh.");
      return;
    }
    socket.emit("invite_friend", {
      recipientId: friendId,
      senderId: finalSenderId,
      senderName: localStorage.getItem("displayname") || "A friend",
      gameFormat: selectedFormat,
      isPublic: isPublic,
    });
    toast.success(`Invite sent (${selectedFormat})!`);
  };

  const handleUnfriend = async (friendId: string) => {
    try {
      await unfriendUser(friendId);
      toast.success("User unfriended");
      socket.emit("friendship_action", { targetUserId: friendId });
      fetchFriends();
    } catch (err: unknown) {
      const errorResponse = err as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        err instanceof Error
          ? errorResponse.response?.data?.message || err.message
          : "Failed to unfriend user";
      toast.error(errorMessage);
    }
  };

  const handleBlock = async (friendId: string) => {
    try {
      await blockUser(friendId);
      toast.success("User blocked");
      socket.emit("friendship_action", { targetUserId: friendId });
      fetchFriends();
    } catch (err: unknown) {
      const errorResponse = err as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        err instanceof Error
          ? errorResponse.response?.data?.message || err.message
          : "Failed to block user";
      toast.error(errorMessage);
    }
  };

  const handleUnblock = async (friendId: string) => {
    try {
      await unblockUser(friendId);
      toast.success("User unblocked");
      socket.emit("friendship_action", { targetUserId: friendId });
      fetchFriends();
    } catch (err: unknown) {
      const errorResponse = err as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        err instanceof Error
          ? errorResponse.response?.data?.message || err.message
          : "Failed to unblock user";
      toast.error(errorMessage);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState("Blitz");

  const formatCategories = [
    { label: "Bullet", options: ["1+0", "2+1"] },
    { label: "Blitz", options: ["3+0", "3+2", "5+0", "5+3"] },
    { label: "Rapid", options: ["10+0", "15+10", "20+0", "30+0"] },
    { label: "Classical", options: ["30+10", "45+0", "60+0", "45+15"] },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD166]"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="bg-white/5 p-6 rounded-3xl border border-white/5 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
            <User className="w-6 h-6 text-[#FFD166]" />
            Your Friends
          </h2>

          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
            <span className="text-xs font-bold text-[#94A3B8]">
              Public Match
            </span>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`w-10 h-5 rounded-full transition-all relative ${
                isPublic ? "bg-[#FFD166]" : "bg-white/10"
              }`}
            >
              <div
                className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
                  isPublic ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {formatCategories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => {
                setSelectedCategory(cat.label);
                setSelectedFormat(cat.options[0]);
              }}
              className={`px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat.label
                  ? "bg-[#FFD166] text-[#0A0F2C] shadow-[0_0_20px_rgba(255,209,102,0.3)]"
                  : "bg-white/5 text-[#94A3B8] hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Format Options */}
        <div className="flex flex-wrap gap-2 p-2 bg-[#0A0F2C] rounded-2xl border border-white/5">
          {formatCategories
            .find((c) => c.label === selectedCategory)
            ?.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedFormat(opt)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  selectedFormat === opt
                    ? "bg-white/10 text-[#FFD166] border border-[#FFD166]/30"
                    : "text-[#64748B] hover:text-[#94A3B8]"
                }`}
              >
                {opt}
              </button>
            ))}
        </div>
      </div>

      {friends.length === 0 ? (
        <div className="bg-[#11193F] border border-white/5 rounded-xl p-8 text-center">
          <UserPlus className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-[#9ca3af]">No friends yet. Search and add some!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className={`bg-[#11193F] border border-white/5 p-4 rounded-xl flex items-center justify-between group transition-all shadow-lg ${
                friend.status === "BLOCKED"
                  ? "opacity-60 grayscale hover:opacity-80"
                  : "hover:border-[#FFD166]/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      friend.avatarUrl ||
                      `https://api.dicebear.com/7.x/bottts/svg?seed=${friend.displayname}`
                    }
                    alt={friend.displayname}
                    className="w-12 h-12 rounded-full border-2 border-white/10"
                  />
                  {friend.status !== "BLOCKED" && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#11193F] rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3
                    className={`font-semibold ${friend.status === "BLOCKED" ? "text-[#B3B3B3] line-through decoration-[#EF476F]/50" : "text-white"}`}
                  >
                    {friend.displayname}
                  </h3>
                  {friend.status === "BLOCKED" ? (
                    <span className="text-[#EF476F] text-[10px] font-black tracking-widest uppercase bg-[#EF476F]/10 px-2 py-0.5 rounded-md mt-1 inline-block">
                      BLOCKED
                    </span>
                  ) : (
                    <p className="text-[#9ca3af] text-xs">Online</p>
                  )}
                </div>
              </div>

              {friend.status === "BLOCKED" ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUnblock(friend.id)}
                    title="Unblock User"
                    className="p-2 rounded-lg bg-[#EF476F]/10 text-[#EF476F] hover:bg-[#EF476F] hover:text-[#0A0F2C] transition-all flex items-center gap-2 text-sm font-bold"
                  >
                    <Unlock className="w-4 h-4" />
                    Unblock
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      inviteFriend(
                        friend.id,
                        userId ||
                          (
                            window as Window &
                              typeof globalThis & {
                                userId?: string;
                              }
                          ).userId,
                      )
                    }
                    className="p-2 rounded-lg bg-[#FFD166]/10 text-[#FFD166] hover:bg-[#FFD166] hover:text-[#0A0F2C] transition-all flex items-center gap-2 text-sm font-bold"
                  >
                    <Swords className="w-4 h-4" />
                    Invite
                  </button>
                  <button
                    onClick={() => handleUnfriend(friend.id)}
                    title="Unfriend User"
                    className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-[#EF476F] hover:bg-[#EF476F]/20 transition-all"
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleBlock(friend.id)}
                    title="Block User"
                    className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-[#EF476F] hover:bg-[#EF476F]/20 transition-all"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFriendForReport(friend);
                      setIsReportModalOpen(true);
                    }}
                    title="Report User"
                    className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-red-500 hover:bg-red-500/20 transition-all"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedFriendForReport && (
        <ReportUserModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportedId={selectedFriendForReport.id}
          reportedName={selectedFriendForReport.displayname}
        />
      )}
    </div>
  );
};

export default FriendList;
