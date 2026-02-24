import { BaseEntity } from "./BaseEntity";

export class EUserPuzzleprogress extends BaseEntity{
    userId :string;
    puzzleId:string;
    solved:boolean;
    attempts:number;
    solvedAt?:Date;

    constructor(props:{
        id?:string;
        userId:string;
        puzzleId:string;
        solved?:boolean;
        attempts?:number;
        solvedAt?:Date;
    }){
        super(props.id);
        if(!props.userId) throw new Error("userid is required");
        if(!props.puzzleId) throw new Error("PuzzleId is required");

        this.userId = props.userId;
        this.puzzleId = props.puzzleId;
        this.attempts = props.attempts ??0;
        this.solved = props.solved??false;
        this.solvedAt = props.solvedAt;
    }

    incrementAttempts():void{
        this.attempts += 1
    }

    markSolved():void{
        this.solved = true;
        this.solvedAt = new Date()
    }
}