import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AvatarURLtypes } from "../../Domain/Types/AvatarURLtypes";

import { IStorageService } from "../../Domain/Interface/service/IS3Service";

export class S3StorageService implements IStorageService {
  private _s3: S3Client;

  constructor() {
    this._s3 = new S3Client({
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

    const uploadUrl = await getSignedUrl(this._s3, command, {
      expiresIn: 60,
    });

    return { uploadUrl, key };
  }

  async uploadObject({
    key,
    body,
    contentType,
  }: {
    key: string;
    body: Buffer;
    contentType: string;
  }): Promise<string> {
    await this._s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
        Body: body,
        ContentType: contentType,
      })
    );

    return key;
  }

  async generateSignedGetUrl(key: string, expiresIn = 300): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
    });
    return getSignedUrl(this._s3, command, { expiresIn });
  }
}
