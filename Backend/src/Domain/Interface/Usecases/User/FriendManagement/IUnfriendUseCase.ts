export interface IUnfriendUseCase {
  execute(userId1: string, userId2: string): Promise<void>;
}
