import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from '../pages/Register';
import Categories from '../pages/Categories';
import Dashboard from '../pages/Dashboard';
import Movies from '../pages/Movies';
import { useStore } from '../store/useStore';

// ProtectedRoute ensures users registration or categories
const ProtectedRoute = ({ children, requireCategories = false }) => {
  const { user, selectedCategories } = useStore();

  if (!user) {
    return <Navigate to="/register" replace />;
  }

  if (requireCategories && selectedCategories.length < 3) {
    return <Navigate to="/categories" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { user, selectedCategories } = useStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            !user ? (
              <Navigate to="/register" replace />
            ) : selectedCategories.length < 3 ? (
              <Navigate to="/categories" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireCategories={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/movies"
          element={
            <ProtectedRoute requireCategories={true}>
              <Movies />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
