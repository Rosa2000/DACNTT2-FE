import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../../components/layout/Layout';
import { fetchExercises } from '../../../../slices/exerciseSlice';
import { fetchLessons } from '../../../../slices/lessonSlice';
import { Button, Space, Input, Select, Collapse, Table, Typography, Modal, Tag } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styles from './ExerciseList.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../../../../components/pageTitle/PageTitle';
const { Option } = Select;
const { Title } = Typography;
const { Panel } = Collapse;

const TYPE_MAP = {
  multiple_choice: 'Trắc nghiệm',
  fill_in: 'Điền từ',
};

const LEVEL_MAP = {
  1: 'Cơ bản',
  2: 'Trung bình',
  3: 'Nâng cao'
};

const STATUS_MAP = {
  1: { text: 'Hoạt động', color: 'green' },
  2: { text: 'Đã ẩn', color: 'red' }
};

const ExerciseList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { exercises, loading } = useSelector((state) => state.exercises);
  const { lessons } = useSelector((state) => state.lessons);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState(undefined);
  const [levelFilter, setLevelFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeKey, setActiveKey] = useState(undefined);

  useEffect(() => {
    dispatch(fetchLessons({ page: 1, pageSize: 1000 }));
    dispatch(fetchExercises({ 
      page: 1, 
      pageSize: 1000,
      lessonId: lessonId ? parseInt(lessonId) : undefined,
      level: levelFilter,
      category: categoryFilter
    }));

    // Nếu có lessonId, set activeKey để mở panel tương ứng
    if (lessonId) {
      setActiveKey(parseInt(lessonId));
    }
  }, [dispatch, lessonId, levelFilter, categoryFilter]);

  // Lọc bài học theo tìm kiếm, cấp độ và danh mục
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesLevel = !levelFilter || lesson.level === levelFilter;
    const matchesCategory = !categoryFilter || lesson.category === categoryFilter;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  // Tạo map để lưu trữ bài tập đã lọc cho mỗi bài học
  const filteredExercisesMap = new Map();
  filteredLessons.forEach(lesson => {
    const lessonExercises = exercises.filter(ex => ex.lesson_id === lesson.id);
    // Nếu có type filter, chỉ lấy bài tập theo loại
    // Nếu không có type filter, lấy tất cả bài tập của bài học
    filteredExercisesMap.set(
      lesson.id, 
      typeFilter ? lessonExercises.filter(ex => ex.type === typeFilter) : lessonExercises
    );
  });

  const handleClearFilters = () => {
    setSearchText('');
    setTypeFilter(undefined);
    setLevelFilter(null);
    setCategoryFilter(null);
  };

  // Cột cho bảng bài tập
  const exerciseColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 80,
      render: (_, __, index) => index + 1
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
          <Button type="link" onClick={e => { e.stopPropagation(); navigate(`/admin/exercises/edit/${record.lesson_id}/${record.id}`); }}>
            <span>Sửa</span>
          </Button>
          {record.status_id === 1 ? (
            <Button type="link" danger onClick={e => { e.stopPropagation(); handleDeleteExercise(record.id); }}>
              <span>Xóa</span>
            </Button>
          ) : (
            <Button type="link" onClick={e => { e.stopPropagation(); handleRestoreExercise(record.id); }}>
              <span>Khôi phục</span>
            </Button>
          )}
        </Space>
      )
    }
  ];

  const handleDeleteExercise = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bài tập này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // Gọi API xóa bài tập ở đây
          // await deleteExercise(id);
          // Sau đó reload lại danh sách exercises nếu cần
        } catch (error) {
          // Xử lý lỗi
        }
      }
    });
  };

  const handleRestoreExercise = (id) => {
    Modal.confirm({
      title: 'Xác nhận khôi phục',
      content: 'Bạn có chắc chắn muốn khôi phục bài tập này?',
      okText: 'Khôi phục',
      okType: 'primary',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // Gọi API khôi phục bài tập ở đây
          // await restoreExercise(id);
          // Sau đó reload lại danh sách exercises nếu cần
        } catch (error) {
          // Xử lý lỗi
        }
      }
    });
  };

  return (
    <>
    <PageTitle title="Quản lý bài tập" />
    <Layout role="admin" pageHeaderTitle="Quản lý bài tập">
      <div className={styles.container}>
        <div className={styles.header}>
          <Space className={styles.filters}>
            <Input
              placeholder="Tìm kiếm bài học..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 220 }}
              allowClear
              onClear={handleClearFilters}
            />
            <Select
              placeholder="Loại bài tập"
              allowClear
              style={{ width: 160 }}
              value={typeFilter}
              onChange={setTypeFilter}
              onClear={handleClearFilters}
            >
              <Option value="multiple_choice">Trắc nghiệm</Option>
              <Option value="fill_in">Điền từ</Option>
            </Select>
            <Select
              placeholder="Cấp độ"
              allowClear
              style={{ width: 150 }}
              onChange={setLevelFilter}
              value={levelFilter}
              onClear={handleClearFilters}
            >
              <Option value={1}>Cơ bản</Option>
              <Option value={2}>Trung bình</Option>
              <Option value={3}>Nâng cao</Option>
            </Select>
            <Select
              placeholder="Danh mục"
              allowClear
              style={{ width: 200 }}
              onChange={setCategoryFilter}
              value={categoryFilter}
              onClear={handleClearFilters}
            >
              <Option value="Thì hiện tại">Thì hiện tại</Option>
              <Option value="Thì quá khứ">Thì quá khứ</Option>
              <Option value="Thì tương lai">Thì tương lai</Option>
            </Select>
          </Space>
        </div>

        <Collapse 
          accordion
          activeKey={activeKey}
          onChange={(key) => setActiveKey(key)}
        >
          {filteredLessons.map(lesson => {
            return (
              <Panel
                header={
                  <div className={styles.panelHeader}>
                    <div>
                      <span className={styles.lessonTitle}>{lesson.title}</span>
                      <span className={styles.lessonInfo}>{LEVEL_MAP[lesson.level] || 'Chưa phân loại'}</span>
                      {lesson.category && <span className={styles.lessonInfo}>{lesson.category}</span>}
                    </div>
                    <div>
                      <span className={styles.exerciseCount}>
                        Trắc nghiệm: {exercises.filter(ex => ex.lesson_id === lesson.id && ex.type === 'multiple_choice').length}
                      </span>
                      <span>
                        Điền từ: {exercises.filter(ex => ex.lesson_id === lesson.id && ex.type === 'fill_in').length}
                      </span>
                    </div>
                  </div>
                }
                key={lesson.id}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className={styles.addButton}
                  onClick={() => navigate(`/admin/exercises/create/${lesson.id}`)}
                >
                  Thêm bài tập
                </Button>
                <Table
                  columns={exerciseColumns}
                  dataSource={filteredExercisesMap.get(lesson.id)}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  locale={{ emptyText: 'Không có bài tập nào' }}
                  onRow={(record) => ({
                    onClick: () => {
                      setSelectedExercise(record);
                      setIsModalVisible(true);
                    }
                  })}
                  scroll={{ x: 'max-content' }}
                />
              </Panel>
            );
          })}
        </Collapse>
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
                        className={
                          (opt.id && opt.id === selectedExercise.correct_answer) ||
                          (opt.text && opt.text === selectedExercise.correct_answer)
                            ? styles.correctAnswer
                            : ''
                        }
                      >
                        {opt.text || opt}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.correctAnswer}>{selectedExercise.correct_answer}</div>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
      </Layout>
    </>
  );
};

export default ExerciseList;