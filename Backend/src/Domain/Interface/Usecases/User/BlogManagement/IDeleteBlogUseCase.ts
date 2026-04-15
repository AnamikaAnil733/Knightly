export interface IDeleteBlogUseCase {
  execute(id: string, userId: string): Promise<boolean>;
}
