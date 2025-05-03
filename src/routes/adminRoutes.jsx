// src/routes/adminRoutes.jsx
import React from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/admin/dashboard/AdminDashboard';
import LessonCreate from '../pages/admin/lessons/LessonCreate';
import LessonEdit from '../pages/admin/lessons/LessonEdit';
import ExerciseCreate from '../pages/admin/exercises/ExerciseCreate';
import ExerciseEdit from '../pages/admin/exercises/ExerciseEdit';

const AdminRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <>
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={user?.role === 'admin'}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/lessons/create"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={user?.role === 'admin'}>
            <LessonCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/lessons/edit/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={user?.role === 'admin'}>
            <LessonEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exercises/create"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={user?.role === 'admin'}>
            <ExerciseCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exercises/edit/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={user?.role === 'admin'}>
            <ExerciseEdit />
          </ProtectedRoute>
        }
      />
    </>
  );
};

export default AdminRoutes;