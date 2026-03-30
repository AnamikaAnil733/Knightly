export abstract class BaseEntity {
  id?: string;
  createdAt?: Date;

  protected constructor(id?: string, createdAt?: Date) {
    this.id = id;
    this.createdAt = createdAt;
  }
}
