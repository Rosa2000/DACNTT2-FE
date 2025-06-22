import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col, Input, Select, Button, message, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Layout from '../../../components/layout/Layout';
import PageHeader from '../../../components/pageHeader/PageHeader';
import { fetchLessons } from '../../../slices/lessonSlice';
import { fetchExercises } from '../../../slices/exerciseSlice';
import styles from './TestList.module.css';
import CustomSpinner from '../../../components/spinner/Spinner';

const { Option } = Select;

const LEVEL_MAP = {
  1: 'Cơ bản',
  2: 'Trung bình', 
  3: 'Nâng cao'
};

const STATUS_MAP = {
  1: { text: 'Hoạt động', color: 'green' },
  2: { text: 'Đã ẩn', color: 'red' }
};

const TestList = () => {
  const dispatch = useDispatch();
  const { lessons, loading: lessonsLoading } = useSelector((state) => state.lessons);
  const { exercises, loading: exercisesLoading } = useSelector((state) => state.exercises);
  const [searchText, setSearchText] = useState('');
  const [levelFilter, setLevelFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);

  useEffect(() => {
    dispatch(fetchLessons({ 
      page: 1, 
      pageSize: 1000,
      type: 'test' 
    }));
    dispatch(fetchExercises({
      page: 1,
      pageSize: 1000,
      // type: 'test' // Chỉ lấy bài kiểm tra
    }));
  }, [dispatch]);

  // Lọc bài học có type là test
  const testLessons = lessons.filter(lesson => lesson.type === 'test');

  // Lọc bài học theo tìm kiếm, cấp độ và danh mục
  const filteredTests = testLessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesLevel = !levelFilter || lesson.level === levelFilter;
    const matchesCategory = !categoryFilter || lesson.category === categoryFilter;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const handleClearFilters = () => {
    setSearchText('');
    setLevelFilter(null);
    setCategoryFilter(null);
  };

  const handleStartTest = (lessonId) => {
    // Chuyển đến trang chi tiết bài kiểm tra
    window.location.href = `/user/tests/${lessonId}`;
  };

  const getBreadcrumbItems = () => [
    { title: 'Trang chủ', path: '/user/dashboard' },
    { title: 'Bài kiểm tra', path: '/user/tests' }
  ];

  return (
    <Layout role="user">
      <PageHeader 
        title="Bài kiểm tra"
        breadcrumb={getBreadcrumbItems()}
      />
      
      <div className={styles.container}>
        {/* Bộ lọc */}
        <div className={styles.filters}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8}>
              <Input
                placeholder="Tìm kiếm bài kiểm tra..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col xs={12} sm={4}>
              <Select
                placeholder="Cấp độ"
                allowClear
                value={levelFilter}
                onChange={setLevelFilter}
                style={{ width: '100%' }}
              >
                <Option value={1}>Cơ bản</Option>
                <Option value={2}>Trung bình</Option>
                <Option value={3}>Nâng cao</Option>
              </Select>
            </Col>
          </Row>
        </div>

        <CustomSpinner spinning={lessonsLoading || exercisesLoading}>
          {/* Danh sách bài kiểm tra */}
          <Row gutter={[16, 16]}>
            {filteredTests.map((test) => {
              const testExercises = exercises.filter(ex => ex.lesson_id === test.id);
              const questionCount = testExercises.length;
              
              return (
                <Col xs={24} sm={12} lg={8} key={test.id}>
                  <Card
                    className={styles.testCard}
                    hoverable
                    actions={[
                      <Button 
                        type="primary" 
                        onClick={() => handleStartTest(test.id)}
                        disabled={test.status_id !== 1}
                        className={styles.startTestButton}
                      >
                        Xem chi tiết
                      </Button>
                    ]}
                  >
                    <div className={styles.testInfo}>
                      <h3 className={styles.testTitle}>{test.title}</h3>
                      <p className={styles.testDescription}>{test.description}</p>
                      
                      <div className={styles.testMeta}>
                        <Tag color="blue">{LEVEL_MAP[test.level] || 'Chưa phân loại'}</Tag>
                        {test.category && <Tag color="green">{test.category}</Tag>}
                      </div>
                      
                      <div className={styles.testStats}>
                        <span>Số câu hỏi: {questionCount}</span>
                        <span>Thời gian: {test.duration || 'Không giới hạn'} phút</span>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {!lessonsLoading && !exercisesLoading && filteredTests.length === 0 && (
            <div className={styles.emptyState}>
              <p>Không có bài kiểm tra nào phù hợp với bộ lọc.</p>
            </div>
          )}
        </CustomSpinner>
      </div>
    </Layout>
  );
};

export default TestList; 