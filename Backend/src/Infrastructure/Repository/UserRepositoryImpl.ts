import UserEntity from "../../Domain/Entity/UserEntity";
import { User } from "../../Domain/Interface/User";
import { IUserRepository } from "../../Domain/Interface/UserRepository";
import { UserModel } from "../database/model/UserModel";
import { UserMapper } from "../../Application/mapper/userMapper";

export class UserRepositoryImpl implements IUserRepository {
 
  async create(user: UserEntity): Promise<UserEntity> {
    const userData = UserMapper.toMongo(user);
    const savedUser = await UserModel.create(userData);
    return new UserEntity(savedUser.toObject());
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const data = await UserModel.findOne({ email }).lean();
    return data ? new UserEntity(data) : null;
  }


  async findById(id: string): Promise<UserEntity | null> {
    const data = await UserModel.findById(id).lean();
    return data ? new UserEntity(data) : null; 
  }
}
