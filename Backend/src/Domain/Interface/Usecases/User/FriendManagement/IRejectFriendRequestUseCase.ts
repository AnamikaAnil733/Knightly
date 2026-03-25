export interface IRejectFriendRequestUseCase {
  execute(requesterId: string, recipientId: string): Promise<void>;
}
