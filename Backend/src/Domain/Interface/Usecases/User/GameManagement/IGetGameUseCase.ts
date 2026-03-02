import { GameOutputDTO } from "../../../../DTOs/UserDTOs";

export interface IGetGameUseCase{
    execute(gameId:string):Promise<GameOutputDTO>
}
