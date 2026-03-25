import axios from "./Axios/Useraxios";

export const sendFriendRequest = async (recipientId: string) => {
  const response = await axios.post("/user/friends/request", { recipientId });
  return response.data;
};

export const acceptFriendRequest = async (requesterId: string) => {
  const response = await axios.post("/user/friends/accept", { requesterId });
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
