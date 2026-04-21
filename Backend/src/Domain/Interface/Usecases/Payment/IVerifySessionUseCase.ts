export default interface IVerifySessionUseCase {
  execute(sessionId: string, userId: string): Promise<{ premium: boolean }>;
}

