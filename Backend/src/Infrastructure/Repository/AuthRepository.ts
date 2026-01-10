import { BaseRepository } from "./BaseRepository";
import { authModel } from "../database/model/authmodel";
import { AuthMapper } from "../../Application/mapper/AuthMapper";
import EAuth from "../../Domain/Entity/auth";
import { AuthSchemaType } from "../database/Schema/authSchema";
import {IUserRepository} from "../../Domain/Interface/Repositories/UserRepository";



export class AuthRepository extends BaseRepository<EAuth, AuthSchemaType> implements IUserRepository{
  constructor() {
    super(authModel, AuthMapper);
  }

  async findByEmail(email: string): Promise<EAuth | null> {
    const doc = await this.model.findOne({ email }).exec();
    return doc ? this.mapper.toEntityFromDocument(doc) : null;
  }
}
