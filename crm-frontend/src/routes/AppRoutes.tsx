import React from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AdminLayout from "../components/layouts/AdminLayout";
import UserLayout from "../components/layouts/UserLayout";
import AdminDashboardHome from "../pages/admin/AdminDashboardHome";
import AttendanceMonitoring from "../pages/admin/AttendanceMonitoring";
import ManageEmployee from "../pages/admin/ManageEmployee";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import EmployeeDashboard from "../pages/user/EmployeeDashboard";
import { RootState } from "../redux/store";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Employee Routes */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute requiredRole="employee">
              <UserLayout>
                <EmployeeDashboard />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AdminDashboardHome />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <ManageEmployee />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/attendance"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <AttendanceMonitoring />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect based on role */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/employee/dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
