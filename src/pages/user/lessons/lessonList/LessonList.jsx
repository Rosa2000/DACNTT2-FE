import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Layout from "../../../../components/layout/Layout";
import LessonHorizontalCard from "../../../../components/lessonHorizontalCard/LessonHorizontalCard";
import Breadcrumb from "../../../../components/breadcrumb/Breadcrumb";
import styles from './LessonList.module.css';
import { fetchLessons } from '../../../../slices/lessonSlice';

const LessonList = () => {
  const { level, category } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lessons, loading, error } = useSelector((state) => state.lessons);

  useEffect(() => {
    // Fetch lessons based on URL params
    if (level) {
      dispatch(fetchLessons({ level: parseInt(level) }));
    } else if (category) {
      dispatch(fetchLessons({ category }));
    } else {
      dispatch(fetchLessons({}));
    }
  }, [dispatch, level, category]);

  // Get breadcrumb items based on current filter
  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Học tập', to: '/study' },
      { label: 'Bài học', to: '/lessons' }
    ];

    if (level) {
      const levelText = {
        1: 'Cơ bản',
        2: 'Trung bình',
        3: 'Nâng cao'
      }[level];
      items.push({ label: levelText });
    } else if (category) {
      items.push({ label: category });
    }

    return items;
  };

  // Get page title based on current filter
  const getPageTitle = () => {
    if (level) {
      const levelText = {
        1: 'Cơ bản',
        2: 'Trung bình',
        3: 'Nâng cao'
      }[level];
      return `Bài học ${levelText}`;
    } else if (category) {
      return `Bài học ${category}`;
    }
    return 'Danh sách bài học';
  };

  if (loading) {
    return (
      <Layout role="user" pageHeaderTitle={getPageTitle()} pageHeaderBreadcrumb={<Breadcrumb items={getBreadcrumbItems()} /> }>
        <div className={styles.container}>
          <div className={styles.card}>
            <p>Đang tải...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout role="user" pageHeaderTitle={getPageTitle()} pageHeaderBreadcrumb={<Breadcrumb items={getBreadcrumbItems()} /> }>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.error}>{error}</div>
          </div>
        </div>
      </Layout>
    );
  }

  const lessonList = lessons || [];

  return (
    <Layout role="user" pageHeaderTitle={getPageTitle()} pageHeaderBreadcrumb={<Breadcrumb items={getBreadcrumbItems()} /> }>
      <div className={styles.container}>
        <div className={styles.card}>
          {lessonList.length === 0 ? (
            <p>Không có bài học nào</p>
          ) : (
            <div className={styles.cardGrid}>
              {lessonList.map(lesson => (
                <div className={styles.fullWidthCard} key={lesson.id}>
                  <LessonHorizontalCard
                    title={lesson.title}
                    level={lesson.level === 1 ? 'Cơ bản' : lesson.level === 2 ? 'Trung bình' : 'Nâng cao'}
                    type={lesson.type}
                    category={lesson.category}
                    buttonText="Bắt đầu học"
                    onButtonClick={() => navigate(`/user/lessons/${lesson.id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LessonList;