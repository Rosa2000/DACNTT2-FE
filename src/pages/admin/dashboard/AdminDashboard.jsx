import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, BookOutlined, CheckCircleOutlined, LineChartOutlined } from '@ant-design/icons';
import Layout from '../../../components/layout/Layout';
import TimeSeriesChart from '../../../components/timeSeriesChart/TimeSeriesChart';
import GroupedColumnChart from '../../../components/groupedColumnChart/GroupedColumnChart';
import styles from './AdminDashboard.module.css';
import PageTitle from '../../../components/pageTitle/PageTitle';
import { getUsers } from '../../../api/userManagementApi';
import { getLessons } from '../../../api/lessonApi';

const title = 'Admin Dashboard';
const description = 'Chào mừng đến với bảng điều khiển dành cho Admin.';
const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy tổng số người dùng
        const userResponse = await getUsers();
        if (userResponse.data.code === 0) {
          setTotalUsers(userResponse.data.total);
        }

        // Lấy tổng số bài học
        const lessonResponse = await getLessons({
          page: 1,
          pageSize: 10,
          filters: '',
          level: null,
          category: null,
          status_id: null
        });
        if (lessonResponse.data.code === 0) {
          setTotalLessons(lessonResponse.data.data.total);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchData();
  }, []);

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
    { category: 'Cơ bản', type: 'Hoàn thành', value: 75 },
    { category: 'Cơ bản', type: 'Đang học', value: 25 },
    { category: 'Trung bình', type: 'Hoàn thành', value: 45 },
    { category: 'Trung bình', type: 'Đang học', value: 35 },
    { category: 'Nâng cao', type: 'Hoàn thành', value: 30 },
    { category: 'Nâng cao', type: 'Đang học', value: 20 },
  ];

  return (
    <>
      <PageTitle title={title} />
      <Layout pageHeaderTitle={title} pageHeaderSubtitle={description}>
        <div className={styles.dashboardContainer}>
          {/* Thống kê tổng quan */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Card className={styles.statisticCard}>
                <Statistic
                  title="Tổng số người dùng"
                  value={totalUsers}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Card className={styles.statisticCard}>
                <Statistic
                  title="Tổng số bài học"
                  value={totalLessons}
                  prefix={<BookOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Card className={styles.statisticCard}>
                <Statistic
                  title="Bài kiểm tra đã tạo"
                  value={25}
                  prefix={<CheckCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Card className={styles.statisticCard}>
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
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={12}>
              <Card>
                <TimeSeriesChart
                  title="Tăng trưởng người dùng"
                  data={userGrowthData}
                  yField="value"
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card>
                <GroupedColumnChart
                  title="Tiến độ học tập"
                  data={learningProgressData}
                  xField="category"
                  yField="value"
                  seriesField="type"
                  colors={['#58cc02']}
                />
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
    </>
  );
};

export default AdminDashboard;