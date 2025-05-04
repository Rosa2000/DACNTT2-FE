// src/components/DashboardRedirect.jsx
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DashboardRedirect = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const groupId = user?.user_group?.[0]?.group_id;
      console.log('User group ID:', groupId);
      const target = groupId === 1 ? '/admin/dashboard' : '/user/dashboard';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return null;
};

export default DashboardRedirect;
