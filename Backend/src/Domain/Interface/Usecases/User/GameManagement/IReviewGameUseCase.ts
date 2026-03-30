export interface ReviewMoveAnalysis {
    evaluation: { score: number, mate: number | null, bestMove: string };
    classification: "BEST" | "EXCELLENT" | "GOOD" | "INACCURACY" | "MISTAKE" | "BLUNDER" | "BOOK";
    description: string;
    move: any;
}

export interface IReviewGameUseCase {
    execute(gameId: string): Promise<ReviewMoveAnalysis[]>;
}
