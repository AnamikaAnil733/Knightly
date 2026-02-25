import axios from "./Axios/Adminaxios";
import { PuzzleFormData } from "../../Components/admin/PuzzleManagement/puzzleModal";


export const createPuzzleApi =async (data:PuzzleFormData) =>{
    const response = await axios.post("/admin/create-puzzles",data);
    return response.data
}

export const getAllPuzzlesApi = async (params?: {
  page?: number
  limit?: number
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Expert'
}) => {
  const response = await axios.get('/admin/puzzles', { params })
  return response.data
}

export const deletePuzzleApi = async (id: string) => {
    const response = await axios.delete(`/admin/delete-puzzle/${id}`);
    return response.data;
  };

export interface EditPuzzleApiInput {
    id: string;
    fen?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Expert';
    moves?: string[];
    isActive?: boolean;
  }

export const editPuzzlesApi = async(params:EditPuzzleApiInput)=>{
    const {id,...body} = params

    const response = await axios.patch(
        `/admin/edit-puzzle/${id}`,
        body,
      );
      return response.data

}