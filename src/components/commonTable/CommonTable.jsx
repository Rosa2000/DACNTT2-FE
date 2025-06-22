import React from 'react';
import { Table } from 'antd';
import styles from './CommonTable.module.css';

const CommonTable = ({
  columns,
  dataSource,
  loading,
  pagination,
  onChange,
  onSearch,
  onFilterChange,
  onDelete,
  onRestore,
  onStatusChange,
  onEdit,
  onView,
  searchPlaceholder = 'Tìm kiếm...',
  scroll,
  rowKey = 'id',
  ...rest
}) => {
  const handleTableChange = (pagination, filters, sorter) => {
    onChange(pagination, filters, sorter);
  };

  return (
    <div className={styles.tableContainer}>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={scroll}
        rowKey={rowKey}
        {...rest}
      />
    </div>
  );
};

export default CommonTable;
