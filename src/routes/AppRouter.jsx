import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from '../components/ProtectedRoute';
import Start from '../pages/Start';
import Auth from '../pages/auth/Auth';
import ForgotPassword from '../pages/auth/ForgotPassword';
import AdminDashboard from '../pages/admin/dashboard/AdminDashboard';
import LessonListAdmin from '../pages/admin/lessons/LessonList';
import LessonCreate from '../pages/admin/lessons/LessonCreate';
import LessonEdit from '../pages/admin/lessons/LessonEdit';
import ExerciseListAdmin from '../pages/admin/exercises/ExerciseList';
import ExerciseCreate from '../pages/admin/exercises/ExerciseCreate';
import ExerciseEdit from '../pages/admin/exercises/ExerciseEdit';
import UserDashboard from '../pages/user/dashboard/UserDashboard';
import LessonListUser from '../pages/user/lessons/LessonList';
import LessonDetail from '../pages/user/lessons/LessonDetail';
import ExerciseListUser from '../pages/user/exercises/ExerciseList';
import ExerciseDetail from '../pages/user/exercises/ExerciseDetail';

const AppRouter = () => {
  const { user, role } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Trang bắt đầu */}
        <Route path="/" element={<Start />} />

        {/* Trang auth */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Phân hệ Admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRole="admin">
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="lessons" element={<LessonListAdmin />} />
                <Route path="lessons/create" element={<LessonCreate />} />
                <Route path="lessons/edit/:id" element={<LessonEdit />} />
                <Route path="exercises" element={<ExerciseListAdmin />} />
                <Route path="exercises/create" element={<ExerciseCreate />} />
                <Route path="exercises/edit/:id" element={<ExerciseEdit />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Phân hệ User */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRole="user">
              <Routes>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="lessons" element={<LessonListUser />} />
                <Route path="lessons/:id" element={<LessonDetail />} />
                <Route path="exercises" element={<ExerciseListUser />} />
                <Route path="exercises/:id" element={<ExerciseDetail />} />
                <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Điều hướng mặc định nếu user đã đăng nhập */}
        <Route
          path="*"
          element={
            user && role ? (
              <Navigate to={role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;