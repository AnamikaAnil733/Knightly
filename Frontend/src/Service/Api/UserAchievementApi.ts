import api from "./Axios/Useraxios";

export interface AchievementProgress {
    id: string;
    title: string;
    description: string;
    icon: string;
    criteriaType: string;
    criteriaValue: number;
    isEarned: boolean;
    earnedAt?: string;
}

export const userAchievementApi = {
    getAllAchievements: async (): Promise<AchievementProgress[]> => {
        const response = await api.get("/user/achievements/all");
        return response.data.data;
    },

    getEarnedAchievements: async (): Promise<AchievementProgress[]> => {
        const response = await api.get("/user/achievements/earned");
        return response.data.data;
    },

    checkProgress: async (type: string, currentValue: number) => {
        const response = await api.post("/user/achievements/check", { 
            type, 
            currentValue 
        });
        return response.data;
    }
};
