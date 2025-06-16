import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Layout from '../../../components/layout/Layout';
import HeatMap from '../../../components/heatmap/Heatmap';
import PageTitle from '../../../components/pageTitle/PageTitle';
import styles from './UserDashboard.module.css';
import { fetchLessons, fetchUserLessons } from '../../../slices/lessonSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { lastLesson, lessons, total } = useSelector((state) => state.lessons);
  const { userLessons } = useSelector((state) => state.lessons);
  const username = user?.fullname || user?.username || 'Người dùng';

  useEffect(() => {
    // Fetch lessons để lấy bài học gần nhất và tổng số bài học
    dispatch(fetchLessons({}));
    // Fetch userLessons để lấy dữ liệu heatmap
    dispatch(fetchUserLessons());
  }, [dispatch]);

  // Tính toán tổng số bài học và số bài học đã hoàn thành
  const totalLessons = total || 0;
  const completedLessons = lessons ? lessons.filter(l => l.study_status_id === 5).length : 0;
  const completedLessonsWithScore = lessons
    ? lessons.filter(l => l.study_status_id === 5 && typeof l.score === 'number')
    : [];
  const averageScore = completedLessonsWithScore.length > 0
    ? Math.round(completedLessonsWithScore.reduce((sum, l) => sum + l.score, 0) / completedLessonsWithScore.length)
    : 0;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  // Tính streakDays (số ngày học liên tiếp đến hôm nay) từ userLessons, tính cả status_id 4 và 5
  let streakDays = 0;
  if (userLessons && userLessons.length > 0) {
    const daysSet = new Set();
    userLessons.forEach(l => {
      if ((l.status_id === 4 || l.status_id === 5) && l.modified_date) {
        daysSet.add(l.modified_date.slice(0, 10));
      }
    });
    const days = Array.from(daysSet).sort().reverse(); // Mới nhất trước
    let current = new Date();
    for (;;) {
      const dayStr = current.toISOString().slice(0, 10);
      if (days.includes(dayStr)) {
        streakDays++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Xử lý dữ liệu cho heatmap: group theo ngày hoàn thành từ userLessons
  const heatmapDateCountMap = {};
  if (userLessons) {
    userLessons.forEach(l => {
      if (l.status_id === 5 && l.modified_date) {
        const date = l.modified_date.slice(0, 10);
        heatmapDateCountMap[date] = (heatmapDateCountMap[date] || 0) + 1;
      }
    });
  }
  const heatmapValues = Object.entries(heatmapDateCountMap).map(([date, count]) => ({ date, count }));

  return (
    <>
      <PageTitle title="Trang chủ" />
      <Layout pageHeaderTitle="Dashboard">
        <div className={styles.dashboard}>
          <section className={styles['welcome-section']}>
            <h2>Xin chào, {username}!</h2>
            <p>Chào mừng bạn trở lại với EZ English. Tiếp tục hành trình học tập của bạn nào!</p>
            {streakDays >= 2 && (
              <div className={styles['streak-badge']}>
                <span>🔥 {streakDays} ngày liên tiếp</span>
              </div>
            )}
          </section>

          <div className={styles['stats-grid']}>
            <div className={styles['stat-card']}>
              <h4>Tổng số bài học</h4>
              <p className={styles['stat-number']}>{totalLessons}</p>
            </div>
            <div className={styles['stat-card']}>
              <h4>Đã hoàn thành</h4>
              <p className={styles['stat-number']}>{completedLessons}</p>
            </div>
            <div className={styles['stat-card']}>
              <h4>Điểm trung bình</h4>
              <p className={styles['stat-number']}>{averageScore}</p>
            </div>
          </div>

          <div className={styles['progress-section']}>
            <h3>Tiến độ học tập</h3>
            <div className={styles['progress-bar']}>
              <div 
                className={styles['progress-fill']} 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className={styles['progress-text']}>{progressPercentage}% hoàn thành</p>
          </div>

          <section className={styles['last-exercise-section']}>
            <h3>Bài học gần nhất</h3>
            {lastLesson ? (
              <div className={styles['exercise-card']}>
                <h4>{lastLesson.title}</h4>
                <p>Trạng thái: {
                  lastLesson.study_status_id === 3 ? 'Chưa học' :
                  lastLesson.study_status_id === 4 ? 'Đang học' :
                  lastLesson.study_status_id === 5 ? 'Đã hoàn thành' : 'Không xác định'
                }</p>
                {lastLesson.score !== null && (
                  <p>Điểm số: {lastLesson.score}/100</p>
                )}
                <Link 
                  to={`/user/lessons/${lastLesson.id}`} 
                  className={styles['view-button']}
                >
                  {lastLesson.study_status_id === 3 ? 'Bắt đầu học' :
                   lastLesson.study_status_id === 4 ? 'Tiếp tục học' :
                   'Học lại'}
                </Link>
              </div>
            ) : (
              <p>Bạn chưa học bài học nào. Hãy bắt đầu ngay!</p>
            )}
            <Link to="/user/lessons" className={styles['cta-button']}>
              Xem tất cả bài học
            </Link>
          </section>

          <section className={styles['heat-map-section']}>
            <h3>Lịch sử học tập</h3>
            <div className={styles['heat-map-container']}>
              <HeatMap values={heatmapValues} />
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;