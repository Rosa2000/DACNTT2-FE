import React from 'react';
import { Link } from 'react-router-dom';
import styles from './WelcomePage.module.css';

const WelcomePage = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles['hero-section']}>
        <h2>
          Học Ngữ Pháp Tiếng Anh Dễ Dàng Với
          <br/>
          <span>EZ English</span>
        </h2>
        <p>
          Từ cơ bản đến nâng cao, chúng tôi giúp bạn nắm vững ngữ pháp tiếng Anh một cách thú vị và hiệu quả!
        </p>
        <Link to="/auth/login" className={styles['cta-button']}>
          Bắt Đầu Ngay
        </Link>
      </section>

      {/* Features Section */}
      <section className={styles['features-section']}>
        <h3>Tại Sao Chọn EZ English?</h3>
        <div className={styles['features-grid']}>
          <div className={styles['feature-card']}>
            <div className={styles.icon}>📚</div>
            <h4>Bài Học Ngữ Pháp</h4>
            <p>
              Các bài học từ cơ bản đến nâng cao, giải thích dễ hiểu kèm ví dụ thực tế.
            </p>
          </div>
          <div className={styles['feature-card']}>
            <div className={styles.icon}>✍️</div>
            <h4>Bài Tập Thực Hành</h4>
            <p>
              Bài tập tương tác, phản hồi tức thì để bạn cải thiện kỹ năng nhanh chóng.
            </p>
          </div>
          <div className={styles['feature-card']}>
            <div className={styles.icon}>📊</div>
            <h4>Kiểm Tra Trình Độ</h4>
            <p>
              Đánh giá trình độ miễn phí, gợi ý lộ trình học phù hợp với bạn.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;