export interface IGetPuzzleSolveCountUseCase {
    execute(userId: string): Promise<{ today: number; total: number }>;
}
