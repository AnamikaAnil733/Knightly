import { BaseRepository } from "./BaseRepository";
import { authModel } from "../Database/Model/Authmodel";
import { AuthMapper } from "../../Application/Mapper/AuthMapper";
import EAuth from "../../Domain/Entity/Auth";
import { AuthSchemaType } from "../Database/Schema/AuthSchema";
import {IUserManagmentRepository} from "../../Domain/Interface/Repositories/IUserManagementRepository";

export class UserManagementRepository
  extends BaseRepository<EAuth, AuthSchemaType>
  implements IUserManagmentRepository
{
  constructor() {
    super(authModel, AuthMapper);
  }

  async ban(id: string): Promise<boolean> {
    const result = await this.model
      .findByIdAndUpdate(id, { isBlocked: true }, { new: true })
      .exec();

    return result !== null;
  }

  async unban(id: string): Promise<boolean> {
    const result = await this.model
      .findByIdAndUpdate(id, { isBlocked: false }, { new: true })
      .exec();

    return result !== null;
  }

  async getAll(
    skip: number,
    limit: number,
    search?: string,
    filter?: "ALL" | "BLOCKED" | "UNBLOCKED",
  ): Promise<EAuth[]> {
    const query: any = {};

    if (search && search.trim() !== "") {
      query.displayname = { $regex: `^${search}`, $options: "i" };
    }

    if (filter === "BLOCKED") {
      query.isBlocked = true;
    }

    if (filter === "UNBLOCKED") {
      query.isBlocked = false;
    }

    const docs = await this.model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return docs.map((doc) => this.mapper.toEntityFromDocument(doc));
  }

  async count(
    search?: string,
    filter?: "ALL" | "BLOCKED" | "UNBLOCKED",
  ): Promise<number> {
    const query: any = {};

    if (search && search.trim() !== "") {
      query.displayname = { $regex: `^${search}`, $options: "i" };
    }
    if (filter === "BLOCKED") {
      query.isBlocked = true;
    }

    if (filter === "UNBLOCKED") {
      query.isBlocked = false;
    }
    return this.model.countDocuments(query);
  }
}
