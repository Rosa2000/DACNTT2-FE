import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, BookOutlined, CheckCircleOutlined, LineChartOutlined } from '@ant-design/icons';
import Layout from '../../../components/layout/Layout';
import UserGrowthChart from '../../../components/admin/charts/UserGrowthChart';
import LearningProgressChart from '../../../components/admin/charts/LearningProgressChart';

const title = 'Admin Dashboard';
const description = 'Chào mừng đến với bảng điều khiển dành cho Admin.';
const AdminDashboard = () => {
  return (
    <Layout>
      <div className="dashboard-container">
        {/* Thống kê tổng quan */}
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng số người dùng"
                value={1128}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tổng số bài học"
                value={50}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Bài kiểm tra đã tạo"
                value={25}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Tỷ lệ hoàn thành"
                value={75}
                suffix="%"
                prefix={<LineChartOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Biểu đồ thống kê */}
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card title="Tăng trưởng người dùng">
              <UserGrowthChart />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Tiến độ học tập">
              <LearningProgressChart />
            </Card>
          </Col>
        </Row>

        {/* Danh sách người dùng mới nhất */}
        <Row style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="Người dùng mới nhất">
              {/* Component hiển thị danh sách người dùng */}
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default AdminDashboard;