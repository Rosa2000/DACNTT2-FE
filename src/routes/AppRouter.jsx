import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import WelcomePage from '../pages/welcome/WelcomePage';
import AuthPage from '../pages/auth/AuthPage';
import NotAuthorized from '../components/notAuthorized/NotAuthorized';
import AdminRoutes from './adminRoutes';
import DashboardRedirect from '../components/DashboardRedirect';
import UserRoutes from './userRoutes';
import ProtectedRoute from '../components/ProtectedRoute';
import UserProfile from '../pages/profile/UserProfile';

const AppRouter = () => {
  const { isAuthenticated, status, user } = useSelector((state) => state.auth);

  if (status === 'loading') {
    return <div>Đang kiểm tra đăng nhập...</div>;
  }

  return (
    <Routes>
      {/* Trang chủ: nếu đã login thành công, chuyển hướng tới dashboard phù hợp */}
      <Route
          path="/"
          element={
            isAuthenticated && user?.user_group ? <DashboardRedirect /> : <WelcomePage />
          }
        />

      {/* Các route cho auth */}
      <Route path="/auth/*" element={<AuthPage />} />

      {/* Profile route - shared between admin and user */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
      />

      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* User routes */}
      <Route path="/user/*" element={<UserRoutes />} />

      {/* Trang lỗi và fallback */}
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
