import { BaseRepository } from "./BaseRepository";
import { authModel } from "../database/model/authmodel";
import { AuthMapper } from "../../Application/mapper/AuthMapper";
import EAuth from "../../Domain/Entity/auth";
import { AuthSchemaType } from "../database/Schema/authSchema";
import {IUserManagmentRepository} from "../../Domain/Interface/Repositories/UserManagmentRepository"

export class UserManagmentRepository extends BaseRepository<EAuth, AuthSchemaType>implements IUserManagmentRepository{
  constructor() {
    super(authModel, AuthMapper);
  }

  async ban(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    ).exec();

    return result !== null;
  }

  async unban(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    ).exec();

    return result !== null;
  }

  async getAll(): Promise<EAuth[]> {
      const docs = await this.model.find();
      return docs.map(docs=>this.mapper.toEntityFromDocument(docs))
  }
 
}