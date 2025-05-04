import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('login');

  // Chuyển hướng nếu đang ở /auth
  useEffect(() => {
    if (location.pathname === '/auth') {
      navigate('/auth/login', { replace: true });
    }

    const path = location.pathname;
    if (path.includes('register')) setActiveTab('register');
    else if (path.includes('login')) setActiveTab('login');
    else if (path.includes('forgot-password')) setActiveTab(null);
  }, [location.pathname, navigate]);

  const switchToLogin = () => {
    setActiveTab('login');
    navigate('/auth/login');
  };

  const switchToForgotPassword = () => {
    setActiveTab(null);
    navigate('/auth/forgot-password');
  };

  return (
    <div className={styles.auth}>
      <div className={styles['auth-container']}>
        {!location.pathname.includes('forgot-password') && (
          <div className={styles.tabs}>
            <Link
              to="/auth/login"
              className={`${styles.tab} ${activeTab === 'login' ? styles.active : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Đăng Nhập
            </Link>
            <Link
              to="/auth/register"
              className={`${styles.tab} ${activeTab === 'register' ? styles.active : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Đăng Ký
            </Link>
          </div>
        )}

        <Routes>
          <Route
            path="login"
            element={<Login switchToForgotPassword={switchToForgotPassword} />}
          />
          <Route
            path="register"
            element={<Register switchToLogin={switchToLogin} />}
          />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </div>
  );
};

export default AuthPage;