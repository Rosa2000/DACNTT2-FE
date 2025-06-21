import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import { loginUserAsync, verifyLoginAsync } from '../../slices/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { loginWithGoogle } from '../../api/authApi';

const Login = ({ switchToForgotPassword }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error: reduxError } = useSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError(null); // Xóa lỗi cũ trước khi gửi request
    dispatch(loginUserAsync({ username, password })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(verifyLoginAsync()).then((verifyResult) => {
          if (verifyResult.meta.requestStatus === 'fulfilled') {
            message.success('Đăng nhập thành công!');
            const groupId = verifyResult.payload?.user_group?.[0]?.group_id;
            if (groupId === 1) {
              navigate('/admin/dashboard');
            } else {
              navigate('/user/dashboard');
            }
          } else {
            setLoginError('Không thể xác thực tài khoản');
          }
        });
      } else {
        // Ưu tiên lấy message từ redux (nếu có)
        setLoginError(result.payload || reduxError || 'Tên đăng nhập hoặc mật khẩu không đúng');
      }
    });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const { email } = decoded;
      const response = await loginWithGoogle(email);
      if (response.data.code === 0) {
        // Lưu token vào localStorage
        localStorage.setItem('token', response.data.token);
        dispatch(loginUserAsync({ username: email, password: '' })).then((result) => {
          if (result.meta.requestStatus === 'fulfilled') {
            message.success('Đăng nhập Google thành công!');
            navigate('/dashboard');
          }
        });
      } else {
        message.error(response.data.message || 'Đăng nhập Google thất bại!');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Đăng nhập Google thất bại!');
    }
  };

  const handleGoogleError = () => {
    message.error('Đăng nhập Google thất bại!');
  };

  return (
    <div className={styles['form-content']}>
      <h2 className={styles['form-title']}>Đăng Nhập</h2>
      <form onSubmit={handleSubmit}>
        {(loginError || reduxError) && (
          <div className={styles['error-message']}>
            {loginError || reduxError}
          </div>
        )}
        <div className={styles['form-group']}>
          <label className={styles.label} htmlFor="username">
            Tên đăng nhập
          </label>
          <input
            type="text"
            id="username"
            className={styles.input}
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles['form-group']}>
          <label className={styles.label} htmlFor="password">
            Mật khẩu
          </label>
          <input
            type="password"
            id="password"
            className={styles.input}
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={styles['submit-button']}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        <div className={styles['forgot-password']}>
          <a href="#" onClick={switchToForgotPassword}>
            Quên mật khẩu?
          </a>
        </div>
        <div className={styles['divider']}>
          <span>Hoặc</span>
        </div>
        <div className={styles['google-login']}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signin_with"
            width="336"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;