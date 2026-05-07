import { IAnalyticsRepository } from "../../../../Domain/Interface/Repositories/IAnalyticsRepository";
import { IGetAdminAnalyticsUseCase, IAdminAnalyticsDTO } from "../../../../Domain/Interface/Usecases/Admin/Analytics/IGetAdminAnalyticsUseCase";

export  class GetAdminAnalyticsUseCase implements IGetAdminAnalyticsUseCase {
  constructor(private readonly analyticsRepository: IAnalyticsRepository) {}

  async execute(): Promise<IAdminAnalyticsDTO> {
    const [growthData, distributionData, generalStats, recentTransactions, recentUsers] = await Promise.all([
      this.analyticsRepository.getUserGrowthData(30),
      this.analyticsRepository.getGameDistribution(),
      this.analyticsRepository.getGeneralStats(),
      this.analyticsRepository.getRecentTransactions(5),
      this.analyticsRepository.getRecentUsers(5),
    ]);

    // Categorize game distribution for cleaner frontend charts
    const categorizedDistribution = this.categorizeGames(distributionData);

    return {
      growthData,
      gameDistribution: categorizedDistribution,
      stats: [
        { label: "Total Users", value: generalStats.totalUsers.toString(), icon: "users" },
        { label: "Total Games", value: generalStats.totalGames.toString(), icon: "gamepad" },
        { label: "Today's Revenue", value: `$${generalStats.totalRevenue.toFixed(2)}`, icon: "banknotes" },
        { label: "Lifetime Revenue", value: `$${generalStats.lifetimeRevenue.toFixed(2)}`, icon: "banknotes" },
        { label: "New Users (24h)", value: generalStats.newUsersToday.toString(), icon: "user-plus" },
      ],
      recentTransactions,
      recentUsers,
    };
  }

  private categorizeGames(data: { type: string; count: number }[]) {
    const categories: Record<string, number> = {
      Bullet: 0,
      Blitz: 0,
      Rapid: 0,
      Classical: 0,
      Bot: 0,
    };

    data.forEach((item) => {
      // Handle Bot matches
      if (item.type.startsWith("level-") || item.type.includes("Stockfish")) {
        categories["Bot"] += item.count;
        return;
      }

      const parts = item.type.split("+");
      const base = parseInt(parts[0]);

      if (isNaN(base)) return;

      if (base < 3) categories.Bullet += item.count;
      else if (base < 10) categories.Blitz += item.count;
      else if (base < 30) categories.Rapid += item.count;
      else categories.Classical += item.count;
    });

    return Object.entries(categories)
      .map(([name, count]) => ({ name, count }));
  }
}
