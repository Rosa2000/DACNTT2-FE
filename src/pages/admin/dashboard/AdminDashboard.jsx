import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, BookOutlined, CheckCircleOutlined, LineChartOutlined } from '@ant-design/icons';
import Layout from '../../../components/layout/Layout';
import TimeSeriesChart from '../../../components/timeSeriesChart/TimeSeriesChart';
import GroupedColumnChart from '../../../components/groupedColumnChart/GroupedColumnChart';

const title = 'Admin Dashboard';
const description = 'Chào mừng đến với bảng điều khiển dành cho Admin.';
const AdminDashboard = () => {
  // Dữ liệu mẫu cho biểu đồ tăng trưởng người dùng
  const userGrowthData = [
    { date: '2024-01', value: 100 },
    { date: '2024-02', value: 150 },
    { date: '2024-03', value: 200 },
    { date: '2024-04', value: 280 },
    { date: '2024-05', value: 350 },
    { date: '2024-06', value: 420 },
  ];

  // Dữ liệu mẫu cho biểu đồ tiến độ học tập
  const learningProgressData = [
    { category: 'Beginner', type: 'Hoàn thành', value: 75 },
    { category: 'Beginner', type: 'Đang học', value: 25 },
    { category: 'Intermediate', type: 'Hoàn thành', value: 45 },
    { category: 'Intermediate', type: 'Đang học', value: 35 },
    { category: 'Advanced', type: 'Hoàn thành', value: 30 },
    { category: 'Advanced', type: 'Đang học', value: 20 },
  ];

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
            <TimeSeriesChart
              title="Tăng trưởng người dùng"
              data={userGrowthData}
              yField="value"
            />
          </Col>
          <Col span={12}>
            <GroupedColumnChart
              title="Tiến độ học tập"
              data={learningProgressData}
              xField="category"
              yField="value"
              seriesField="type"
            />
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