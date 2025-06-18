// src/layout/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Espacio para el botón hamburguesa en mobile */}
        <div className="md:hidden h-16" />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;