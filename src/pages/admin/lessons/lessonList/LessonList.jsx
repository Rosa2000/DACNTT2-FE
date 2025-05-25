import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../../components/layout/Layout';
import styles from './LessonList.module.css';
import { fetchLessons } from '../../../../slices/lessonSlice';
import { Button, Table, Input, Select, Space, Tag, Modal, message } from 'antd';
import { PlusOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons';
import { deleteLesson, updateLesson, restoreLesson } from '../../../../api/lessonApi';
import CommonTable from '../../../../components/commonTable/CommonTable';

const { Option } = Select;
const { confirm } = Modal;

const STATUS_MAP = {
  1: { text: 'Hoạt động', color: 'green' },
  2: { text: 'Đã ẩn', color: 'red' }
};

const LessonList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lessons, loading, error, total } = useSelector((state) => state.lessons);
  const [searchText, setSearchText] = useState('');
  const [levelFilter, setLevelFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchWithAllFilters = (newFilters = {}) => {
    dispatch(fetchLessons({
      page: pagination.current,
      pageSize: pagination.pageSize,
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
  }, [pagination.current, pagination.pageSize]);

  const handleCreateLesson = () => {
    navigate('/admin/lessons/create');
  };

  const handleEditLesson = (id) => {
    navigate(`/admin/lessons/edit/${id}`);
  };

  const handleDeleteLesson = (id) => {
    confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bài học này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await deleteLesson(id);
          if (response.data.code === 0) {
            message.success('Xóa bài học thành công!');
            fetchWithAllFilters();
          } else {
            message.error(response.data.message || 'Có lỗi xảy ra khi xóa bài học!');
          }
        } catch (error) {
          message.error(error.message || 'Có lỗi xảy ra khi xóa bài học!');
        }
      }
    });
  };

  const handleRestoreLesson = async (id) => {
    try {
      const res = await restoreLesson(id);
      if (res.data.code === 0) {
        message.success('Khôi phục bài học thành công!');
        fetchWithAllFilters();
      } else {
        message.error(res.data.message || 'Khôi phục thất bại!');
      }
    } catch (err) {
      message.error('Có lỗi xảy ra!');
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
    fetchWithAllFilters({ filters: value });
  };

  const handleLevelChange = (value) => {
    setLevelFilter(value);
    setPagination({ ...pagination, current: 1 });
    fetchWithAllFilters({ level: value });
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    setPagination({ ...pagination, current: 1 });
    fetchWithAllFilters({ category: value });
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setPagination({ ...pagination, current: 1 });
    fetchWithAllFilters({ status_id: value });
  };

  const handleClearFilters = () => {
    setSearchText('');
    setLevelFilter(null);
    setCategoryFilter(null);
    setStatusFilter(null);
    setPagination({ ...pagination, current: 1 });
    fetchWithAllFilters({
      filters: '',
      level: null,
      category: null,
      status_id: null
    });
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
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status_id',
      key: 'status_id',
      render: (status_id) => {
        const { text, color } = STATUS_MAP[status_id] || { text: 'Không xác định', color: 'default' };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_date',
      key: 'created_date',
      render: (date) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEditLesson(record.id)}>
            <span>Sửa</span>
          </Button>
          {record.status_id === 1 ? (
            <Button type="link" danger onClick={() => handleDeleteLesson(record.id)}>
              <span>Xóa</span>
            </Button>
          ) : (
            <Button type="link" icon={<UndoOutlined />} onClick={() => handleRestoreLesson(record.id)}>
              <span>Khôi phục</span>
            </Button>
          )}
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
              value={searchText}
              style={{ width: 300 }}
              allowClear
              onClear={handleClearFilters}
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
              onClear={handleClearFilters}
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
          <CommonTable
            columns={columns}
            dataSource={lessons}
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: total,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} bài học`,
            }}
            onChange={(pagination) => setPagination({
              current: pagination.current,
              pageSize: pagination.pageSize
            })}
            scroll={{ x: 900 }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default LessonList;