import { IMediaService } from "../../Domain/Interface/Service/IMediaService";
import { IStorageService } from "../../Domain/Interface/Service/IS3Service";

export class MediaService implements IMediaService {
  private static readonly DEFAULT_EXPIRATION = 43200; // 12 hours

  constructor(private readonly _storageService: IStorageService) {}

  /**
   * Resolves a key or a legacy URL into a signed GET URL.
   */
  async resolveSignedUrl(keyOrUrl: string | null | undefined): Promise<string | undefined> {
    if (!keyOrUrl) return undefined;

    let key = keyOrUrl;
    let shouldSign = false;

    if (key.startsWith("http")) {
      // Handle legacy full URLs by extracting the key
      // Pattern: https://knightly-avatars.s3.amazonaws.com/avatars/user-id/key
      if (key.includes("knightly-avatars.s3") || key.includes("s3.amazonaws.com")) {
        try {
          const urlObj = new URL(key);
          // Pathname like /avatars/user-id/avatar.svg
          key = urlObj.pathname.startsWith("/")
            ? urlObj.pathname.substring(1)
            : urlObj.pathname;
          shouldSign = true;
        } catch (e) {
          console.error("MediaService: Failed to parse legacy URL:", key);
          return keyOrUrl; // Return as is if it fails parsing but was a URL
        }
      } else {
        // External URL (like DiceBear or Gravatar)
        return keyOrUrl;
      }
    } else {
      // It's already a key
      shouldSign = true;
    }

    if (shouldSign) {
      try {
        return await this._storageService.generateSignedGetUrl(
          key,
          MediaService.DEFAULT_EXPIRATION
        );
      } catch (err) {
        console.error("MediaService: Failed to generate signed URL for key:", key, err);
        return undefined;
      }
    }

    return keyOrUrl;
  }
}
