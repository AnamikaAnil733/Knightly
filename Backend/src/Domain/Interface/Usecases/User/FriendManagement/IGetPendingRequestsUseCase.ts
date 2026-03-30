import { PendingRequestDTO } from "../../../../DTOs/UserDTOs";

export interface IGetPendingRequestsUseCase {
  execute(userId: string): Promise<PendingRequestDTO[]>;
}
