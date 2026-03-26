import { EPuzzle } from "../../Entity/Puzzle";

export interface IPuzzleGeneratorService {
    generateFromGame(history: any[]): Promise<EPuzzle[]>;
    fetchLichessDaily(): Promise<EPuzzle>;
}
