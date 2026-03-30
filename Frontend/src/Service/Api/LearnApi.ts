import axios from "./Axios/Useraxios";

export const getLessons = async (params?: { category?: string; difficulty?: string }) => {
  const response = await axios.get("/user/learn", { params });
  return response.data;
};

export const getLessonById = async (id: string) => {
  const response = await axios.get(`/user/learn/${id}`);
  return response.data;
};
