import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

const Breadcrumb = ({ items }) => (
  <nav className={styles.breadcrumb} aria-label="breadcrumb">
    {items.map((item, idx) => (
      <span key={idx}>
        {item.to ? (
          <Link to={item.to} className={styles.link}>{item.label}</Link>
        ) : (
          <span className={styles.current}>{item.label}</span>
        )}
        {idx < items.length - 1 && <span className={styles.separator}> &gt; </span>}
      </span>
    ))}
  </nav>
);

export default Breadcrumb; 