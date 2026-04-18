import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Settings,
  Shield,
  CreditCard,
  Save,
  AlertTriangle,
} from "lucide-react";
import axios from "../../Service/Api/Axios/Adminaxios";
import toast from "react-hot-toast";

type SettingsData = {
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

export function SystemSettings() {
  const [activeTab, setActiveTab] = useState<"general" | "billing">("general");
  const [formData, setFormData] = useState<SettingsData | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<SettingsData>({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await axios.get("/admin/settings");
      return res.data;
    },
  });

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (updatedSettings: SettingsData) => {
      const res = await axios.patch("/admin/settings", updatedSettings);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      toast.success("Settings updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update settings");
    },
  });

  const handleChange = (
    section: keyof SettingsData,
    field: string,
    value: any,
  ) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  const handleSave = () => {
    if (formData) updateMutation.mutate(formData);
  };

  if (isLoading || !formData) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0A0F2C]">
        <div className="animate-spin h-10 w-10 border-4 border-[#FFD166] border-t-transparent rounded-full" />
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "General", icon: <Shield size={18} /> },
    { id: "billing", label: "Billing", icon: <CreditCard size={18} /> },
  ] as const;

  return (
    <div className="w-full min-h-screen p-8 bg-[#0A0F2C] text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FFD166]/10 rounded-lg">
              <Settings className="h-8 w-8 text-[#FFD166]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">System Settings</h1>
              <p className="text-gray-400 text-sm">
                Configure global platform variables and rules
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 bg-[#FFD166] text-[#0A0F2C] px-6 py-2.5 rounded-xl font-bold hover:bg-[#ffdb8b] transition-all disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              "Saving..."
            ) : (
              <>
                <Save size={18} /> Save Changes
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* TAB NAVIGATION */}
          <div className="w-full md:w-64 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  activeTab === tab.id
                    ? "bg-[#FFD166] text-[#0A0F2C] shadow-lg shadow-[#FFD166]/10"
                    : "text-gray-400 hover:bg-[#11193F] hover:text-white"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 bg-[#11193F] rounded-2xl border border-[#1e2547] p-8 shadow-xl">
            {activeTab === "general" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold mb-4">
                  General Configuration
                </h2>

                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-4 items-start mb-6">
                  <AlertTriangle
                    className="text-red-500 shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-bold text-red-500">
                      Maintenance Mode
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      Enabling this will prevent all non-admin users from
                      accessing the platform.
                    </p>
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={formData.general.maintenanceMode}
                          onChange={(e) =>
                            handleChange(
                              "general",
                              "maintenanceMode",
                              e.target.checked,
                            )
                          }
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                      <span className="text-sm font-medium">
                        {formData.general.maintenanceMode
                          ? "Enabled"
                          : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      value={formData.general.platformName}
                      onChange={(e) =>
                        handleChange("general", "platformName", e.target.value)
                      }
                      className="w-full bg-[#0A0F2C] border border-[#1e2547] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FFD166] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Support Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.general.contactEmail}
                      onChange={(e) =>
                        handleChange("general", "contactEmail", e.target.value)
                      }
                      className="w-full bg-[#0A0F2C] border border-[#1e2547] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FFD166] transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-xl font-bold mb-4">
                  Subscription & Billing
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Monthly Premium Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={formData.subscription.monthlyPrice}
                        onChange={(e) =>
                          handleChange(
                            "subscription",
                            "monthlyPrice",
                            Number(e.target.value),
                          )
                        }
                        className="w-full bg-[#0A0F2C] border border-[#1e2547] rounded-xl pl-8 pr-4 py-2.5 focus:outline-none focus:border-[#FFD166] transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Annual Premium Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={formData.subscription.annualPrice}
                        onChange={(e) =>
                          handleChange(
                            "subscription",
                            "annualPrice",
                            Number(e.target.value),
                          )
                        }
                        className="w-full bg-[#0A0F2C] border border-[#1e2547] rounded-xl pl-8 pr-4 py-2.5 focus:outline-none focus:border-[#FFD166] transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FOOTER ACTIONS */}
            <div className="mt-10 pt-6 border-t border-[#1e2547] flex justify-end">
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 bg-[#FFD166] text-[#0A0F2C] px-8 py-3 rounded-xl font-bold hover:bg-[#ffdb8b] transition-all disabled:opacity-50 shadow-lg shadow-[#FFD166]/10"
              >
                {updateMutation.isPending ? (
                  "Saving..."
                ) : (
                  <>
                    <Save size={18} /> Apply Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
