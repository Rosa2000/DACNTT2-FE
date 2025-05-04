import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import WelcomePage from '../pages/welcome/WelcomePage';
import AuthPage from '../pages/auth/AuthPage';
import NotAuthorized from '../components/NotAuthorized';
import AdminRoutes from './adminRoutes';
import DashboardRedirect from '../components/DashboardRedirect';

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

      {/* Admin routes */}
      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* Trang lỗi và fallback */}
      <Route path="/not-authorized" element={<NotAuthorized />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
