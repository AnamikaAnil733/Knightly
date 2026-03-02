import { BaseRepository } from "./BaseRepository";
import { authModel } from "../Database/Model/Authmodel";
import { AuthMapper } from "../../Application/Mapper/AuthMapper";
import EAuth from "../../Domain/Entity/Auth";
import { AuthSchemaType } from "../Database/Schema/AuthSchema";
import {IUserRepository} from "../../Domain/Interface/Repositories/IUserRepository";



export class AuthRepository
  extends BaseRepository<EAuth, AuthSchemaType>
  implements IUserRepository
{
  constructor() {
    super(authModel, AuthMapper);
  }

  async findByEmail(email: string): Promise<EAuth | null> {
    const doc = await this.model.findOne({ email }).exec();
    return doc ? this.mapper.toEntityFromDocument(doc) : null;
  }
}
