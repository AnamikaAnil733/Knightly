import { LessonModel } from "../Database/Schema/LessonSchema";
import LessonEntity from "../../Domain/Entity/LessonEntity";
import { ILessonRepository } from "../../Domain/Interface/Repositories/ILessonRepository";
import { LessonCategory, LessonDifficulty } from "../../Domain/Types/LessonTypes";

export class LessonRepository implements ILessonRepository {
  private toEntity(doc: any): LessonEntity {
    return new LessonEntity({
      id: doc._id.toString(),
      title: doc.title,
      category: doc.category,
      difficulty: doc.difficulty,
      content: doc.content,
      order: doc.order,
      fen: doc.fen,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(lesson: LessonEntity): Promise<LessonEntity> {
    const doc = await LessonModel.create({
      title: lesson.title,
      category: lesson.category,
      difficulty: lesson.difficulty,
      content: lesson.content,
      order: lesson.order,
      fen: lesson.fen,
    });
    return this.toEntity(doc);
  }

  async findAll(filters?: { category?: LessonCategory; difficulty?: LessonDifficulty }): Promise<LessonEntity[]> {
    const query: any = {};
    if (filters?.category) query.category = filters.category;
    if (filters?.difficulty) query.difficulty = filters.difficulty;
    const docs = await LessonModel.find(query).sort({ order: 1 });
    return docs.map((d) => this.toEntity(d));
  }

  async findById(id: string): Promise<LessonEntity | null> {
    const doc = await LessonModel.findById(id);
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async update(id: string, lesson: LessonEntity): Promise<LessonEntity | null> {
    const doc = await LessonModel.findByIdAndUpdate(
      id,
      {
        title: lesson.title,
        category: lesson.category,
        difficulty: lesson.difficulty,
        content: lesson.content,
        order: lesson.order,
        fen: lesson.fen,
      },
      { new: true },
    );
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<void> {
    await LessonModel.findByIdAndDelete(id);
  }
}
