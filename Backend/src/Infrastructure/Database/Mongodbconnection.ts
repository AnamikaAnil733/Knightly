
import mongoose from "mongoose";

export class MongoDB {
  public static async connect() {
    try {
      const url = process.env.MONGODB_URL;
      if (!url) throw new Error("MongoDB URL is missing!");

      await mongoose.connect(url);
      console.log("MongoDB Connected");
    } catch (error) {
      console.error("MongoDB Error", error);
    }
  }
}
