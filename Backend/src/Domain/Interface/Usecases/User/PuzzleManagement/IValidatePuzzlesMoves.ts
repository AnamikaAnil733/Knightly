
export interface IValidateMoveusecase{
    execute(input:{userId:string,puzzleId:string,move:string,moveIndex:number}):Promise<{correct:boolean,nextMove?:string,solved:boolean}>
}
