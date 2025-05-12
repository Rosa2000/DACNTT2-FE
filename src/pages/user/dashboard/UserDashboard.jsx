import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../../../components/layout/Layout';
import HeatMap from '../../../components/heatmap/Heatmap';
import PageTitle from '../../../components/pageTitle/PageTitle';
import styles from './UserDashboard.module.css';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const username = user?.fullname || user?.username || 'Người dùng';

  // Mock data - replace with actual API data later
  const lastExercise = {
    title: 'Bài tập ngữ pháp: Thì hiện tại đơn',
    completedDate: '20/04/2025',
    score: '85/100',
  };

  const learningStats = {
    totalExercises: 45,
    completedExercises: 32,
    averageScore: 88,
    streakDays: 7,
  };

  const progressPercentage = Math.round((learningStats.completedExercises / learningStats.totalExercises) * 100);

  return (
    <>
      <PageTitle title="Trang chủ" />
      <Layout pageHeaderTitle="Dashboard">
        <div className={styles.dashboard}>
          <section className={styles['welcome-section']}>
            <h2>Xin chào, {username}!</h2>
            <p>Chào mừng bạn trở lại với EZ English. Tiếp tục hành trình học tập của bạn nào!</p>
            <div className={styles['streak-badge']}>
              <span>🔥 {learningStats.streakDays} ngày liên tiếp</span>
            </div>
          </section>

          <div className={styles['stats-grid']}>
            <div className={styles['stat-card']}>
              <h4>Tổng số bài tập</h4>
              <p className={styles['stat-number']}>{learningStats.totalExercises}</p>
            </div>
            <div className={styles['stat-card']}>
              <h4>Đã hoàn thành</h4>
              <p className={styles['stat-number']}>{learningStats.completedExercises}</p>
            </div>
            <div className={styles['stat-card']}>
              <h4>Điểm trung bình</h4>
              <p className={styles['stat-number']}>{learningStats.averageScore}%</p>
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
            <h3>Bài tập cuối cùng đã làm</h3>
            {lastExercise ? (
              <div className={styles['exercise-card']}>
                <h4>{lastExercise.title}</h4>
                <p>Ngày hoàn thành: {lastExercise.completedDate}</p>
                <p>Điểm số: {lastExercise.score}</p>
                <Link to="/exercises" className={styles['view-button']}>
                  Xem chi tiết
                </Link>
              </div>
            ) : (
              <p>Bạn chưa hoàn thành bài tập nào. Hãy bắt đầu ngay!</p>
            )}
            <Link to="/exercises" className={styles['cta-button']}>
              Làm bài tập mới
            </Link>
          </section>

          <section className={styles['heat-map-section']}>
            <h3>Lịch sử học tập</h3>
            <div className={styles['heat-map-container']}>
              <HeatMap />
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;