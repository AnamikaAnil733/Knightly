import { BaseRepository } from "./BaseRepository";
import { authModel } from "../Database/Model/Authmodel";
import EAuth from "../../Domain/Entity/Auth";
import { AuthSchemaType } from "../Database/Schema/AuthSchema";
import {IUserManagmentRepository} from "../../Domain/Interface/Repositories/IUserManagementRepository";
import { MongoAuthMapper } from "../Mapper/MongoAuthMapper";

export class UserManagementRepository
  extends BaseRepository<EAuth, AuthSchemaType>
  implements IUserManagmentRepository
{
  constructor() {
    super(authModel, MongoAuthMapper);
  }

  async ban(id: string): Promise<boolean> {
    const result = await this.model
      .findByIdAndUpdate(id, { isBlocked: true }, { new: true })
      .exec();

    return result !== null;
  }

  async unban(id: string): Promise<boolean> {
    const result = await this.model
      .findByIdAndUpdate(id, { isBlocked: false }, { new: true })
      .exec();

    return result !== null;
  }

  async getAll(
    skip: number,
    limit: number,
    search?: string,
    filter?: "ALL" | "BLOCKED" | "UNBLOCKED" | "PREMIUM",
  ): Promise<EAuth[]> {
    const query: any = {};

    if (search && search.trim() !== "") {
      query.displayname = { $regex: `^${search}`, $options: "i" };
    }

    if (filter === "BLOCKED") {
      query.isBlocked = true;
    }

    if (filter === "UNBLOCKED") {
      query.isBlocked = false;
    }

    if (filter === "PREMIUM") {
      query.premium = true;
    }

    const docs = await this.model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return docs.map((doc) => this.mapper.toEntityFromDocument(doc));
  }

  async count(
    search?: string,
    filter?: "ALL" | "BLOCKED" | "UNBLOCKED" | "PREMIUM",
  ): Promise<number> {
    const query: any = {};

    if (search && search.trim() !== "") {
      query.displayname = { $regex: `^${search}`, $options: "i" };
    }
    if (filter === "BLOCKED") {
      query.isBlocked = true;
    }

    if (filter === "UNBLOCKED") {
      query.isBlocked = false;
    }

    if (filter === "PREMIUM") {
      query.premium = true;
    }
    return this.model.countDocuments(query);
  }

  async getSubscriptionCountByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return this.model.countDocuments({
      premium: true,
      subscriptionStart: { $gte: startDate, $lte: endDate },
    });
  }

  async getRevenueByMonth(): Promise<{ month: string; revenue: number }[]> {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const aggregation = await this.model.aggregate([
      {
        $match: {
          premium: true,
          subscriptionStart: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$subscriptionStart" },
            year: { $year: "$subscriptionStart" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return aggregation.map((item) => ({
      month: `${months[item._id.month - 1]} ${item._id.year}`,
      revenue: item.count * 9.99,
    }));
  }
}
