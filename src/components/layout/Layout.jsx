import { React, useState, useEffect } from 'react'; // Thêm useEffect
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../../pages/auth'; // Import từ index.js của auth
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // Lấy thông tin người dùng từ Redux
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isLoggedIn = !!user; // Kiểm tra trạng thái đăng nhập
  const username = user?.fullname;

  // Kiểm tra trạng thái đăng nhập và điều hướng nếu chưa đăng nhập
  useEffect(() => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để truy cập!');
      navigate('/auth/login');
    }
  }, [isLoggedIn, navigate]);

  // Nếu chưa đăng nhập, không render gì cả
  if (!isLoggedIn) {
    return null;
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Đăng xuất thành công!');
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <div className={styles.layout}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles['header-container']}>
          <div className="flex items-center">
            <Link to="/" className={styles.logo}>
              EZ English
            </Link>
          </div>
          <nav className={styles.nav}>
            {user.isAdmin ? (
              // Header cho Admin
              <>
                <Link to="/admin/vocabulary">Quản lý bài học</Link>
                <Link to="/admin/quiz">Quản lý bài tập</Link>
                <Link to="/admin/users">Quản lý người dùng</Link>
                <Link to="/admin/statistics">Thống kê</Link>
              </>
            ) : (
              // Header cho User
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

      {/* Nội dung của trang */}
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