
export interface IValidateMoveusecase{
    execute(input:{userId:string,puzzleId:string,move:string}):Promise<{correct:boolean,nextMove?:string,solved:boolean}>
}
