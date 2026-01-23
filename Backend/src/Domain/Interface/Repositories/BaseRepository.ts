export interface IBaseRepository<T, ID = string> {
  create(entity: T): Promise<T>;
  findById(id: ID): Promise<T | null>;
  update(entity: T): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
}
