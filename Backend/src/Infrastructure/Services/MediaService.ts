import { IMediaService } from "../../Domain/Interface/Service/IMediaService";
import { IStorageService } from "../../Domain/Interface/Service/IS3Service";

export class MediaService implements IMediaService {
  private static readonly DEFAULT_EXPIRATION = 43200; // 12 hours

  constructor(private readonly _storageService: IStorageService) {}


  async resolveSignedUrl(keyOrUrl: string | null | undefined): Promise<string | undefined> {
    if (!keyOrUrl) return undefined;

    let key = keyOrUrl;
    let shouldSign = false;

    if (key.startsWith("http")) {
      if (key.includes("knightly-avatars.s3") || key.includes("s3.amazonaws.com")) {
        try {
          const urlObj = new URL(key);
          key = urlObj.pathname.startsWith("/")
            ? urlObj.pathname.substring(1)
            : urlObj.pathname;
          shouldSign = true;
        } catch (e) {
          console.error("MediaService: Failed to parse legacy URL:", key);
          return keyOrUrl;
        }
      } else {
        return keyOrUrl;
      }
    } else {
      shouldSign = true;
    }

    if (shouldSign) {
      try {
        return await this._storageService.generateSignedGetUrl(
          key,
          MediaService.DEFAULT_EXPIRATION,
        );
      } catch (err) {
        console.error("MediaService: Failed to generate signed URL for key:", key, err);
        return undefined;
      }
    }

    return keyOrUrl;
  }
}
