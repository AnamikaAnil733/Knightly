import { AvatarURLtypes } from "../../Types/AvatarURLtypes";

export interface IStorageService {
    generateAvatarUploadUrl(
      key: string,
      contentType: string
    ): Promise<AvatarURLtypes>;

    generateUploadUrl(
      key: string,
      contentType: string
    ): Promise<{ uploadUrl: string; key: string }>;

    uploadObject(input: {
      key: string;
      body: Buffer;
      contentType: string;
    }): Promise<string>;

    generateSignedGetUrl(
      key: string,
      expiresIn: number
    ): Promise<string>;
  }
