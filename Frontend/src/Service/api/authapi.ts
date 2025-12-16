import api from "./axios";

export const sendSignupOtp = async (data: {
  displayname: string;
  email: string;
  role: string;
}) => {
  const response = await api.post("/auth/send-otp", {
    displayname: data.displayname,
    email: data.email,
    role: data.role,
  });

  return response.data;
};
