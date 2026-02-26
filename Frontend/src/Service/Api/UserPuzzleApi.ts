import axios from "./Axios/Useraxios";

export const fetchPuzzleByDifficulty = async (difficulty: string) => {
  const response = await axios.get(`/user/puzzles/difficulty/${difficulty}`);
  return response.data;
};

export const validatePuzzleMove = async (puzzleId: string, move: string) => {
  const response = await axios.post(`/user/puzzles/${puzzleId}/validate`, {
    move,
  });
  return response.data;
};
