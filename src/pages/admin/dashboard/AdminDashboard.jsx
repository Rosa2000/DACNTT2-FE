import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Spin } from 'antd';
import { UserOutlined, BookOutlined, CheckCircleOutlined, LineChartOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../components/layout/Layout';
import TimeSeriesChart from '../../../components/timeSeriesChart/TimeSeriesChart';
import GroupedColumnChart from '../../../components/groupedColumnChart/GroupedColumnChart';
import styles from './AdminDashboard.module.css';
import PageTitle from '../../../components/pageTitle/PageTitle';
import { getLessons } from '../../../api/lessonApi';
import { fetchDashboardStatistics } from '../../../slices/statisticsSlice';

const title = 'Admin Dashboard';
const description = 'Chào mừng đến với bảng điều khiển dành cho Admin.';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, loading } = useSelector((state) => state.statistics);
  const [totalLessons, setTotalLessons] = useState(0);
  const [selectedMonths, setSelectedMonths] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        // Lấy dữ liệu thống kê
        dispatch(fetchDashboardStatistics({
          page: 1,
          pageSize: 5,
          sort: 'created_date_desc',
          selectedMonths
        }));
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchData();
  }, [dispatch, selectedMonths]);

  const handleMonthsChange = (value) => {
    setSelectedMonths(value);
  };

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
                  value={dashboardData.totalUsers}
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
              {/* <Card> */}
                <Spin spinning={loading}>
                  <TimeSeriesChart
                    title="Tăng trưởng người dùng"
                    data={dashboardData.userGrowth}
                    yField="value"
                    selectedMonths={selectedMonths}
                    onMonthsChange={handleMonthsChange}
                  />
                </Spin>
              {/* </Card> */}
            </Col>
            <Col xs={24} lg={12}>
              {/* <Card> */}
                <Spin spinning={loading}>
                  <GroupedColumnChart
                    title="Tiến độ học tập"
                    data={learningProgressData}
                    xField="category"
                    yField="value"
                    seriesField="type"
                    colors={['#58cc02']}
                  />
                </Spin>
              {/* </Card> */}
            </Col>
          </Row>

          {/* Danh sách người dùng mới nhất */}
          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="Người dùng mới nhất">
                <Table
                  dataSource={dashboardData.latestUsers}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  bordered={false}
                  style={{ background: 'transparent' }}
                  columns={[
                    {
                      title: 'Tên đăng nhập',
                      dataIndex: 'username',
                      key: 'username',
                      align: 'left',
                      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>
                    },
                    {
                      title: 'Họ tên',
                      dataIndex: 'fullname',
                      key: 'fullname',
                      align: 'left',
                      render: (text) => <span>{text || 'Chưa cập nhật'}</span>
                    },
                    {
                      title: 'Ngày tạo',
                      dataIndex: 'created_date',
                      key: 'created_date',
                      align: 'center',
                      render: (date) =>
                        date
                          ? <span style={{ color: '#888' }}>{new Date(date).toLocaleDateString('vi-VN')}</span>
                          : <span style={{ color: '#aaa' }}>Không có</span>
                    }
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Layout>
    </>
  );
};

export default AdminDashboard;