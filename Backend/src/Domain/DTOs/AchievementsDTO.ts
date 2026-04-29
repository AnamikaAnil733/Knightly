import { CriteriaType } from "../Types/AchievementsTypes";

export interface CreateAchievementDTO {
    title: string;
    description: string;
    icon?:string;
    criteriaType:CriteriaType;
    criteriaValue:number;
}

export interface AchievementResponseDTO {
    id: string;
    title: string;
    description: string;
    icon: string;
    criteriaType: CriteriaType;
    criteriaValue: number;
}


export interface UpdateAchievementDTO {
    id: string; 
    title?: string;
    description?: string;
    icon?: string;
    criteriaType?: CriteriaType;
    criteriaValue?: number;
}
