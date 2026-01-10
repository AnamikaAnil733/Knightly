import { Model, HydratedDocument, AnyKeys } from "mongoose";
import { BaseEntity } from "../../Domain/Entity/BaseEntity";
import {IBaseRepository} from "../../Domain/Interface/Repositories/BaseReository";

export abstract class BaseRepository<
TEntity extends BaseEntity,TSchema> implements IBaseRepository<TEntity>{
  constructor(
    protected readonly model: Model<TSchema>,
    protected readonly mapper: {
      toEntityFromDocument(doc: HydratedDocument<TSchema>): TEntity;
      toDocumentFromEntity(entity: TEntity): AnyKeys<TSchema>;
    }
  ) {}

  async findById(id: string): Promise<TEntity | null> {
    const doc = await this.model.findById(id);
    return doc ? this.mapper.toEntityFromDocument(doc) : null;
  }

  async create(entity: TEntity): Promise<TEntity> {
    const data = this.mapper.toDocumentFromEntity(entity);
    const doc = new this.model(data);
    await doc.save();
    return this.mapper.toEntityFromDocument(doc);
  }

  async update(entity: TEntity): Promise<TEntity | null> {
    if (!entity.id) return null;

    const doc = await this.model.findByIdAndUpdate(
      entity.id,
      this.mapper.toDocumentFromEntity(entity),
      { new: true }
    );

    return doc ? this.mapper.toEntityFromDocument(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    return !!(await this.model.findByIdAndDelete(id));
  }
}
