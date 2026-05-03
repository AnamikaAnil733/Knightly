import { ILiveGameDTO } from "../../Admin/GameManagement/IGetAllLiveGamesUseCase";

export interface IGetLivePublicGamesUseCase {
  execute(): Promise<ILiveGameDTO[]>;
}
