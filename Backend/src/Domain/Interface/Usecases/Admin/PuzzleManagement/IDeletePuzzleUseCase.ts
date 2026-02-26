export interface ISoftDeleteUseCase{
    execute(id:string):Promise<boolean>
}
