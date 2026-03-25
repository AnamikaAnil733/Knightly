export interface IUnblockUserUseCase {
  execute(requesterId: string, recipientId: string): Promise<void>;
}
