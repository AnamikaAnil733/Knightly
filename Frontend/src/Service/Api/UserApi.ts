import axios from "./Axios/Useraxios";
import { IUser } from "../../Types/UserTypes";

export const getUserProfile = async (): Promise<IUser> => {
  const res = await axios.get("/user/profile");
  return res.data;
};

export const editUserProfile = async (data: { displayname: string }) => {
  const res = await axios.patch("/user/edit-profile", data);
  return res.data;
};

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const changePasswordApi = async (data: ChangePasswordData) => {
  const res = await axios.patch("/user/change-password", data);
  return res.data;
};
