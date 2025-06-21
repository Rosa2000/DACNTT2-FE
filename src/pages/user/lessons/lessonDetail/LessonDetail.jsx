import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import Layout from "../../../../components/layout/Layout";
import MarkdownViewer from '../../../../components/markdownViewer/MarkdownViewer';
import styles from './LessonDetail.module.css';
import { fetchLessonById, studyLesson, clearCurrentLesson } from '../../../../slices/lessonSlice';
import { fetchExercisesByLessonId, submitExerciseResults } from '../../../../slices/exerciseSlice';

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentLesson: lesson, loading, error } = useSelector((state) => state.lessons);
  const { user } = useSelector((state) => state.auth);

  // Gọi khi load trang
  useEffect(() => {
    dispatch(fetchLessonById(id));

    // Lưu fallback nếu có location.state
    const { from, level, category } = location.state || {};
    if (from) {
      sessionStorage.setItem('lesson_from', from);
      sessionStorage.setItem('lesson_level', level ?? '');
      sessionStorage.setItem('lesson_category', category ?? '');
    }
  }, [dispatch, id, location.state]);

  const handleStartExercise = async () => {
    try {
      const lesson_id = parseInt(id);
      const status_id = 5;

      await dispatch(studyLesson({ lesson_id, status_id, user_id: user.id })).unwrap();
      const exerciseData = await dispatch(fetchExercisesByLessonId(id)).unwrap();

      const initAnswers = exerciseData.map((q) => ({
        exercise_id: q.id,
        user_answer: '',
        status_id: 3
      }));

      await dispatch(submitExerciseResults({
        results: initAnswers,
        userId: user.id
      })).unwrap();

      navigate(`/user/lessons/${id}/exercises`);
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Có lỗi xảy ra khi bắt đầu bài tập';
      if (errorMessage.includes('Không tìm thấy bài học')) {
        message.error('Không tìm thấy bài học');
      } else if (errorMessage.includes('Bài học đã kết thúc')) {
        message.error('Bài học này đã hoàn thành');
      } else if (errorMessage.includes('Người dùng chưa bắt đầu học')) {
        message.error('Vui lòng bắt đầu học bài học này');
      } else {
        message.error(errorMessage);
      }
      console.error('Error starting exercise:', error);
    }
  };

  const handleBack = () => {
    dispatch(clearCurrentLesson());

    // Ưu tiên lấy từ location.state, fallback là sessionStorage
    const from = location.state?.from || sessionStorage.getItem('lesson_from');
    const level = location.state?.level || sessionStorage.getItem('lesson_level');
    const category = location.state?.category || sessionStorage.getItem('lesson_category');

    if (from === 'level' && level) {
      navigate(`/user/lessons/level/${level}`);
    } else if (from === 'category' && category) {
      navigate(`/user/lessons/category/${encodeURIComponent(category)}`);
    } else {
      navigate('/user/lessons');
    }
  };

  if (!lesson) {
    return (
      <Layout role="user">
        <div className={styles.container}>
          <div className={styles.error}>Không tìm thấy bài học</div>
        </div>
      </Layout>
    );
  }

  const levelMap = {
    1: 'Cơ bản',
    2: 'Trung bình',
    3: 'Nâng cao'
  };
  const levelName = lesson.level ? levelMap[lesson.level] : 'Học theo cấp độ';

  if (loading) {
    return (
      <Layout role="user">
        <div className={styles.container}>
          <div className={styles.loading}>Đang tải...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout role="user">
        <div className={styles.container}>
          <div className={styles.error}>{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      role="user" 
      pageHeaderTitle={lesson.title}
      pageHeaderBreadcrumb={[
        { title: 'Trang chủ', path: '/' },
        { title: 'Học Ngữ Pháp', path: '/user/lessons' },
        { title: levelName, path: `/user/lessons/level/${lesson.level}` },
        { title: lesson.title }
      ]}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <MarkdownViewer content={lesson.content} />
        </div>
        <div className={styles.actions}>
          {lesson.status_id === 5 ? (
            <button 
              className={`${styles.button} ${styles.retry}`} 
              onClick={() => handleStartExercise(true)}
            >
              Học lại
            </button>
          ) : (
            <button 
              className={styles.button} 
              onClick={() => handleStartExercise(false)}
            >
              {lesson.status_id === 3 ? 'Tiếp tục học' : 'Bắt đầu bài tập'}
            </button>
          )}
          <button className={`${styles.button} ${styles.outlined}`} onClick={handleBack}>
            Quay lại
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default LessonDetail;
