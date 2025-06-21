import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { message } from 'antd';
import { resetPasswordAsync } from '../../slices/authSlice';
import styles from './AuthPage.module.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, successMessage } = useSelector((state) => state.auth);

  // Kiểm tra token khi component mount
  useEffect(() => {
    if (!token) {
      message.error('Token không hợp lệ hoặc đã hết hạn!');
      navigate('/auth');
    }
  }, [token, navigate]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error khi user bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validation form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(resetPasswordAsync({ token, newPassword: formData.newPassword }));
  };

  // Xử lý response từ Redux
  useEffect(() => {
    if (status === 'succeeded' && successMessage) {
      message.success(successMessage);
      // Chuyển về trang login sau 2 giây
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } else if (status === 'failed' && error) {
      message.error(error);
    }
  }, [status, error, successMessage, navigate]);

  if (!token) {
    return null; // Không render gì nếu không có token
  }

  return (
    <div className={styles['form-content']}>
      <h2 className={styles['form-title']}>Đặt lại mật khẩu</h2>
      <p className={styles['form-description']}>
        Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className={styles['form-group']}>
          <label className={styles.label} htmlFor="newPassword">
            Mật khẩu mới
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className={`${styles.input} ${errors.newPassword ? styles['input-error'] : ''}`}
            placeholder="Nhập mật khẩu mới"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          {errors.newPassword && (
            <div className={styles['error-message']}>{errors.newPassword}</div>
          )}
        </div>

        <div className={styles['form-group']}>
          <label className={styles.label} htmlFor="confirmPassword">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`${styles.input} ${errors.confirmPassword ? styles['input-error'] : ''}`}
            placeholder="Nhập lại mật khẩu mới"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <div className={styles['error-message']}>{errors.confirmPassword}</div>
          )}
        </div>

        <button
          type="submit"
          className={styles['submit-button']}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
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

export default ResetPassword; 