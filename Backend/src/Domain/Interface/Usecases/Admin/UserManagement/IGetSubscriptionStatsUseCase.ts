export interface ISubscriptionStat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export interface IRevenueChartPoint {
  name: string;
  revenue: number;
}

export interface ISubscriptionStatsResponse {
  stats: ISubscriptionStat[];
  revenueData: IRevenueChartPoint[];
}

export interface IGetSubscriptionStatsUseCase {
  execute(): Promise<ISubscriptionStatsResponse>;
}
