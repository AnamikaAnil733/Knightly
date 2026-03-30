export interface IBlockUserUseCase {
  execute(requesterId: string, recipientId: string): Promise<void>;
}
