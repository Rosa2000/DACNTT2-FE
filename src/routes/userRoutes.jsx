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
import TestList from '../pages/user/tests/TestList';
import TestDetail from '../pages/user/tests/TestDetail';

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
      {/* Test Routes */}
      <Route
        path="tests"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TestList />
          </ProtectedRoute>
        }
      />
      <Route
        path="tests/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TestDetail />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default UserRoutes;