export interface IGetCoverUploadUrlUseCase {
  execute(input: {
    userId: string;
    contentType: string;
  }): Promise<{ uploadUrl: string; key: string }>;
}
