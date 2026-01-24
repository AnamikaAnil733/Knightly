import axios from "./axios/Adminaxios";
import { PuzzleFormData } from "../../components/admin/PuzzleManagement/puzzleModal";


export const createPuzzleApi =async (data:PuzzleFormData) =>{
    const response = await axios.post("/admin/create-puzzles",data);
    return response.data
}