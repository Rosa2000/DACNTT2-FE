import React from 'react';
import styles from './CategoryCard.module.css';

const CategoryCard = ({
  title,
  subtitle,
  description,
  buttonText,
  onClick,
  outlined = false,
  icon,
  features = []
}) => {
  return (
    <div className={`${styles.card} ${outlined ? styles.outlined : ''}`}>
      {icon && <div className={styles.iconContainer}>{icon}</div>}
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {features.length > 0 && (
        <ul className={styles.features}>
          {features.map((feature, index) => (
            <li key={index} className={styles.feature}>
              <span className={styles.featureDot}></span>
              {feature}
            </li>
          ))}
        </ul>
      )}
      {buttonText && (
        <button className={styles.button} onClick={onClick}>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default CategoryCard;
