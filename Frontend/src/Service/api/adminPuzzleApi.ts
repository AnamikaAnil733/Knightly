import axios from "./axios/Adminaxios";
import { PuzzleFormData } from "../../components/admin/PuzzleManagement/puzzleModal";


export const createPuzzleApi =async (data:PuzzleFormData) =>{
    const response = await axios.post("/admin/create-puzzles",data);
    return response.data
}

export const getAllPuzzlesApi= async (params?:{
    page?:number;
    limit?:number;
    difficulty?:'Easy'|'Medium'|'Hard'|'Expert'
})=>{
    const response = await axios.get("/admin/puzzles",{params})
    return response.data
}

export const deletePuzzleApi = async ()=>{
    
}