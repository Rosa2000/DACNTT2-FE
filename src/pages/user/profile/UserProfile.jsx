import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from '../../../components/layout/Layout';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender || '',
    address: user?.address || '',
    ward: user?.ward || '',
    district: user?.district || '',
    province: user?.province || '',
    country: user?.country || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Xử lý cập nhật thông tin
    console.log('Form submitted:', formData);
  };

  return (
    <Layout>
      <div className={styles.profileContainer}>
        <h2>Thông tin tài khoản</h2>
        
        {/* Thông tin cơ bản */}
        <section className={styles.profileSection}>
          <h3>Thông tin cá nhân</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="fullname">Họ và tên</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phoneNumber">Số điện thoại</label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gender">Giới tính</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ward">Phường/Xã</label>
              <input
                type="text"
                id="ward"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="district">Quận/Huyện</label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="province">Tỉnh/Thành phố</label>
              <input
                type="text"
                id="province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="country">Quốc gia</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="newPassword">Mật khẩu mới</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div className={styles.buttonGroup}>
              {!isEditing ? (
                <button
                  type="button"
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  Chỉnh sửa
                </button>
              ) : (
                <>
                  <button type="submit" className={styles.saveButton}>
                    Lưu thay đổi
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => setIsEditing(false)}
                  >
                    Hủy
                  </button>
                </>
              )}
            </div>
          </form>
        </section>
      </div>
    </Layout>
  );
};

export default UserProfile;
