
import React, { ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import CreateDataPage from './pages/CreateDataPage';
import ReportPage from './pages/ReportPage';
import AttendanceReportPage from './pages/AttendanceReportPage';
import { Role } from './types';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser } = useAppContext();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.AGENT]}><DashboardPage /></ProtectedRoute>} />
      <Route path="/user-management" element={<ProtectedRoute allowedRoles={[Role.ADMIN]}><UserManagementPage /></ProtectedRoute>} />
      <Route path="/create-data" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.AGENT]}><CreateDataPage /></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.AGENT]}><ReportPage /></ProtectedRoute>} />
      <Route path="/attendance-report" element={<ProtectedRoute allowedRoles={[Role.ADMIN]}><AttendanceReportPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
