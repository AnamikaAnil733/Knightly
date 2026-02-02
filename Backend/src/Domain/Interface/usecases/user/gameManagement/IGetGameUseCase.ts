import { GameOutputDTO } from "../../../../DTOs/userDTOs"

export interface IGetGameUseCase{
    execute(gameId:string):Promise<GameOutputDTO>
}