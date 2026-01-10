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

  async ban(id: string): Promise<void> {
      await this.model.findByIdAndUpdate(id,{isBlocked:true}).exec()
  }

  async unban(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id,{isBlocked:false}).exec()
  }

  async getAll(): Promise<EAuth[]> {
      const docs = await this.model.find();
      return docs.map(docs=>this.mapper.toEntityFromDocument(docs))
  }
 
}