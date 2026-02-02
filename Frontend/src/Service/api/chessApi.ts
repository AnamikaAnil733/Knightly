import axios from "./axios/Useraxios";
// import { BoardGrid } from "../../types/chess";


export const createGameUrl = async ()=>{
    const res = await axios.post("/user/create-game")
    console.log(res)
    return res.data.data.gameId
}

export const getGame = async (gameId:string)=>{
    const res = await axios.get(`/user/games/${gameId}`)
    console.log(res)
  return res.data
}