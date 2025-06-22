import { React, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
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
  FileDoneOutlined,
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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    if (!isAuthenticated) {
      message.error('Vui lòng đăng nhập để truy cập!');
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setIsDropdownOpen(false);
    setIsMobileSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated) return null;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    dispatch(logout());
    message.success('Đăng xuất thành công!');
    setIsDropdownOpen(false);
    persistor.purge();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('persist:root');
    navigate('/auth/login');
    window.location.reload();
  };

  const username = user?.fullname || user?.username || 'Người dùng';

  const isActive = (path) => {
    // Nếu là trang chủ
    if (path === '/') {
      return location.pathname === '/' ? styles.active : '';
    }
    // Các mục khác: chỉ active nếu path trùng hoàn toàn hoặc là prefix đúng (ví dụ: /user/lessons hoặc /user/lessons/abc)
    return (location.pathname === path || location.pathname.startsWith(path + '/')) ? styles.active : '';
  };

  const menuItems = role === 'admin' ? [
    { path: '/admin/dashboard', icon: <HomeOutlined />, label: 'Dashboard' },
    { path: '/admin/lessons', icon: <BookOutlined />, label: 'Quản lý bài học' },
    { path: '/admin/exercises', icon: <FileTextOutlined />, label: 'Quản lý bài tập' },
    { path: '/admin/tests', icon: <BarChartOutlined />, label: 'Quản lý bài kiểm tra' },
    { path: '/admin/users', icon: <TeamOutlined />, label: 'Quản lý người dùng' },
    // { path: '/admin/statistics', icon: <BarChartOutlined />, label: 'Thống kê' },
  ] : [
    { path: '/user/dashboard', icon: <HomeOutlined />, label: 'Trang Chủ' },
    { path: '/user/lessons', icon: <BookOutlined />, label: 'Học Ngữ Pháp' },
    { path: '/user/tests', icon: <BarChartOutlined />, label: 'Bài Kiểm Tra' },
  ];

  const handleMenuClick = () => {
    if (window.innerWidth <= 768) setIsMobileSidebarOpen(false);
  };

  return (
    <div className={styles.layout}>
      {isMobile && (
      <Button
        variant="text"
        onClick={() => setIsMobileSidebarOpen(true)}
        className={styles['hamburger-button']}
        icon={<MenuOutlined />}
      />
      )}
      {isMobile && isMobileSidebarOpen && (
        <>
        <div className={styles.overlay} onClick={() => setIsMobileSidebarOpen(false)}></div>
          <nav className={styles['mobile-menu']}>
            <div className={styles['mobile-menu-header']}>
              <Link to="/" className={styles.logo} onClick={() => setIsMobileSidebarOpen(false)}>
                EZ English
              </Link>
              <Button
                variant="text"
                onClick={() => setIsMobileSidebarOpen(false)}
                className={styles['mobile-menu-close']}
                icon={<span style={{fontSize: 28, fontWeight: 'bold'}}>&times;</span>}
              />
            </div>
            <div className={styles['mobile-menu-list']}>
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={styles['mobile-menu-item']}
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <span className={styles['nav-icon']}>{item.icon}</span>
                  <span className={styles['nav-label']}>{item.label}</span>
                </Link>
              ))}
            </div>
            <div className={styles['mobile-menu-footer']}>
              <div className={styles['user-menu'] + ' ' + styles['mobile-menu-user']}>
                <Button
                  variant="text"
                  onClick={toggleDropdown}
                  className={styles['user-button']}
                  icon={<UserOutlined className={styles['user-icon']} />}
                >
                  <span className={styles['username']}>{username}</span>
                </Button>
                {isDropdownOpen && (
                  <div className={styles.dropdown}>
                    <Link
                      to="/profile"
                      className={styles['dropdown-item']}
                      onClick={() => { setIsDropdownOpen(false); setIsMobileSidebarOpen(false); }}
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
          </nav>
        </>
      )}
      {!isMobile && (
      <aside className={
          `${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`
      }>
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
              onClick={handleMenuClick}
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
                  to="/profile"
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
      )}
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