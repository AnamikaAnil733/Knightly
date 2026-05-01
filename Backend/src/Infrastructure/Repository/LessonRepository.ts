import { LessonModel } from "../Database/Schema/LessonSchema";
import LessonEntity from "../../Domain/Entity/LessonEntity";
import { ILessonRepository } from "../../Domain/Interface/Repositories/ILessonRepository";
import { LessonCategory, LessonDifficulty } from "../../Domain/Types/LessonTypes";
import { MongoLessonMapper } from "../Mapper/MongoLessonMapper";

export class LessonRepository implements ILessonRepository {
  async create(lesson: LessonEntity): Promise<LessonEntity> {
    const data = MongoLessonMapper.toDocumentFromEntity(lesson);
    const doc = await LessonModel.create(data);
    return MongoLessonMapper.toEntityFromDocument(doc as any);
  }

  async findAll(filters?: { category?: LessonCategory; difficulty?: LessonDifficulty }): Promise<LessonEntity[]> {
    const query: any = {};
    if (filters?.category) query.category = filters.category;
    if (filters?.difficulty) query.difficulty = filters.difficulty;
    const docs = await LessonModel.find(query).sort({ order: 1 });
    return docs.map((d) => MongoLessonMapper.toEntityFromDocument(d as any));
  }

  async findById(id: string): Promise<LessonEntity | null> {
    const doc = await LessonModel.findById(id);
    if (!doc) return null;
    return MongoLessonMapper.toEntityFromDocument(doc as any);
  }

  async update(id: string, lesson: LessonEntity): Promise<LessonEntity | null> {
    const data = MongoLessonMapper.toDocumentFromEntity(lesson);
    const doc = await LessonModel.findByIdAndUpdate(id, data, { new: true });
    if (!doc) return null;
    return MongoLessonMapper.toEntityFromDocument(doc as any);
  }

  async delete(id: string): Promise<void> {
    await LessonModel.findByIdAndDelete(id);
  }
}
