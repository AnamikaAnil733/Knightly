export interface IAnalyticsStat {
  label: string;
  value: string;
  icon: string;
}

export interface IUserGrowthPoint {
  date: string;
  count: number;
}

export interface IGameModeDistribution {
  name: string;
  count: number;
}

export interface IAdminAnalyticsDTO {
  growthData: IUserGrowthPoint[];
  gameDistribution: IGameModeDistribution[];
  stats: IAnalyticsStat[];
  recentTransactions: any[];
  recentUsers: any[];
}

export interface IGetAdminAnalyticsUseCase {
  execute(): Promise<IAdminAnalyticsDTO>;
}
