import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../../components/layout/Layout';
import styles from './LessonList.module.css';
import { fetchLessons } from '../../../../slices/lessonSlice';
import { Button, Table, Input, Select, Space, Tag } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const STATUS_MAP = {
  1: { text: 'Hoạt động', color: 'green' },
  2: { text: 'Đã ẩn', color: 'red' }
};

const LessonList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lessons, loading, error } = useSelector((state) => state.lessons);
  const [searchText, setSearchText] = useState('');
  const [levelFilter, setLevelFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  const fetchWithAllFilters = (newFilters = {}) => {
    dispatch(fetchLessons({
      filters: searchText,
      level: levelFilter,
      category: categoryFilter,
      status_id: statusFilter,
      ...newFilters
    }));
  };

  useEffect(() => {
    fetchWithAllFilters();
    // eslint-disable-next-line
  }, []);

  const handleCreateLesson = () => {
    navigate('/admin/lessons/create');
  };

  const handleEditLesson = (id) => {
    navigate(`/admin/lessons/edit/${id}`);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    fetchWithAllFilters({ filters: value });
  };

  const handleLevelChange = (value) => {
    setLevelFilter(value);
    fetchWithAllFilters({ level: value });
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    fetchWithAllFilters({ category: value });
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    fetchWithAllFilters({ status_id: value });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Cấp độ',
      dataIndex: 'level',
      key: 'level',
      width: 120,
      render: (level) => {
        const levelMap = {
          1: { text: 'Cơ bản', color: 'green' },
          2: { text: 'Trung bình', color: 'blue' },
          3: { text: 'Nâng cao', color: 'red' },
        };
        const { text, color } = levelMap[level] || { text: 'Không xác định', color: 'default' };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status_id',
      key: 'status_id',
      width: 120,
      render: (status_id) => {
        const { text, color } = STATUS_MAP[status_id] || { text: 'Không xác định', color: 'default' };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_date',
      key: 'created_date',
      width: 150,
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEditLesson(record.id)}>
            Sửa
          </Button>
          <Button type="link" danger>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout role="admin" pageHeaderTitle="Quản lý bài học">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.filters}>
            <Input
              placeholder="Tìm kiếm bài học..."
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              placeholder="Cấp độ"
              allowClear
              style={{ width: 150 }}
              onChange={handleLevelChange}
              value={levelFilter}
            >
              <Option value={1}>Cơ bản</Option>
              <Option value={2}>Trung bình</Option>
              <Option value={3}>Nâng cao</Option>
            </Select>
            <Select
              placeholder="Danh mục"
              allowClear
              style={{ width: 200 }}
              onChange={handleCategoryChange}
              value={categoryFilter}
            >
              <Option value="Thì hiện tại">Thì hiện tại</Option>
              <Option value="Thì quá khứ">Thì quá khứ</Option>
              <Option value="Thì tương lai">Thì tương lai</Option>
            </Select>
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: 150 }}
              onChange={handleStatusChange}
              value={statusFilter}
            >
              <Option value={1}>Hoạt động</Option>
              <Option value={2}>Đã ẩn</Option>
            </Select>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateLesson}
          >
            Thêm bài học
          </Button>
        </div>

        <div className={styles.tableContainer}>
          <Table
            columns={columns}
            dataSource={lessons}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Tổng số ${total} bài học`,
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default LessonList;