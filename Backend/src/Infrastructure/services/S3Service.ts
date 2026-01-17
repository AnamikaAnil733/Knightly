import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { IStorageService } from "../../Domain/Interface/service/S3Service";
import { AvatarURLtypes } from "../../Domain/Types/avatarURLtypes";

export class S3StorageService implements IStorageService {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async generateAvatarUploadUrl(
    key: string,
    contentType: string
  ): Promise<AvatarURLtypes> {
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 60,
    });

    const avatarUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return { uploadUrl, avatarUrl };
  }
}
