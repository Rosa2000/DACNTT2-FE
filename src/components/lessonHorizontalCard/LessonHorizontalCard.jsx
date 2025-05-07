import React from 'react';
import styles from './LessonHorizontalCard.module.css';

const LessonHorizontalCard = ({
  title,
  level,
  type,
  score,
  description,
  buttonText = 'Làm bài',
  onButtonClick
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <span className={styles.level}>{level}</span>
      </div>
      <div className={styles.center}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.meta}>
          <span className={styles.type}>{type}</span>
          <span className={styles.score}>Max Score: {score}</span>
        </div>
      </div>
      <div className={styles.right}>
        <button className={styles.button} onClick={onButtonClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default LessonHorizontalCard;