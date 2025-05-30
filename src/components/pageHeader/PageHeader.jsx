import React from 'react';
import styles from './PageHeader.module.css';

const PageHeader = ({ breadcrumb, title, subtitle, rightContent }) => {
  return (
    <div className={styles.pageHeader}>
      {breadcrumb && (
        <div className={styles.breadcrumb}>
          {breadcrumb.map((item, idx) => (
            <span key={item.path || idx}>
              {item.path ? (
                <a href={item.path}>{item.title}</a>
              ) : (
                <span>{item.title}</span>
              )}
              {idx < breadcrumb.length - 1 && ' / '}
            </span>
          ))}
        </div>
      )}
      <div className={styles.headerMain}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
        {rightContent && <div className={styles.rightContent}>{rightContent}</div>}
      </div>
    </div>
  );
};

export default PageHeader; 