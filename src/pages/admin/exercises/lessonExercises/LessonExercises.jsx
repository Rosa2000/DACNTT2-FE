import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../../components/layout/Layout';
import CommonTable from '../../../../components/commonTable/CommonTable';
import { fetchExercises } from '../../../../slices/exerciseSlice';
import { fetchLessons } from '../../../../slices/lessonSlice';
import { Button, Space, Modal, message, Input, Select, Typography, Tag, Descriptions } from 'antd';
import { PlusOutlined, UndoOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { deleteExercise, updateExercise, getExercises, restoreExercise } from '../../../../api/exerciseApi';
import styles from './LessonExercises.module.css';

const { confirm } = Modal;
const { Option } = Select;
const { Title } = Typography;

const STATUS_MAP = {
  1: { text: 'Hoạt động', color: 'green' },
  2: { text: 'Đã ẩn', color: 'red' }
};

const TYPE_MAP = {
  multiple_choice: 'Trắc nghiệm',
  fill_in: 'Điền từ',
};

const LEVEL_MAP = {
  1: 'Cơ bản',
  2: 'Trung bình',
  3: 'Nâng cao'
};

const LessonExercises = () => {
  const { lessonId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { exercises, loading, total } = useSelector((state) => state.exercises);
  const { lessons } = useSelector((state) => state.lessons);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState(undefined);
  const [statusFilter, setStatusFilter] = useState(undefined);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const currentLesson = lessons.find(lesson => lesson.id === parseInt(lessonId));

  useEffect(() => {
    dispatch(fetchLessons({ page: 1, pageSize: 1000 }));
    dispatch(fetchExercises({
      page: pagination.current,
      pageSize: pagination.pageSize,
      lessonId: parseInt(lessonId),
      filters: searchText,
      type: typeFilter,
      status_id: statusFilter,
    }));
  }, [dispatch, lessonId, pagination, searchText, typeFilter, statusFilter]);

  const handleDeleteExercise = (id) => {
    confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bài tập này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const response = await deleteExercise(id);
          if (response.data.code === 0) {
            message.success('Xóa bài tập thành công!');
            dispatch(fetchExercises({ 
              page: pagination.current, 
              pageSize: pagination.pageSize,
              lesson_id: lessonId 
            }));
          } else {
            message.error(response.data.message || 'Có lỗi xảy ra khi xóa bài tập!');
          }
        } catch (error) {
          message.error(error.message || 'Có lỗi xảy ra khi xóa bài tập!');
        }
      }
    });
  };

  const handleRestoreExercise = (id) => {
    confirm({
      title: 'Xác nhận khôi phục',
      content: 'Bạn có chắc chắn muốn khôi phục bài tập này?',
      okText: 'Khôi phục',
      okType: 'primary',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          let response;
          if (typeof restoreExercise === 'function') {
            response = await restoreExercise(id);
          } else {
            response = await updateExercise(id, { status_id: 1 });
          }
          if (response.data.code === 0) {
            message.success('Khôi phục bài tập thành công!');
            dispatch(fetchExercises({ 
              page: pagination.current, 
              pageSize: pagination.pageSize,
              lesson_id: lessonId 
            }));
          } else {
            message.error(response.data.message || 'Có lỗi xảy ra khi khôi phục bài tập!');
          }
        } catch (error) {
          message.error(error.message || 'Có lỗi xảy ra khi khôi phục bài tập!');
        }
      }
    });
  };

  const handleRowClick = async (record) => {
    setSelectedExercise(record);
    setIsModalVisible(true);
  };

  const columns = [
    { 
      title: 'STT', 
      key: 'index',
      width: 80,
      render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1
    },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: 'Loại', dataIndex: 'type', key: 'type', render: (type) => TYPE_MAP[type] || type },
    { title: 'Trạng thái', dataIndex: 'status_id', key: 'status_id', render: (status_id) => {
        const { text, color } = STATUS_MAP[status_id] || { text: 'Không xác định', color: 'default' };
        return <Tag color={color}>{text}</Tag>;
      }
    },
    { title: 'Ngày tạo', dataIndex: 'created_date', key: 'created_date', render: (date) => new Date(date).toLocaleDateString('vi-VN') },
    { title: 'Thao tác', key: 'action', width: 180, render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={e => { e.stopPropagation(); navigate(`/admin/exercises/edit/${lessonId}/${record.id}`); }}>
            <span>Sửa</span>
          </Button>
          {record.status_id === 1 ? (
            <Button type="link" danger onClick={e => { e.stopPropagation(); handleDeleteExercise(record.id); }}>
              <span>Xóa</span>
            </Button>
          ) : (
            <Button type="link" icon={<UndoOutlined />} onClick={e => { e.stopPropagation(); handleRestoreExercise(record.id); }}>
              <span>Khôi phục</span>
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <Layout role="admin" pageHeaderTitle={`Bài tập - ${currentLesson?.title || ''}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.filters}>
            <Input
              placeholder="Tìm kiếm bài tập..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              className={styles.filterInput}
            />
            <Select
              placeholder="Loại bài tập"
              allowClear
              value={typeFilter}
              onChange={setTypeFilter}
              className={styles.filterSelect}
            >
              <Option value="multiple_choice">Trắc nghiệm</Option>
              <Option value="fill_in">Điền từ</Option>
            </Select>
            <Select
              placeholder="Trạng thái"
              allowClear
              value={statusFilter}
              onChange={setStatusFilter}
              className={styles.filterSelect}
            >
              <Option value={1}>Hoạt động</Option>
              <Option value={2}>Đã ẩn</Option>
            </Select>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => navigate(`/admin/exercises/create/${lessonId}`)}
              className={styles.filterButton}
            >
              Thêm bài tập
            </Button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <CommonTable
            columns={columns}
            dataSource={exercises}
            loading={loading}
            total={total}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: total,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} bài tập`,
            }}
            onChange={(pagination) => setPagination({
              current: pagination.current,
              pageSize: pagination.pageSize
            })}
            scroll={{ x: 900 }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: 'pointer' }
            })}
          />
        </div>

        <Modal
          open={isModalVisible}
          title="Chi tiết bài tập"
          footer={null}
          onCancel={() => setIsModalVisible(false)}
        >
          {selectedExercise && (
            <div>
              <p><b>Tiêu đề:</b> {selectedExercise.title}</p>
              <p><b>Câu hỏi:</b> {selectedExercise.content}</p>
              <div>
                <b>Đáp án:</b>
                {selectedExercise.type === 'multiple_choice' ? (
                  <ul>
                    {selectedExercise.options?.map((opt, idx) => (
                      <li
                        key={opt.id || idx}
                        style={
                          (opt.id && opt.id === selectedExercise.correct_answer) ||
                          (opt.text && opt.text === selectedExercise.correct_answer)
                            ? { fontWeight: 'bold', color: 'green' }
                            : {}
                        }
                      >
                        {opt.text || opt}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontWeight: 'bold', color: 'green' }}>{selectedExercise.correct_answer}</div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default LessonExercises; 