export interface IGetPuzzleSolveCountUseCase {
    execute(userId: string): Promise<number>;
}
