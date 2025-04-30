import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUserAsync } from '../../slices/authSlice';
import { toast } from 'react-toastify';
import styles from './AuthPage.module.css';

const Register = ({ switchToLogin }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerUserAsync(formData)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        switchToLogin();
      }
    });
  };

  return (
    <div className={styles['form-content']}>
      <h2 className={styles['form-title']}>Đăng Ký</h2>
      <form onSubmit={handleSubmit}>
        {auth.error && <div className={styles["error-message"]}>{auth.error}</div>}
        
        <div className={styles["form-group"]}>
          <label className={styles.label} htmlFor="fullname">Họ và tên</label>
          <input
            type="text"
            id="fullname"
            className={styles.input}
            placeholder="Nhập họ và tên"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles["form-group"]}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className={styles.input}
            placeholder="Nhập email của bạn"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles["form-group"]}>
          <label className={styles.label} htmlFor="phoneNumber">Số điện thoại</label>
          <input
            type="tel"
            id="phoneNumber"
            className={styles.input}
            placeholder="Nhập số điện thoại"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles["form-group"]}>
          <label className={styles.label} htmlFor="username">Tên đăng nhập</label>
          <input
            type="text"
            id="username"
            className={styles.input}
            placeholder="Nhập tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles["form-group"]}>
          <label className={styles.label} htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            className={styles.input}
            placeholder="Nhập mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className={styles['submit-button']} disabled={auth.loading}>
          {auth.loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
};

export default Register;