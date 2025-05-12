import React from 'react';
import styles from './PageHeader.module.css';

const PageHeader = ({ breadcrumb, title, subtitle, rightContent }) => {
  return (
    <div className={styles.pageHeader}>
      {breadcrumb && <div className={styles.breadcrumb}>{breadcrumb}</div>}
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