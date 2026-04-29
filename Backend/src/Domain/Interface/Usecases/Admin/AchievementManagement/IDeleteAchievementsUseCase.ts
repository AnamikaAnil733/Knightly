export interface IDeleteAchievementUseCase{
    execute(id:string):Promise<boolean>
}