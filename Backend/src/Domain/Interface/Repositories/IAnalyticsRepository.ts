export interface IUserGrowthData {
  date: string;
  count: number;
}

export interface IGameDistribution {
  type: string;
  count: number;
}

export interface IGeneralStats {
  totalUsers: number;
  totalGames: number;
  totalRevenue: number;
  lifetimeRevenue: number;
  newUsersToday: number;
}

export interface IAnalyticsRepository {
  getUserGrowthData(days: number): Promise<IUserGrowthData[]>;
  getGameDistribution(): Promise<IGameDistribution[]>;
  getGeneralStats(): Promise<IGeneralStats>;
  getRecentTransactions(limit: number): Promise<any[]>;
  getRecentUsers(limit: number): Promise<any[]>;
}
