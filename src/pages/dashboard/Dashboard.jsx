import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  // Giả lập dữ liệu người dùng và bài tập cuối cùng
  const username = 'User'; // Có thể thay bằng dữ liệu thực tế từ API
  const lastExercise = {
    title: 'Bài tập ngữ pháp: Thì hiện tại đơn',
    completedDate: '20/04/2025',
    score: '85/100',
  };

  return (
    <Layout>
      <div className={styles.dashboard}>
        {/* Welcome Section */}
        <section className={styles['welcome-section']}>
          <h2>Xin chào, {username}!</h2>
          <p>Chào mừng bạn trở lại với EZ English. Tiếp tục hành trình học tập của bạn nào!</p>
        </section>

        {/* Last Exercise Section */}
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
      </div>
    </Layout>
  );
};

export default Dashboard;