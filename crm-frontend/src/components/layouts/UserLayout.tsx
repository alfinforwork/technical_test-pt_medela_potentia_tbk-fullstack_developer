import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { RootState } from "../../redux/store";
import Button from "../atoms/Button";

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">WFH Attendance System</h1>
              <p className="text-blue-100 text-sm">Employee Portal</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="font-semibold">{user?.name || "Employee"}</p>
                <p className="text-blue-100 text-sm">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Check-In / Check-Out
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Record your work-from-home attendance
              </p>
            </div>
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-700 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm">
          <p></p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
