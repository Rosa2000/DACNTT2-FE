import { React, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../../slices/authSlice';
import styles from './Layout.module.css';
import { persistor } from '../../store';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để truy cập!');
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Đăng xuất thành công!');
    setIsDropdownOpen(false);
    persistor.purge();
    localStorage.removeItem('token');
    localStorage.removeItem('persist:root');
    navigate('/auth/login');
  };

  const username = user?.fullname || user?.username || 'Người dùng';

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles['header-container']}>
          <div className="flex items-center">
            <Link to="/" className={styles.logo}>
              EZ English
            </Link>
          </div>
          <nav className={styles.nav}>
            {role === 'admin' ? (
              // Nếu là admin, hiển thị các liên kết quản lý
              <>
                <Link to="/admin/vocabulary">Quản lý bài học</Link>
                <Link to="/admin/quiz">Quản lý bài tập</Link>
                <Link to="/admin/users">Quản lý người dùng</Link>
                <Link to="/admin/statistics">Thống kê</Link>
              </>
            ) : (
              // Nếu không phải admin, hiển thị các liên kết khác
              <>
                <Link to="/">Trang Chủ</Link>
                <Link to="/lessons">Học Ngữ Pháp</Link>
                <Link to="/exercises">Bài Tập</Link>
                <Link to="/test">Kiểm Tra Trình Độ</Link>
              </>
            )}
            <div className={styles['user-menu']}>
              <button onClick={toggleDropdown} className={styles['user-button']}>
                Xin chào {username} <span className={styles.arrow}>▼</span>
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdown}>
                  <Link
                    to="/profile"
                    className={styles['dropdown-item']}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Hồ sơ
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={styles['dropdown-item']}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>{children}</main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles['footer-content']}>
          <h4>Liên Hệ Với Chúng Tôi</h4>
          <p>Email: support@ezenglish.com | Hotline: 0123 456 789</p>
          <div className={styles['social-links']}>
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
          </div>
          <p className={styles.copyright}>© 2025 EZ English. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;