import { User } from "./User";

export interface IUserRepository {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  // update(id: string, data: Partial<User>): Promise<User>;  // FIXED
  // delete(id: string): Promise<boolean>; // OR Promise<void>
}
