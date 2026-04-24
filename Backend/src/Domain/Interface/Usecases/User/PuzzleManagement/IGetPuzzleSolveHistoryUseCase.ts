export interface IGetPuzzleSolveHistoryUseCase {
  execute(userId: string): Promise<Date[]>;
}
