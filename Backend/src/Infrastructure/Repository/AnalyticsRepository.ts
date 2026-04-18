import { Model } from "mongoose";
import { UserDocument } from "../Database/Schema/UserSchema";
import { ChessGameSchemaType } from "../Database/Schema/ChessGameSchema";
import { TransactionDocument } from "../Database/Schema/TransactionSchema";
import { IAnalyticsRepository, IUserGrowthData, IGameDistribution, IGeneralStats } from "../../Domain/Interface/Repositories/IAnalyticsRepository";

export class AnalyticsRepository implements IAnalyticsRepository {
  constructor(
    private readonly userModel: Model<any>,
    private readonly gameModel: Model<any>,
    private readonly transactionModel: Model<any>
  ) {}

  async getUserGrowthData(days: number): Promise<IUserGrowthData[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const growth = await this.userModel.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return growth.map((item) => ({
      date: item._id,
      count: item.count,
    }));
  }

  async getGameDistribution(): Promise<IGameDistribution[]> {
    const distribution = await this.gameModel.aggregate([
      {
        $group: {
          _id: "$timeControl",
          count: { $sum: 1 },
        },
      },
    ]);

    return distribution.map((item) => ({
      type: item._id || "Unknown",
      count: item.count,
    }));
  }

  async getGeneralStats(): Promise<IGeneralStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, totalGames, revenueData, lifetimeRevenueData, newUsersToday] = await Promise.all([
      this.userModel.countDocuments(),
      this.gameModel.countDocuments(),
      this.transactionModel.aggregate([
        { $match: { createdAt: { $gte: today }, status: "COMPLETED" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      this.transactionModel.aggregate([
        { $match: { status: "COMPLETED" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      this.userModel.countDocuments({ createdAt: { $gte: today } }),
    ]);

    return {
      totalUsers,
      totalGames,
      totalRevenue: revenueData[0]?.total || 0,
      lifetimeRevenue: lifetimeRevenueData[0]?.total || 0,
      newUsersToday,
    };
  }

  async getRecentTransactions(limit: number): Promise<any[]> {
    return this.transactionModel
      .find({ status: "COMPLETED" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("userId", "displayname email")
      .lean();
  }

  async getRecentUsers(limit: number): Promise<any[]> {
    return this.userModel
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("displayname email createdAt role avatarKey")
      .lean();
  }
}
