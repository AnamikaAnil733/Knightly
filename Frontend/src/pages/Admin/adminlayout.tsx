import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import Navbar from "../../components/admin/common/navbar"
import Sidebar from "../../components/admin/common/sidebar"


const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false)
  
    const toggleSidebar = () => {
      setCollapsed((prev) => !prev)
    }
  
    return (
      <div className="flex h-screen overflow-hidden bg-[#060B2E]">
        {/* Sidebar */}
        <div className="sticky top-0 h-screen z-40">
          <Sidebar collapsed={collapsed} />
        </div>
  
        {/* Main Section */}
        <div className="flex flex-col flex-1">
          {/* Navbar */}
          <div className="sticky top-0 z-30">
            <Navbar toggleSidebar={toggleSidebar} />
          </div>
  
          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto bg-[#121B52]p-6">
            <Outlet />
          </main>
        </div>
      </div>
    )
  }
  
  export default AdminLayout