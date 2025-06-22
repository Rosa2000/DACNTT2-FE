import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../../components/layout/Layout';
import styles from './AdminTestList.module.css';
import { fetchLessons } from '../../../../slices/lessonSlice';
import { Button, Table, Input, Select, Space, Tag, Modal, message } from 'antd';
import { PlusOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { deleteLesson, restoreLesson } from '../../../../api/lessonApi';
import PageTitle from '../../../../components/pageTitle/PageTitle';

const { Option } = Select;
const { confirm } = Modal;

const STATUS_MAP = {
  1: { text: 'Hoạt động', color: 'green' },
  2: { text: 'Đã ẩn', color: 'red' }
};

const LEVEL_MAP = {
    1: { text: 'Cơ bản', color: 'green' },
    2: { text: 'Trung bình', color: 'blue' },
    3: { text: 'Nâng cao', color: 'red' },
};

const AdminTestList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lessons, loading, total } = useSelector((state) => state.lessons);
  const [searchText, setSearchText] = useState('');
  const [levelFilter, setLevelFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchWithAllFilters = (newFilters = {}) => {
    dispatch(fetchLessons({
      page: newFilters.page || pagination.current,
      pageSize: newFilters.pageSize || pagination.pageSize,
      filters: 'filters' in newFilters ? newFilters.filters : searchText,
      level: 'level' in newFilters ? newFilters.level : levelFilter,
      status_id: 'status_id' in newFilters ? newFilters.status_id : statusFilter,
      type: 'test',
    }));
  };

  useEffect(() => {
    fetchWithAllFilters({ page: 1 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    fetchWithAllFilters({ page: newPagination.current, pageSize: newPagination.pageSize });
  };

  const handleCreate = () => {
    navigate('/admin/tests/create');
  };

  const handleEdit = (id) => {
    message.info('Chức năng sửa bài kiểm tra sẽ được phát triển sau!');
    // navigate(`/admin/tests/edit/${id}`);
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bài kiểm tra này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteLesson(id);
          message.success('Xóa bài kiểm tra thành công!');
          fetchWithAllFilters();
        } catch (error) {
          message.error(error.message || 'Có lỗi xảy ra khi xóa!');
        }
      }
    });
  };

  const handleRestore = async (id) => {
    try {
      await restoreLesson(id);
      message.success('Khôi phục bài kiểm tra thành công!');
      fetchWithAllFilters();
    } catch (err) {
      message.error(err.message || 'Có lỗi xảy ra!');
    }
  };
  
  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
    fetchWithAllFilters({ filters: value, page: 1 });
  };
  
  const handleLevelChange = (value) => {
    setLevelFilter(value);
    setPagination({ ...pagination, current: 1 });
    fetchWithAllFilters({ level: value, page: 1 });
  };
  
  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPagination({ ...pagination, current: 1 });
    fetchWithAllFilters({ status_id: value, page: 1 });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: 'Cấp độ', dataIndex: 'level', key: 'level', render: (level) => <Tag color={LEVEL_MAP[level]?.color}>{LEVEL_MAP[level]?.text || `Cấp ${level}`}</Tag> },
    { title: 'Thời gian', dataIndex: 'duration', key: 'duration', render: (duration) => duration ? `${duration} phút` : 'N/A' },
    { title: 'Trạng thái', dataIndex: 'status_id', key: 'status_id', render: (status) => <Tag color={STATUS_MAP[status]?.color}>{STATUS_MAP[status]?.text}</Tag> },
    { title: 'Ngày tạo', dataIndex: 'created_date', key: 'created_date', render: (date) => new Date(date).toLocaleDateString('vi-VN') },
    {
      title: 'Thao tác',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record.id)}>Sửa</Button>
          {record.status_id === 1 ? (
            <Button type="link" danger onClick={() => handleDelete(record.id)}>Xóa</Button>
          ) : (
            <Button type="link" icon={<UndoOutlined />} onClick={() => handleRestore(record.id)}>Khôi phục</Button>
          )}
          <Button type="link" onClick={() => navigate(`/admin/test-questions?testId=${record.id}`)}>Xem câu hỏi</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
    <PageTitle title="Quản lý Bài kiểm tra" />
    <Layout role="admin" pageHeaderTitle="Quản lý bài kiểm tra">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.filters}>
            <Input
              placeholder="Tìm kiếm bài kiểm tra..."
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              value={searchText}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              placeholder="Cấp độ" allowClear style={{ width: 150 }}
              onChange={handleLevelChange} value={levelFilter}
            >
              <Option value={1}>Cơ bản</Option>
              <Option value={2}>Trung bình</Option>
              <Option value={3}>Nâng cao</Option>
            </Select>
            <Select
              placeholder="Trạng thái" allowClear style={{ width: 150 }}
              onChange={handleStatusChange} value={statusFilter}
            >
              <Option value={1}>Hoạt động</Option>
              <Option value={2}>Đã ẩn</Option>
            </Select>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Tạo bài kiểm tra
          </Button>
        </div>

        <div className={styles.tableContainer}>
            <Table
              columns={columns}
              dataSource={lessons}
              loading={loading}
              pagination={{ ...pagination, total }}
              onChange={handleTableChange}
              rowClassName={(record) => record.status_id === 2 ? styles.deleted : ''}
              rowKey="id"
            />
        </div>
      </div>
    </Layout>
    </>
  );
};

export default AdminTestList; 