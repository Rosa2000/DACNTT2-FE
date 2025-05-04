// src/routes/adminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/admin/dashboard/AdminDashboard';
import LessonCreate from '../pages/admin/lessons/LessonCreate';
import LessonEdit from '../pages/admin/lessons/LessonEdit';
import ExerciseCreate from '../pages/admin/exercises/ExerciseCreate';
import ExerciseEdit from '../pages/admin/exercises/ExerciseEdit';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="dashboard"
        element={
          <ProtectedRoute isAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="lessons/create"
        element={
          <ProtectedRoute isAdmin>
            <LessonCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="lessons/edit/:id"
        element={
          <ProtectedRoute isAdmin>
            <LessonEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="exercises/create"
        element={
          <ProtectedRoute isAdmin>
            <ExerciseCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="exercises/edit/:id"
        element={
          <ProtectedRoute isAdmin>
            <ExerciseEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
