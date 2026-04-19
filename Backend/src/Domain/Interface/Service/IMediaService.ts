export interface IMediaService {
  resolveSignedUrl(keyOrUrl: string | null | undefined): Promise<string | undefined>;
}
