import React from 'react';
import { Table } from 'antd';
import styles from './CommonTable.module.css';

const CommonTable = ({
  columns,
  dataSource,
  loading,
  pagination,
  onChange,
  scroll,
  rowKey = 'id',
  ...rest
}) => {
  return (
    <div className={styles.tableContainer}>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        onChange={onChange}
        scroll={scroll}
        rowKey={rowKey}
        {...rest}
      />
    </div>
  );
};

export default CommonTable;
