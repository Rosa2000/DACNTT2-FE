// src/routes/userRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from '../components/ProtectedRoute';
import UserDashboard from '../pages/user/dashboard/UserDashboard';
import LessonList from '../pages/user/lessons/lessonList/LessonList';
import LessonDetail from '../pages/user/lessons/lessonDetail/LessonDetail';
import ExerciseDetail from '../pages/user/exercises/exerciseDetail/ExerciseDetail';
import Categories from '../pages/user/lessons/categories/Categories';

const UserRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* <Route
        path="profile"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <UserProfile />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      {/* Lesson Routes */}
      <Route
        path="lessons"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="lessons/level/:level"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <LessonList />
          </ProtectedRoute>
        }
      />
      <Route
        path="lessons/category/:category"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <LessonList />
          </ProtectedRoute>
        }
      />
      <Route
        path="lessons/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <LessonDetail />
          </ProtectedRoute>
        }
      />
      {/* Exercise Routes */}
      <Route
        path="lessons/:lessonId/exercises"
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