import React from 'react';
import styles from './LessonHorizontalCard.module.css';

const LessonHorizontalCard = ({
  title,
  level,
  type,
  category,
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
        <div className={styles.meta}>
          <span className={styles.type}>{type}</span>
          {category && <span className={styles.category}>{category}</span>}
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