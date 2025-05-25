import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../../components/layout/Layout';
import { fetchExercises } from '../../../../slices/exerciseSlice';
import { fetchLessons } from '../../../../slices/lessonSlice';
import { Button, Space, Input, Select, Row, Col, Typography } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styles from './ExerciseList.module.css';
import { useNavigate } from 'react-router-dom';
import LessonHorizontalCard from '../../../../components/lessonHorizontalCard/LessonHorizontalCard';

const { Option } = Select;
const { Title, Text } = Typography;

const TYPE_MAP = {
  multiple_choice: 'Trắc nghiệm',
  fill_in: 'Điền từ',
};

const LEVEL_MAP = {
  1: 'Cơ bản',
  2: 'Trung bình',
  3: 'Nâng cao'
};

const ExerciseList = () => {
  const dispatch = useDispatch();
  const { exercises, loading } = useSelector((state) => state.exercises);
  const { lessons } = useSelector((state) => state.lessons);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState(undefined);
  const navigate = useNavigate();

  // Lấy danh sách bài học và bài tập
  useEffect(() => {
    dispatch(fetchLessons({ page: 1, pageSize: 1000 }));
    dispatch(fetchExercises({ page: 1, pageSize: 1000 }));
  }, [dispatch]);

  // Tính toán số lượng bài tập theo loại cho mỗi bài học
  const getExerciseCounts = (lessonId) => {
    const lessonExercises = exercises.filter(ex => ex.lesson_id === lessonId);
    return {
      total: lessonExercises.length,
      multiple_choice: lessonExercises.filter(ex => ex.type === 'multiple_choice').length,
      fill_in: lessonExercises.filter(ex => ex.type === 'fill_in').length
    };
  };

  // Lọc bài học theo tìm kiếm và loại bài tập
  const filteredLessons = lessons.filter(lesson => {
    const counts = getExerciseCounts(lesson.id);
    const matchesSearch = lesson.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = !typeFilter || counts[typeFilter] > 0;
    return matchesSearch && matchesType;
  });

  return (
    <Layout role="admin" pageHeaderTitle="Quản lý bài tập">
      <div className={styles.container}>
        <div className={styles.header}>
          <Space className={styles.filters}>
            <Input
              placeholder="Tìm kiếm bài học..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 220 }}
            />
            <Select
              placeholder="Loại bài tập"
              allowClear
              style={{ width: 160 }}
              value={typeFilter}
              onChange={setTypeFilter}
            >
              <Option value="multiple_choice">Trắc nghiệm</Option>
              <Option value="fill_in">Điền từ</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin/exercises/create')}
            >
              Thêm bài tập mới
            </Button>
          </Space>
        </div>

        <div className={styles.lessonList}>
          {filteredLessons.map(lesson => {
            const counts = getExerciseCounts(lesson.id);
            return (
              <LessonHorizontalCard
                key={lesson.id}
                title={lesson.title}
                level={LEVEL_MAP[lesson.level] || 'Chưa phân loại'}
                type={`${counts.multiple_choice} bài trắc nghiệm`}
                category={`${counts.fill_in} bài điền từ`}
                buttonText="Xem chi tiết"
                onButtonClick={() => navigate(`/admin/exercises/lesson/${lesson.id}`)}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default ExerciseList;