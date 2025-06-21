import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { forgotPasswordAsync } from '../../slices/authSlice';
import styles from './AuthPage.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, successMessage } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPasswordAsync({ email }));
  };

  useEffect(() => {
    if (status === 'succeeded' && successMessage) {
      message.success(successMessage);
      navigate('/auth');
    } else if (status === 'failed' && error) {
      message.error(error);
    }
  }, [status, error, successMessage, navigate]);

  return (
    <div className={styles['form-content']}>
      <h2 className={styles['form-title']}>Quên mật khẩu</h2>
      <p className={styles['form-description']}>
        Vui lòng nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu vào email của bạn.
      </p>
      <form onSubmit={handleSubmit}>
        {error && <div className={styles['error-message']}>{error}</div>}
        <div className={styles['form-group']}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            className={styles.input}
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className={styles['submit-button']}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </button>
        <div className={styles['back-to-login']}>
          <a href="#" onClick={() => navigate('/auth')}>
            Quay lại đăng nhập
          </a>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;