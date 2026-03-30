import axios from "./Axios/Useraxios";

export const sendFriendRequest = async (recipientId: string) => {
  const response = await axios.post("/user/friends/request", { recipientId });
  return response.data;
};

export const acceptFriendRequest = async (requesterId: string) => {
  const response = await axios.post("/user/friends/accept", { requesterId });
  return response.data;
};

export const rejectFriendRequest = async (requesterId: string) => {
  const response = await axios.post("/user/friends/reject", { requesterId });
  return response.data;
};

export const unfriendUser = async (friendId: string) => {
  const response = await axios.post("/user/friends/unfriend", { friendId });
  return response.data;
};

export const blockUser = async (friendId: string) => {
  const response = await axios.post("/user/friends/block", { friendId });
  return response.data;
};

export const unblockUser = async (friendId: string) => {
  const response = await axios.post("/user/friends/unblock", { friendId });
  return response.data;
};

export const getFriendsList = async () => {
  const response = await axios.get("/user/friends");
  return response.data;
};

export const searchUsers = async (query: string) => {
  const response = await axios.get(`/user/friends/search?query=${query}`);
  return response.data;
};

export const getPendingRequests = async () => {
  const response = await axios.get("/user/friends/pending");
  return response.data;
};
