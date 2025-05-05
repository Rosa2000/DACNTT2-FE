// src/routes/userRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from '../components/ProtectedRoute';
import UserDashboard from '../pages/user/dashboard/UserDashboard';
import LessonList from '../pages/user/lessons/LessonList';
import LessonDetail from '../pages/user/lessons/LessonDetail';
import ExerciseList from '../pages/user/exercises/ExerciseList';
import ExerciseDetail from '../pages/user/exercises/ExerciseDetail';

const UserRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lessons"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <LessonList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lessons/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <LessonDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ExerciseList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exercises/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ExerciseDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default UserRoutes;