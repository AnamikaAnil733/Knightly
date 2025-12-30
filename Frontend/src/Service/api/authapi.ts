import { AxiosError } from "axios";
import api from "./axios";

export const sendSignupOtp = async (data: {
  displayname: string;
  email: string;
  role: string;
}) => {
  try {
    const response = await api.post("/auth/send-otp", {
      displayname: data.displayname,
      email: data.email,
      role: data.role,
    });
  
    return response.data;
  } catch (error) {
    if(error instanceof AxiosError){
      throw new Error(error.response?.data.message)
    }
  }
  throw new Error("Something went wrong")

};
