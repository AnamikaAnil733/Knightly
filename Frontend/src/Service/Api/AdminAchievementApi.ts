import axios from "./Axios/Adminaxios";

export type CriteriaType =
  | "GAMES_WON"
  | "GAMES_PLAYED"
  | "PUZZLES_SOLVED"
  | "STREAK_DAYS";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  criteriaType: CriteriaType;
  criteriaValue: number;
}

export interface CreateAchievementPayload {
  title: string;
  description: string;
  icon?: string;
  criteriaType: CriteriaType;
  criteriaValue: number;
}

export interface UpdateAchievementPayload {
  title?: string;
  description?: string;
  icon?: string;
  criteriaType?: CriteriaType;
  criteriaValue?: number;
}

export const createAchievementApi = async (
  data: CreateAchievementPayload,
): Promise<Achievement> => {
  const response = await axios.post("/admin/achievements/create", data);
  return response.data.data;
};

export const getAllAchievementsApi = async (): Promise<Achievement[]> => {
  const response = await axios.get("/admin/achievements");
  return response.data.data;
};

export const updateAchievementApi = async (
  id: string,
  data: UpdateAchievementPayload,
): Promise<Achievement> => {
  const response = await axios.patch(`/admin/achievements/${id}`, data);
  return response.data.data;
};
