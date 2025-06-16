// src/routes/adminRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/admin/dashboard/AdminDashboard';
import LessonCreate from '../pages/admin/lessons/lessonCreate/LessonCreate';
import LessonEdit from '../pages/admin/lessons/lessonEdit/LessonEdit';
import LessonList from '../pages/admin/lessons/lessonList/LessonList';
import ExerciseList from '../pages/admin/exercises/exerciseList/ExerciseList';
import LessonExercises from '../pages/admin/exercises/lessonExercises/LessonExercises';
import ExerciseCreate from '../pages/admin/exercises/exerciseCreate/ExerciseCreate';
import ExerciseEdit from '../pages/admin/exercises/exerciseEdit/ExerciseEdit';
import UserList from '../pages/admin/users/userList/UserList';
import UserCreate from '../pages/admin/users/userCreate/UserCreate';
import UserEdit from '../pages/admin/users/userEdit/UserEdit';

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Dashboard */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute isAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Lessons */}
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

      {/* Exercises */}
      <Route
        path="exercises"
        element={
          <ProtectedRoute isAdmin>
            <ExerciseList />
          </ProtectedRoute>
        }
      />
      <Route
        path="exercises/lesson/:lessonId"
        element={
          <ProtectedRoute isAdmin>
            <LessonExercises />
          </ProtectedRoute>
        }
      />
      <Route
        path="exercises/create/:lessonId"
        element={
          <ProtectedRoute isAdmin>
            <ExerciseCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="exercises/edit/:lessonId/:id"
        element={
          <ProtectedRoute isAdmin>
            <ExerciseEdit />
          </ProtectedRoute>
        }
      />

      {/* Users */}
      <Route
        path="users"
        element={
          <ProtectedRoute isAdmin>
            <UserList />
          </ProtectedRoute>
        }
      />
      <Route
        path="users/create"
        element={
          <ProtectedRoute isAdmin>
            <UserCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="users/edit/:id"
        element={
          <ProtectedRoute isAdmin>
            <UserEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
