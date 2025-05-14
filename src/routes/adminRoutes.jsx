// src/routes/adminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/admin/dashboard/AdminDashboard';
import LessonCreate from '../pages/admin/lessons/lessonCreate/LessonCreate';
import LessonEdit from '../pages/admin/lessons/lessonEdit/LessonEdit';
import LessonList from '../pages/admin/lessons/lessonList/LessonList';
import ExerciseList from '../pages/admin/exercises/ExerciseList';
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
        path="lessons"
        element={
          <ProtectedRoute isAdmin>
            <LessonList />
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
        path="exercises"
        element={
          <ProtectedRoute isAdmin>
            <ExerciseList />
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
