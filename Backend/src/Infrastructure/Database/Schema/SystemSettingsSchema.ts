import { Schema, Document } from "mongoose";

export interface ISystemSettings {
  general: {
    maintenanceMode: boolean;
    platformName: string;
    contactEmail: string;
  };
  subscription: {
    monthlyPrice: number;
    annualPrice: number;
    currency: string;
  };
}

export interface SystemSettingsDocument extends Document, ISystemSettings {}

const SystemSettingsSchema = new Schema<SystemSettingsDocument>(
  {
    general: {
      maintenanceMode: { type: Boolean, default: false },
      platformName: { type: String, default: "Knightly" },
      contactEmail: { type: String, default: "support@knightly.com" },
    },
    subscription: {
      monthlyPrice: { type: Number, default: 9.99 },
      annualPrice: { type: Number, default: 99.99 },
      currency: { type: String, default: "USD" },
    },
  },
  { timestamps: true },
);

export default SystemSettingsSchema;
