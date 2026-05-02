export type AnalyticsData = {
  stats: { label: string; value: string; icon: string }[];
  recentTransactions: {
    _id: string;
    amount: number;
    createdAt: string;
    userId?: { displayname: string; email: string };
  }[];
  recentUsers: {
    _id: string;
    displayname: string;
    createdAt: string;
    avatarKey?: string;
    role: string;
  }[];
};

export type SettingsData = {
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
};

export type PopulatedUser = {
  _id: string;
  displayname: string;
  email: string;
  avatarUrl?: string;
};

export type Transaction = {
  _id: string;
  userId: PopulatedUser | string | null;
  amount: number;
  currency: string;
  status: string;
  stripeSessionId: string;
  type: string;
  createdAt: string;
};

export type TransactionsResponse = {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
};
