export default class UserAchievementEntity{
    private _id?:string;
    private _userId:string;
    private _achievementId:string;
    private _unlockedAt:Date;

    constructor(params:{
        id?:string;
        userId:string;
        achievementId:string;
        unlockedAt?:Date;
    }){
        this._id = params.id;
        this._userId = params.userId;
        this._achievementId = params.achievementId;
        this._unlockedAt = params.unlockedAt || new Date();
    }

    //getters
    get id():string|undefined{return this._id}
    get userId():string{return this._userId}
    get achievementId():string{return this._achievementId}
    get unlockedAt():Date{return this._unlockedAt}
}