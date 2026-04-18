import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "../Service/Api/Axios/Useraxios";

export interface ISystemSettings {
  platformName: string;
  maintenanceMode: boolean;
  contactEmail: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
}

const defaultSettings: ISystemSettings = {
  platformName: "Knightly",
  maintenanceMode: false,
  contactEmail: "support@knightly.com",
  monthlyPrice: 9.99,
  annualPrice: 99.99,
  currency: "USD",
};

interface SystemSettingsContextType {
  settings: ISystemSettings;
  isLoading: boolean;
}

const SystemSettingsContext = createContext<
  SystemSettingsContextType | undefined
>(undefined);

export const SystemSettingsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { data, isLoading } = useQuery<ISystemSettings>({
    queryKey: ["public-settings"],
    queryFn: async () => {
      // FIX: Path must match Backend registration in App.ts (/api/auth/settings)
      const res = await axios.get("/auth/settings");
      return res.data;
    },
    staleTime: 1000 * 5, // Reduce to 5 seconds for better reactivity
    placeholderData: defaultSettings,
  } as any);

  return (
    <SystemSettingsContext.Provider
      value={{ settings: data || defaultSettings, isLoading }}
    >
      {children}
    </SystemSettingsContext.Provider>
  );
};

export const useSystemSettings = () => {
  const context = useContext(SystemSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useSystemSettings must be used within a SystemSettingsProvider",
    );
  }
  return context;
};
