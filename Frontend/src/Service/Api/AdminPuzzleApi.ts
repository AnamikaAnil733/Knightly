import axios from "./Axios/Adminaxios";
import { PuzzleFormData } from "../../Components/Admin/PuzzleManagement/PuzzleModal";

export const createPuzzleApi = async (data: PuzzleFormData) => {
  const response = await axios.post("/admin/create-puzzles", data);
  return response.data;
};

export const getAllPuzzlesApi = async (params?: {
  page?: number;
  limit?: number;
  difficulty?: "Easy" | "Medium" | "Hard" | "Expert";
}) => {
  const response = await axios.get("/admin/puzzles", { params });
  return response.data;
};

export const deletePuzzleApi = async (id: string) => {
  const response = await axios.delete(`/admin/delete-puzzle/${id}`);
  return response.data;
};

export interface EditPuzzleApiInput {
  id: string;
  fen?: string;
  difficulty?: "Easy" | "Medium" | "Hard" | "Expert";
  moves?: string[];
  description?: string;
  isActive?: boolean;
}

export const editPuzzlesApi = async (params: EditPuzzleApiInput) => {
  const { id, ...body } = params;

  const response = await axios.patch(`/admin/edit-puzzle/${id}`, body);
  return response.data;
};

export const syncLichessDailyPuzzleApi = async () => {
  const response = await axios.post("/admin/sync-lichess-puzzle");
  return response.data;
};

export const generatePuzzlesFromGameApi = async (gameId?: string) => {
  const url = gameId
    ? `/admin/generate-puzzle-from-game/${gameId}`
    : "/admin/generate-ai-puzzles";
  const response = await axios.post(url);
  return response.data;
};
