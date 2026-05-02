import { IUser } from "./UserTypes";

export type SubscriptionResponse = {
  users: IUser[];
  total: number;
  page: number;
  totalPages: number;
};

export type StatsResponse = {
  stats: {
    label: string;
    value: string;
    change: string;
    trend: "up" | "down";
  }[];
  revenueData: { date: string; amount: number }[];
};
