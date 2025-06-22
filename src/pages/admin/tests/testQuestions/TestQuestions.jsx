import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../../../components/layout/Layout';
import { fetchExercisesByLessonId } from '../../../../slices/exerciseSlice';
import { fetchLessonById } from '../../../../slices/lessonSlice';
import { Button, Space, Table, Tag, Modal, message, Typography } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import styles from './TestQuestions.module.css';
import PageTitle from '../../../../components/pageTitle/PageTitle';

const { Title } = Typography;

const TYPE_MAP = {
  multiple_choice: 'Trắc nghiệm',
  fill_in_the_blank: 'Điền vào chỗ trống',
};

const STATUS_MAP = {
  1: { text: 'Hoạt động', color: 'green' },
  2: { text: 'Đã ẩn', color: 'red' },
};

const TestQuestions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const testId = searchParams.get('testId');

  const { exercises, loading: exerciseLoading } = useSelector((state) => state.exercises);
  const { currentLesson: currentTest, loading: testLoading } = useSelector((state) => state.lessons);
  
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  useEffect(() => {
    if (testId) {
      dispatch(fetchLessonById(testId));
      dispatch(fetchExercisesByLessonId(testId));
    }
  }, [dispatch, testId]);

  const handleEditExercise = (e, exerciseId) => {
    e.stopPropagation();
    navigate(`/admin/exercises/edit/${testId}/${exerciseId}`);
  };

  const handleDeleteExercise = (e, exerciseId) => {
    e.stopPropagation();
    Modal.confirm({
      title: 'Xác nhận xóa câu hỏi',
      content: 'Bạn có chắc muốn xóa câu hỏi này không?',
      okText: 'Xóa',
      okType: 'danger',
      onOk: async () => {
        message.success('Xóa câu hỏi thành công!');
        dispatch(fetchExercisesByLessonId(testId));
      },
    });
  };
  
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Câu hỏi', dataIndex: 'question', key: 'question', ellipsis: true },
    { title: 'Loại', dataIndex: 'type', key: 'type', render: (type) => TYPE_MAP[type] || type },
    { title: 'Trạng thái', dataIndex: 'status_id', key: 'status_id', render: (status) => <Tag color={STATUS_MAP[status]?.color}>{STATUS_MAP[status]?.text}</Tag> },
    { title: 'Ngày tạo', dataIndex: 'created_date', key: 'created_date', render: (date) => new Date(date).toLocaleDateString('vi-VN') },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={(e) => handleEditExercise(e, record.id)}>Sửa</Button>
          <Button type="link" danger onClick={(e) => handleDeleteExercise(e, record.id)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  const pageTitle = currentTest ? `Câu hỏi cho: ${currentTest.title}` : 'Quản lý câu hỏi';

  return (
    <>
      <PageTitle title={pageTitle} />
      <Layout role="admin">
        <div className={styles.container}>
          <div className={styles.header}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/tests')}>
              Quay lại danh sách
            </Button>
            <Title level={3} style={{ flex: 1, textAlign: 'center', margin: 0 }}>
              {testLoading ? 'Đang tải...' : pageTitle}
            </Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/admin/exercises/create/${testId}`)}>
              Thêm câu hỏi
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={exercises}
            loading={exerciseLoading}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            onRow={(record) => ({
              onClick: () => {
                setSelectedQuestion(record);
                setIsModalVisible(true);
              },
              style: { cursor: 'pointer' }
            })}
          />
        </div>
      </Layout>
      <Modal
        open={isModalVisible}
        title="Chi tiết câu hỏi"
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        {selectedQuestion && (
          <div>
            <p><b>Câu hỏi:</b></p>
            <p>{selectedQuestion.question}</p>
            <p><b>Đáp án:</b></p>
            {selectedQuestion.type === 'multiple_choice' && Array.isArray(selectedQuestion.options) ? (
              <ul>
                {selectedQuestion.options.map((option, index) => (
                  <li
                    key={option.id || index}
                    className={option.id === selectedQuestion.correct_answer ? styles.correctAnswer : ''}
                  >
                    <b>{option.id}:</b> {option.text}
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.correctAnswer}>{selectedQuestion.correct_answer}</div>
            )}
             <p><b>Giải thích:</b></p>
             <p>{selectedQuestion.explanation || 'Chưa có giải thích.'}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default TestQuestions; 