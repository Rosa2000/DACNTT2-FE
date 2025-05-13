// src/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

/**
 * @param {ReactNode} children - Component con cần bảo vệ
 * @param {boolean} isAdmin - Nếu true thì chỉ admin mới vào được
 */
const ProtectedRoute = ({ children, isAdmin = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
    } else if (isAdmin && role !== 'admin') {
      navigate('/not-authorized', { replace: true });
    }
  }, [isAuthenticated, role, isAdmin, navigate]);

  if (!isAuthenticated || (isAdmin && role !== 'admin')) return null;

  return children;
};

export default ProtectedRoute;