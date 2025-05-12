import { React, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../../slices/authSlice';
import {
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  HomeOutlined,
  BookOutlined,
  FileTextOutlined,
  BarChartOutlined,
  TeamOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import Button from '../button/Button';
import styles from './Layout.module.css';
import { persistor } from '../../store';
import PageHeader from '../pageHeader/PageHeader';

const Layout = ({ children, pageHeaderTitle, pageHeaderSubtitle, pageHeaderBreadcrumb, pageHeaderRightContent }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, role } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để truy cập!');
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location]);

  if (!isAuthenticated) return null;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
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

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? styles.active : '';
  };

  const menuItems = role === 'admin' ? [
    { path: '/admin/lessons', icon: <BookOutlined />, label: 'Quản lý bài học' },
    { path: '/admin/exercises', icon: <FileTextOutlined />, label: 'Quản lý bài tập' },
    { path: '/admin/users', icon: <TeamOutlined />, label: 'Quản lý người dùng' },
    { path: '/admin/statistics', icon: <BarChartOutlined />, label: 'Thống kê' },
  ] : [
    { path: '/', icon: <HomeOutlined />, label: 'Trang Chủ' },
    { path: '/user/lessons', icon: <BookOutlined />, label: 'Học Ngữ Pháp' },
    { path: '/user/exercises', icon: <FileTextOutlined />, label: 'Bài Tập' },
    { path: '/user/test', icon: <BarChartOutlined />, label: 'Kiểm Tra Trình Độ' },
  ];

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
        <div className={styles['sidebar-header']}>
          <Link to="/" className={styles.logo}>
            EZ English
          </Link>
          <Button
            variant="text"
            onClick={toggleSidebar}
            className={styles['collapse-button']}
            icon={<MenuOutlined />}
          />
        </div>

        <nav className={styles['sidebar-nav']}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles['nav-item']} ${isActive(item.path)}`}
            >
              <span className={styles['nav-icon']}>{item.icon}</span>
              {!isSidebarCollapsed && <span className={styles['nav-label']}>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles['sidebar-footer']}>
          <div className={styles['user-menu']}>
            <Button
              variant="text"
              onClick={toggleDropdown}
              className={styles['user-button']}
              icon={<UserOutlined className={styles['user-icon']} />}
            >
              {!isSidebarCollapsed && <span className={styles['username']}>{username}</span>}
            </Button>
            {isDropdownOpen && (
              <div className={styles.dropdown}>
                <Link
                  to="/user/profile"
                  className={styles['dropdown-item']}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <UserOutlined /> Hồ sơ
                </Link>
                <Button
                  variant="text"
                  onClick={handleLogout}
                  className={styles['dropdown-item']}
                  icon={<LogoutOutlined />}
                >
                  Đăng xuất
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className={`${styles['main-container']} ${isSidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        {pageHeaderTitle && (
          <PageHeader 
            title={pageHeaderTitle} 
            subtitle={pageHeaderSubtitle} 
            breadcrumb={pageHeaderBreadcrumb} 
            rightContent={pageHeaderRightContent}
          />
        )}
        <main className={styles.main}>{children}</main>

        <footer className={styles.footer}>
          <div className={styles['footer-content']}>
            <div className={styles['footer-section']}>
              <h4>EZ English</h4>
              <p>Nền tảng học tiếng Anh trực tuyến hàng đầu Việt Nam</p>
              <p>Giúp bạn học tiếng Anh một cách hiệu quả và thú vị</p>
            </div>
            <div className={styles['footer-section']}>
              <h4>Liên Hệ</h4>
              <p>
                <strong>Email:</strong> support@ezenglish.com
              </p>
              <p>
                <strong>Hotline:</strong> 0123 456 789
              </p>
              <p>
                <strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, TP.HCM
              </p>
            </div>
            <div className={styles['footer-section']}>
              <h4>Theo Dõi Chúng Tôi</h4>
              <div className={styles['social-links']}>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook"></i> Facebook
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-youtube"></i> YouTube
                </a>
              </div>
            </div>
            <div className={styles['footer-section']}>
              <h4>Liên Kết Nhanh</h4>
              <div className={styles['quick-links']}>
                <Link to="/about">Về Chúng Tôi</Link>
                <Link to="/privacy">Chính Sách Bảo Mật</Link>
                <Link to="/terms">Điều Khoản Sử Dụng</Link>
                <Link to="/faq">Câu Hỏi Thường Gặp</Link>
              </div>
            </div>
          </div>
          <div className={styles['footer-bottom']}>
            <p className={styles.copyright}>
              © 2024 EZ English. All rights reserved.
            </p>
            <div className={styles['footer-bottom-links']}>
              <Link to="/privacy">Bảo Mật</Link>
              <Link to="/terms">Điều Khoản</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;