import { useState } from "react";
import { AccountSettings } from "../../Components/User/Settings/Account";
import { Sidebar } from "../../Components/User/Settings/Sidebar";
import { Navbar } from "../../Components/User/Common/Navbar";

export function Settings() {
    const [activeSection, setActiveSection] = useState("account");
  
    return (
      <div className="min-h-screen bg-[#0A0F2C] text-white pt-16">
        {/* pt-16 = height of navbar */}
  
        <Navbar />
  
        <div className="flex min-h-screen">
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
  
          <main className="flex-1 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {activeSection === "account" && <AccountSettings />}
            </div>
          </main>
        </div>
      </div>
    );
  }
  
