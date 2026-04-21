export interface ILiveGameDTO {
  id: string;
  status: string;
  timeControl: string;
  whitePlayer: {
    id: string;
    name: string;
    rating: number;
    avatar: string | null;
  };
  blackPlayer: {
    id: string;
    name: string;
    rating: number;
    avatar: string | null;
  };
  createdAt?: Date;
}

export interface IGetAllLiveGamesUseCase {
  execute(): Promise<ILiveGameDTO[]>;
}
