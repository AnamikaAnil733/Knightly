export interface ISendFriendRequestUseCase {
  execute(requesterId: string, recipientId: string): Promise<void>;
}
