export interface IAcceptFriendRequestUseCase {
  execute(requesterId: string, recipientId: string): Promise<void>;
}
