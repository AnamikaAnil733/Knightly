import { IUser } from "../Types/UserTypes";

const DEFAULT_AVATAR =
  "https://api.dicebear.com/7.x/adventurer/svg?seed=6968895a226ff40d72afb713";

export const getAvatarUrl = (user: IUser | null) => {
  console.log(user);
  if (!user) return DEFAULT_AVATAR;

  //Only use stored S3 avatar
  if (user.avatarUrl && user.avatarUrl.trim() !== "") {
    return user.avatarUrl;
  }

  //Fallback ONLY (no DiceBear)
  return DEFAULT_AVATAR;
};
