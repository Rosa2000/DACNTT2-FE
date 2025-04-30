import React from 'react';
import Layout from '../../../components/Layout';

const AdminDashboard = () => {
  return (
    <Layout role="admin">
      <h2>Admin Dashboard</h2>
      <p>Chào mừng đến với bảng điều khiển dành cho Admin.</p>
      <p>Quản lý bài học và bài tập từ menu bên trái.</p>
    </Layout>
  );
};

export default AdminDashboard;