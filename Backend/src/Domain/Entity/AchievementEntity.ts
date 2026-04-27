import { CriteriaType } from "../Types/AchievementsTypes";
export default class AchievementEntity{
    private _id?:string;
    private _title:string;
    private _description:string;
    private _icon:string;
    private _criteriaType:CriteriaType;
    private _criteriaValue:number;
    private _createdAt:Date;

    constructor(params:{
      id?:string; 
      title:string;
      description:string; 
      icon?:string;
      criteriaType:CriteriaType;
      criteriaValue:number;
      createdAt?:Date;
    }){
     this._id = params.id;
     this._title = params.title;
     this._description = params.description;
     this._icon= params.icon ||"Trophy";
     this._criteriaValue = params.criteriaValue;
     this._criteriaType = params.criteriaType;
     this._createdAt = params.createdAt || new Date();
    }

    //getters
    get id(){return this._id}
    get title(){return this._title};
    get description(){return this._description};
    get icon(){return this._icon};
    get criteriaType(){return this._criteriaType};
    get criteriaValue(){return this._criteriaValue};
    get createdAt(){return this._createdAt}
}