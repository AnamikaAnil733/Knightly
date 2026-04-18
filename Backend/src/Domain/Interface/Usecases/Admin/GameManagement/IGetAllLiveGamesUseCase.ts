export interface ILiveGameDTO {
  id: string;
  status: string;
  timeControl: string;
  whitePlayer: {
    name: string;
    rating: number;
    avatar: string | null;
  };
  blackPlayer: {
    name: string;
    rating: number;
    avatar: string | null;
  };
  createdAt?: Date;
}

export interface IGetAllLiveGamesUseCase {
  execute(): Promise<ILiveGameDTO[]>;
}
