import React from 'react';
import styles from './LessonHorizontalCard.module.css';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LessonHorizontalCard = ({ lesson, onStart }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onStart) onStart(lesson);
    else navigate(`/user/lessons/${lesson.id}`);
  };

  const levelMap = {
    1: 'Cơ bản',
    2: 'Trung bình',
    3: 'Nâng cao',
  };

  const getButtonText = () => {
    switch (lesson.study_status_id) {
      case 3: return 'Bắt đầu học';
      case 4: return 'Tiếp tục học';
      case 5: return 'Học lại';
      default: return 'Bắt đầu học';
    }
  };

  const getScoreDisplay = () => {
    if (!lesson.study_status_id || lesson.study_status_id === 3) {
      return {
        text: 'Điểm tối đa: 100',
        className: styles.grayScore
      };
    }
    return {
      text: `Điểm: ${lesson.score ?? 0}/100`,
      className: lesson.study_status_id === 5 ? styles.score : styles.grayScore
    };
  };

  const scoreDisplay = getScoreDisplay();

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        {lesson.study_status_id === 5 ? (
          <FaStar className={`${styles.star} ${styles.active}`} />
        ) : (
          <FaRegStar className={`${styles.star} ${styles.inactive}`} />
        )}
        <span className={styles.level}>{levelMap[lesson.level] || 'Không rõ'}</span>
        {lesson.category && <span className={styles.category}>{lesson.category}</span>}
      </div>

      <div className={styles.center}>
        <div className={styles.title}>{lesson.title}</div>
        <div className={`${scoreDisplay.className} ${styles.visible}`}>
          {scoreDisplay.text}
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.button} onClick={handleClick}>
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

export default LessonHorizontalCard;
