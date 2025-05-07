import React from 'react';
import styles from './Card.module.css';

const Card = ({ subtitle, title, description, buttonText, outlined, onClick }) => {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <p className={styles.subtitle}>{subtitle}</p>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.buttonContainer}>
        <button
          className={outlined ? styles.outlinedButton : styles.solidButton}
          onClick={onClick}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Card;
