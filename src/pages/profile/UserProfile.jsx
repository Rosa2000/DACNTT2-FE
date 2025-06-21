import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import styles from './UserProfile.module.css';
import Layout from '../../components/layout/Layout';
import Button from '../../components/button/Button';
import Modal from '../../components/modal/Modal';
import { selectUser } from '../../slices/authSlice';
import { 
  fetchUserProfile, 
  updateUserProfile, 
  updateUserPasswordProfile,
  selectProfile,
  selectProfileStatus,
  clearProfileMessages,
} from '../../slices/profileSlice';
import Spinner from '../../components/spinner/Spinner';

const UserProfile = () => {
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectUser); // User from authSlice to get ID
  const profile = useSelector(selectProfile); // Profile data from profileSlice
  const status = useSelector(selectProfileStatus);
  const { error, successMessage } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    fullname: '',
    phone_number: '',
    gender: '',
    ward: '',
    district: '',
    province: '',
    country: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  // Fetch profile on component mount
  useEffect(() => {
    if (loggedInUser?.id) {
      dispatch(fetchUserProfile(loggedInUser.id));
    }
    // Only clear messages when component unmounts
    return () => {
      // Don't clear messages on mount, only on unmount
    }
  }, [loggedInUser, dispatch]);

  // Show toast when success message changes
  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      dispatch(clearProfileMessages());
    }
  }, [successMessage, dispatch]);

  // Show toast when error changes
  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearProfileMessages());
    }
  }, [error, dispatch]);

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearProfileMessages());
    }
  }, [dispatch]);

  // Update form data when profile data is loaded/updated
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullname: profile.fullname || '',
        phone_number: profile.phone_number || '',
        gender: profile.gender || '',
        ward: profile.ward || '',
        district: profile.district || '',
        province: profile.province || '',
        country: profile.country || '',
      }));
    }
  }, [profile]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = () => {
    setModalState({
      isOpen: true,
      title: 'Xác nhận cập nhật',
      message: 'Bạn có chắc chắn muốn lưu các thay đổi thông tin cá nhân không?',
      onConfirm: () => confirmUpdateProfile(),
    });
  };

  const confirmUpdateProfile = () => {
    const profileData = {
      fullname: formData.fullname,
      phoneNumber: formData.phone_number,
      gender: formData.gender,
      ward: formData.ward,
      district: formData.district,
      province: formData.province,
      country: formData.country,
    };
    dispatch(updateUserProfile({ userId: loggedInUser.id, data: { data: profileData } }))
      .then((result) => {
      })
      .catch((error) => {
      });
    setModalState({ isOpen: false });
  };

  const handleUpdatePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      return;
    }
    setModalState({
      isOpen: true,
      title: 'Xác nhận đổi mật khẩu',
      message: 'Bạn có chắc chắn muốn cập nhật mật khẩu mới không?',
      onConfirm: () => confirmUpdatePassword(),
    });
  };
  
  const confirmUpdatePassword = () => {
    const passwordData = {
      email: profile?.email,
      oldPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    };
    dispatch(updateUserPasswordProfile({ userId: loggedInUser.id, data: passwordData }))
      .then((result) => {
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: ''}));
      })
      .catch((error) => {
      });
    setModalState({ isOpen: false });
  };

  const closeModal = () => {
    setModalState({ isOpen: false });
  };

  if (status === 'loading' && !profile) {
    return <Layout><Spinner /></Layout>;
  }

  return (
    <Layout
      pageHeaderTitle="Hồ sơ"
      pageHeaderSubtitle="Quản lý thông tin cá nhân và bảo mật tài khoản của bạn"
    >
      <Modal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={modalState.onConfirm}
        title={modalState.title}
      >
        <p>{modalState.message}</p>
      </Modal>

      <div className={styles.profileContainer}>
        {/* Card 1: Account Information (no form needed) */}
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Thông tin tài khoản</h3>
          <div className={styles.fieldRow}>
            <label className={styles.label} htmlFor="username">Tên đăng nhập</label>
            <div className={styles.inputGroup}><input id="username" value={profile?.username || ''} disabled /></div>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label} htmlFor="email">Email</label>
            <div className={styles.inputGroup}><input id="email" value={profile?.email || ''} disabled /></div>
          </div>
        </div>
        
        {/* Card 2: Personal Information Form */}
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Thông tin cá nhân</h3>
          <div className={styles.fieldRow}>
            <label className={styles.label} htmlFor="fullname">Họ và tên</label>
            <div className={styles.inputGroup}><input id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} /></div>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label} htmlFor="phone_number">Số điện thoại</label>
            <div className={styles.inputGroup}><input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} /></div>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label} htmlFor="gender">Giới tính</label>
            <div className={styles.inputGroup}>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label} htmlFor="ward">Phường/Xã</label>
            <div className={styles.inputGroup}><input id="ward" name="ward" value={formData.ward} onChange={handleChange} /></div>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label} htmlFor="district">Quận/Huyện</label>
            <div className={styles.inputGroup}><input id="district" name="district" value={formData.district} onChange={handleChange} /></div>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label} htmlFor="province">Tỉnh/Thành phố</label>
            <div className={styles.inputGroup}><input id="province" name="province" value={formData.province} onChange={handleChange} /></div>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label} htmlFor="country">Quốc gia</label>
            <div className={styles.inputGroup}><input id="country" name="country" value={formData.country} onChange={handleChange} /></div>
          </div>
          <div className={styles.buttonGroup}>
            <Button onClick={handleUpdateProfile} category="success">Lưu thay đổi</Button>
          </div>
        </div>

        {/* Card 3: Change Password Form */}
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>Mật khẩu</h3>
          <div className={styles.fieldRow}>
            <label className={styles.label} htmlFor="currentPassword">Mật khẩu hiện tại</label>
            <div className={styles.inputGroup}><input type="password" id="currentPassword" name="currentPassword" value={formData.currentPassword} onChange={handleChange} /></div>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label} htmlFor="newPassword">Mật khẩu mới</label>
            <div className={styles.inputGroup}><input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} /></div>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.label} htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
            <div className={styles.inputGroup}><input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} /></div>
          </div>
          <div className={styles.buttonGroup}>
             <Button onClick={handleUpdatePassword} category="primary">
               Cập nhật mật khẩu
             </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
