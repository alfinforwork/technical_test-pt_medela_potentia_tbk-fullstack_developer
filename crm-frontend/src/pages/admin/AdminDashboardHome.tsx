import React from "react";
import { MdCheckCircle, MdPauseCircle, MdPeople } from "react-icons/md";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const AdminDashboardHome: React.FC = () => {
  const { employees } = useSelector((state: RootState) => state.employee);
  const { user } = useSelector((state: RootState) => state.auth);

  const stats = [
    {
      label: "Total Employees",
      value: employees.length,
      icon: MdPeople,
      color: "bg-blue-500",
    },
    {
      label: "Active Employees",
      value: employees.filter((e: any) => e.isActive).length,
      icon: MdCheckCircle,
      color: "bg-green-500",
    },
    {
      label: "Inactive Employees",
      value: employees.filter((e: any) => !e.isActive).length,
      icon: MdPauseCircle,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your employee management system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-4xl font-bold text-gray-800 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.color} text-white p-4 rounded-lg flex items-center justify-center`}
                >
                  <IconComponent size={40} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboardHome;
