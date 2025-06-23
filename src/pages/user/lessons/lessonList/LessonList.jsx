import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import Layout from "../../../../components/layout/Layout";
import LessonHorizontalCard from "../../../../components/lessonHorizontalCard/LessonHorizontalCard";
import styles from './LessonList.module.css';
import { fetchLessons, studyLesson } from '../../../../slices/lessonSlice';
import PageTitle from '../../../../components/pageTitle/PageTitle';

const LessonList = () => {
  const { level, category } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lessons, loading, error } = useSelector((state) => state.lessons);
  const { user } = useSelector((state) => state.auth);

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
      { title: 'Học tập', path: '/study' },
      { title: 'Bài học', path: '/lessons' }
    ];

    if (level) {
      const levelText = {
        1: 'Cơ bản',
        2: 'Trung bình',
        3: 'Nâng cao'
      }[level];
      items.push({ title: levelText, path: `/lessons/${level}` });
    } else if (category) {
      items.push({ title: category, path: `/lessons/${category}` });
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
      <Layout role="user" pageHeaderTitle={getPageTitle()} pageHeaderBreadcrumb={getBreadcrumbItems()}>
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
      <Layout role="user" pageHeaderTitle={getPageTitle()} pageHeaderBreadcrumb={getBreadcrumbItems()}>
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
    <>
      <PageTitle title={getPageTitle()} />
      <Layout role="user" pageHeaderTitle={getPageTitle()} pageHeaderBreadcrumb={getBreadcrumbItems()}>
        <div className={styles.container}>
          <button
            className={styles.backButton}
            onClick={() => navigate('/user/lessons')}
            style={{ marginBottom: '16px', background: '#f3f4f6', border: 'none', borderRadius: '6px', padding: '8px 20px', fontWeight: 500, cursor: 'pointer', color: '#222' }}
          >
            ← Quay về danh mục
          </button>
          <div className={styles.card}>
            {lessonList.length === 0 ? (
              <p>Không có bài học nào</p>
            ) : (
              <div className={styles.cardGrid}>
                {lessonList.map(lesson => (
                  <div className={styles.fullWidthCard} key={lesson.id}>
                    <LessonHorizontalCard
                      lesson={lesson}
                      onStart={async () => {
                        try {
                          // Chỉ cập nhật status khi bài học chưa học (status 3)
                          const newStatusId = lesson.study_status_id === 3 ? 4 : lesson.study_status_id;
                          
                          await dispatch(studyLesson({
                            lesson_id: lesson.id,
                            status_id: newStatusId ?? 3,
                            user_id: user.id
                          })).unwrap();
                          
                          // Navigate to lesson detail with state
                          navigate(`/user/lessons/${lesson.id}`, {
                            state: {
                              from: level ? 'level' : category ? 'category' : 'all',
                              level: level,
                              category: category
                            }
                          });
                        } catch (error) {
                          message.error('Không thể bắt đầu bài học. Vui lòng thử lại!');
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default LessonList;