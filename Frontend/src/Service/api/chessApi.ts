import axios from "./axios/Useraxios";


export const createGameUrl = async ()=>{
    const res = await axios.post("/user/create-game")
    console.log(res)
    return res.data.data.gameId
}

export const getGame = async (gameId:string)=>{
    const res = await axios.get(`/user/games/${gameId}`)
    console.log(res.data)
  return res.data
}

export const getLegalMoves = async (gameId:string,row:number,col:number):Promise<{ row: number; col: number; type:"NORMAL" |"EN_PASSANT" }[]>=>{
    const res = await axios.get(`/user/games/${gameId}/legal-moves`,
        {params:{row,col}}
    );
    return res.data.moves;
}


export const makeMove = async (
    gameId:string,
    from:{row:number,col:number},
    to:{row:number,col:number}
):Promise<void>=>{
await axios.post(`/user/games/${gameId}/move`,{from,to})

}