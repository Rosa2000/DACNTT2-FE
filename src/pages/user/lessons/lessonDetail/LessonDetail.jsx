import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Layout from "../../../../components/layout/Layout";
import MarkdownViewer from '../../../../components/markdownViewer/MarkdownViewer';
import styles from './LessonDetail.module.css';
import { fetchLessonById } from '../../../../slices/lessonSlice';

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentLesson: lesson, loading, error } = useSelector((state) => state.lessons);

  useEffect(() => {
    dispatch(fetchLessonById(id));
  }, [dispatch, id]);

  const handleStartExercise = () => {
    navigate(`/exercises/${id}`);
  };

  const handleBack = () => {
    navigate(-1);
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
      pageHeaderBreadcrumb={
        <>
          <Link to="/">Trang chủ</Link> / 
          <Link to="/user/lessons">Học Ngữ Pháp</Link> / 
          <Link to={`/user/lessons?level=${lesson.level}`}>{levelName}</Link> / 
          <span>{lesson.title}</span>
        </>
      }
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <MarkdownViewer content={lesson.content} />
        </div>
        <div className={styles.actions}>
          <button className={styles.button} onClick={handleStartExercise}>
            Bắt đầu bài tập
          </button>
          <button className={`${styles.button} ${styles.outlined}`} onClick={handleBack}>
            Quay lại
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default LessonDetail;
