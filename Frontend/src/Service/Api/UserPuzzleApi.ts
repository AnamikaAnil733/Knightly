import axios from "./Axios/Useraxios";
import { UserPuzzleResponseDTO } from "../../Types/PuzzleTypes";

export const fetchPuzzleByDifficulty = async (difficulty: string) => {
  const response = await axios.get(`/user/puzzles/difficulty/${difficulty}`);
  return response.data;
};

export const validatePuzzleMove = async (
  puzzleId: string,
  move: string,
  moveIndex: number,
) => {
  const response = await axios.post(`/user/puzzles/${puzzleId}/validate`, {
    move,
    moveIndex,
  });
  return response.data;
};
export const getSolveCount = async (): Promise<{
  success: boolean;
  today: number;
  total: number;
}> => {
  const response = await axios.get("/user/puzzles/solve-count");
  return response.data;
};

export const fetchDailyPuzzle = async (): Promise<UserPuzzleResponseDTO> => {
  const response = await axios.get("/user/puzzles/daily");
  return response.data;
};

export const fetchSolveHistory = async (): Promise<{
  success: boolean;
  history: string[];
}> => {
  const response = await axios.get("/user/puzzles/history");
  return response.data;
};
