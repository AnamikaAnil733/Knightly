import axios from "./Axios/Useraxios"

export const getAvatarUploadUrl = async (contentType: string) => {
  const res = await axios.post("/user/avatar/upload-avatar", {
    params: { contentType },
  });
  return res.data as {
    uploadUrl: string;
    avatarUrl: string;
  };
};

export const updateAvatar = async (avatarUrl: string) => {
  await axios.patch("/user/update-avatar", { avatarUrl });
};
