import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../atoms/Button";

interface HeaderProps {
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, userRole, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/login");
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">WFH Attendance System</h1>
          </div>

          <div className="flex items-center gap-4">
            {userName && (
              <div className="text-right">
                <p className="font-semibold">{userName}</p>
                <p className="text-sm opacity-90 capitalize">{userRole}</p>
              </div>
            )}
            {onLogout && (
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="ml-4"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
