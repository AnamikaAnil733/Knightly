import { CommentEntity } from "../../Domain/Entity/CommentEntity";
import { CommentDTO } from "../../Domain/DTOs/CommentDTOs";

export class CommentMapper {
  static toDTO(entity: CommentEntity): CommentDTO {
    return {
      id: entity.id!,
      blogId: entity.blogId,
      authorId: entity.authorId,
      authorName: entity.authorName,
      authorAvatar: entity.authorAvatar,
      content: entity.content,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDTOList(entities: CommentEntity[]): CommentDTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }
}
