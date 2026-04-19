export interface IMediaService {
  /**
   * Resolves a key or a legacy URL into a signed GET URL.
   * Handles legacy S3 URLs by extracting the key.
   * 
   * @param keyOrUrl The S3 key or a legacy full URL
   * @returns A signed URL or null if the input is invalid
   */
  resolveSignedUrl(keyOrUrl: string | null | undefined): Promise<string | undefined>;
}
