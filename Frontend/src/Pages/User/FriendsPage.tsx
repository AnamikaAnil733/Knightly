import React, { useState, useEffect } from "react";
import { Navbar } from "../../Components/User/Common/Navbar";
import { Footer } from "../../Components/User/Common/Footer";
import FriendList from "../../Components/User/FriendList";
import { Users, UserPlus, Search, Clock } from "lucide-react";
import { sendFriendRequest, searchUsers, getPendingRequests, acceptFriendRequest } from "../../Service/Api/FriendApi";
import toast from "react-hot-toast";

import { RootState } from "../../Store/Store";
import { useSelector } from "react-redux";

const FriendsPage: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.userAuth.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"friends" | "pending">("friends");

  useEffect(() => {
    loadPendingRequests();

    const socket = (window as any).socket;
    if (socket) {
        socket.on("receive_friend_request", () => {
            loadPendingRequests();
        });
    }

    return () => {
        if (socket) {
            socket.off("receive_friend_request");
        }
    };
  }, []);

  const loadPendingRequests = async () => {
    try {
        const data = await getPendingRequests();
        setPendingRequests(data.requests || []);
    } catch (err) {
        console.error("Failed to load pending requests:", err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
    }
    
    setIsSearching(true);
    try {
        const data = await searchUsers(searchTerm);
        setSearchResults(data.users || []);
    } catch (err) {
        console.error("Search failed:", err);
        toast.error("Search failed");
    } finally {
        setIsSearching(false);
    }
  };

  const handleAddFriend = async (id: string, name: string) => {
    try {
        await sendFriendRequest(id);
        toast.success(`Friend request sent to ${name}!`);
        
        // Emit socket event for real-time notification
        const socket = (window as any).socket;
        if (socket) {
            socket.emit("send_friend_request", { 
                recipientId: id, 
                senderName: localStorage.getItem("displayname") || "Someone" 
            });
        }
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to send request");
    }
  };

  const handleAcceptRequest = async (requesterId: string) => {
    try {
        await acceptFriendRequest(requesterId);
        toast.success("Friend request accepted!");
        
        // Emit socket event for real-time notification to both users
        const socket = (window as any).socket;
        if (socket) {
            socket.emit("accept_friend_request", { requesterId });
        }

        loadPendingRequests();
    } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to accept request");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F2C] flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <h1 className="text-3xl font-black text-white flex items-center gap-3">
                <Users className="w-8 h-8 text-[#FFD166]" />
                Friends
              </h1>
              <p className="text-[#9ca3af] mt-1">Manage your friends and challenge them to a match.</p>
            </div>
          </div>
            
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-white/5">
              <button 
                onClick={() => setActiveTab("friends")}
                className={`pb-4 px-2 font-bold transition-all ${activeTab === "friends" ? "text-[#FFD166] border-b-2 border-[#FFD166]" : "text-[#9ca3af] hover:text-white"}`}
              >
                  Friends
              </button>
              <button 
                onClick={() => setActiveTab("pending")}
                className={`pb-4 px-2 font-bold transition-all flex items-center gap-2 ${activeTab === "pending" ? "text-[#FFD166] border-b-2 border-[#FFD166]" : "text-[#9ca3af] hover:text-white"}`}
              >
                  Pending Requests
                  {pendingRequests.length > 0 && (
                      <span className="bg-[#EF476F] text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingRequests.length}</span>
                  )}
              </button>
          </div>

          {activeTab === "friends" ? (
            <>
                {/* Search Bar */}
                <div className="mb-8">
                    <form onSubmit={handleSearch} className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af] group-focus-within:text-[#FFD166] transition-colors" />
                        <input
                        type="text"
                        placeholder="Search users by display name..."
                        className="w-full bg-[#11193F] border-2 border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-[#4b5563] focus:outline-none focus:border-[#FFD166]/50 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button 
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#FFD166] text-[#0A0F2C] rounded-xl font-bold text-sm hover:bg-[#F4C14D] transition-all transform hover:scale-105"
                        disabled={isSearching}
                        >
                        {isSearching ? "Searching..." : "Search"}
                        </button>
                    </form>
                </div>

                {/* Search Results */}
                {searchTerm && !isSearching && searchResults.length > 0 && (
                    <div className="bg-[#11193F]/50 border border-dashed border-[#FFD166]/20 rounded-2xl p-6 mb-8">
                        <p className="text-[#9ca3af] text-sm mb-4">Search results for "{searchTerm}"</p>
                        <div className="space-y-3">
                            {searchResults.map((user) => (
                                <div key={user.id} className="flex items-center justify-between bg-[#0A0F2C] p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.displayname}`} className="w-10 h-10 rounded-full" alt="" />
                                        <span className="text-white font-bold">{user.displayname}</span>
                                    </div>
                                    <button 
                                    onClick={() => handleAddFriend(user.id, user.displayname)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#FFD166] text-[#0A0F2C] rounded-lg font-bold text-sm hover:bg-[#F4C14D] transition-colors"
                                    >
                                        <UserPlus className="w-4 h-4" strokeWidth={3} />
                                        Add Friend
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {searchTerm && !isSearching && searchResults.length === 0 && (
                    <div className="text-center py-10 bg-[#11193F]/30 rounded-2xl border border-dashed border-white/5 mb-8">
                        <p className="text-[#9ca3af]">No users found matching "{searchTerm}"</p>
                    </div>
                )}

                {/* Main Friends List */}
                <div className="space-y-6">
                    {pendingRequests.length > 0 && (
                        <div className="bg-[#EF476F]/10 border border-[#EF476F]/30 rounded-2xl p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-[#EF476F] font-black flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    New Friend Requests
                                </h3>
                                <span className="bg-[#EF476F] text-white text-[10px] px-2 py-1 rounded-full font-bold">
                                    {pendingRequests.length} Pending
                                </span>
                            </div>
                            <div className="space-y-3">
                                {pendingRequests.map((req) => (
                                    <div key={req.id} className="flex items-center justify-between bg-[#11193F] p-4 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <img src={req.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${req.displayname}`} className="w-10 h-10 rounded-full" alt="" />
                                            <div>
                                                <p className="text-white font-bold text-sm">{req.displayname}</p>
                                                <p className="text-[#9ca3af] text-[10px]">Wants to connect</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleAcceptRequest(req.id)}
                                                className="px-3 py-1.5 bg-[#06D6A0] text-[#0A0F2C] rounded-lg font-bold text-xs hover:opacity-90 transition-all"
                                            >
                                                Accept
                                            </button>
                                            <button className="px-3 py-1.5 bg-white/5 text-[#9ca3af] rounded-lg font-bold text-xs hover:bg-white/10 transition-all">
                                                Ignore
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <FriendList userId={(currentUser as any)?.id || (currentUser as any)?._id} />
                </div>
            </>
          ) : (
            /* Pending Requests Tab */
            <div className="space-y-4">
                {pendingRequests.length === 0 ? (
                    <div className="text-center py-20 bg-[#11193F]/30 rounded-3xl border border-dashed border-white/5">
                        <p className="text-[#9ca3af]">No pending friend requests</p>
                    </div>
                ) : (
                    pendingRequests.map((req) => (
                        <div key={req.id} className="flex items-center justify-between bg-[#11193F] p-4 rounded-2xl border border-white/5 hover:border-[#FFD166]/30 transition-all">
                            <div className="flex items-center gap-4">
                                <img src={req.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${req.displayname}`} className="w-12 h-12 rounded-full border-2 border-[#FFD166]/20" alt="" />
                                <div>
                                    <p className="text-white font-bold">{req.displayname}</p>
                                    <p className="text-[#9ca3af] text-xs">Wants to be your friend</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleAcceptRequest(req.id)}
                                    className="px-4 py-2 bg-[#06D6A0] text-[#0A0F2C] rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                                >
                                    Accept
                                </button>
                                <button className="px-4 py-2 bg-white/5 text-[#9ca3af] rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
                                    Ignore
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FriendsPage;
