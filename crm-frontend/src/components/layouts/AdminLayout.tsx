import React, { useState } from "react";
import {
  MdArrowBack,
  MdArrowForward,
  MdAssignmentInd,
  MdDashboard,
  MdPeople,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";
import Button from "../atoms/Button";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: MdDashboard,
    },
    {
      label: "Manage Employees",
      path: "/admin/employees",
      icon: MdPeople,
    },
    {
      label: "Attendance Monitoring",
      path: "/admin/attendance",
      icon: MdAssignmentInd,
    },
  ];

  return (
    <div className="bg-gray-100 flex h-screen">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 shadow-lg flex flex-col`}
      >
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className={`font-bold text-lg ${!sidebarOpen && "hidden"}`}>
              Admin Panel
            </h2>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-gray-700 rounded"
            >
              {sidebarOpen ? (
                <MdArrowBack size={20} />
              ) : (
                <MdArrowForward size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                  isActive(item.path)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <IconComponent size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="px-3 py-4 border-t border-gray-700">
          <div
            className={`flex items-center gap-3 ${
              sidebarOpen ? "" : "flex-col text-center"
            }`}
          >
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-semibold truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-400 truncate">Administrator</p>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-3 pb-6">
          <Button
            onClick={handleLogout}
            variant="secondary"
            className={`w-full bg-red-600 hover:bg-red-700 text-white ${
              !sidebarOpen && "px-0"
            }`}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow">
          <div className="px-6 py-4 flex justify-between items-center">
            <div></div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Logged in as</p>
              <p className="font-semibold text-gray-800">{user?.email}</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-200 text-gray-700 py-4 px-6 text-center text-sm border-t">
          <p></p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
