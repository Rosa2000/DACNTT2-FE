import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Select, Button, message, Space } from 'antd';
import Layout from '../../../../components/layout/Layout';
import styles from './LessonEdit.module.css';
import MarkdownEditor from '../../../../components/editor/MarkdownEditor';
import MarkdownViewer from '../../../../components/markdownViewer/MarkdownViewer';
import { fetchLessonById } from '../../../../slices/lessonSlice';
import { updateLesson } from '../../../../api/lessonApi';

const { Option } = Select;

const LessonEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const loading = useSelector(state => state.lessons.loading);
  const error = useSelector(state => state.lessons.error);
  const currentLesson = useSelector(state => state.lessons.currentLesson);
  const [content, setContent] = useState('');

  useEffect(() => {
    dispatch(fetchLessonById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentLesson) {
      form.setFieldsValue({
        title: currentLesson.title,
        level: currentLesson.level,
        category: currentLesson.category,
        content: currentLesson.content
      });
      setContent(currentLesson.content);
    }
  }, [currentLesson, form]);

  const handleSubmit = async (values) => {
    try {
      const lessonData = {
        ...values,
        type: 'grammar',
        status_id: currentLesson.status_id
      };
      const response = await updateLesson(id, lessonData);
      if (response.data.code === 0) {
        message.success('Cập nhật bài học thành công!');
        navigate('/admin/lessons');
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi cập nhật bài học!');
      }
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi cập nhật bài học!');
    }
  };

  const handleCancel = () => {
    navigate('/admin/lessons');
  };

  const handleContentChange = (value) => {
    setContent(value);
    form.setFieldsValue({ content: value });
  };

  if (!currentLesson) {
    return (
      <Layout role="admin" pageHeaderTitle="Sửa bài học">
        <div className={styles.container}>
          <div className={styles.error}>Không tìm thấy bài học</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="admin" pageHeaderTitle="Sửa bài học">
      <div className={styles.container}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
        >
          {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
          <div className={styles.formFields}>
            <Form.Item
              name="title"
              label="Tiêu đề bài học"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài học!' }]}
            >
              <Input placeholder="Nhập tiêu đề bài học" />
            </Form.Item>

            <Form.Item
              name="level"
              label="Cấp độ"
              rules={[{ required: true, message: 'Vui lòng chọn cấp độ!' }]}
            >
              <Select placeholder="Chọn cấp độ">
                <Option value={1}>Cơ bản</Option>
                <Option value={2}>Trung bình</Option>
                <Option value={3}>Nâng cao</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
            >
              <Select placeholder="Chọn danh mục">
                <Option value="Thì hiện tại">Thì hiện tại</Option>
                <Option value="Thì quá khứ">Thì quá khứ</Option>
                <Option value="Thì tương lai">Thì tương lai</Option>
              </Select>
            </Form.Item>

            <div className={styles.editorContainer}>
              <div className={styles.editor}>
                <Form.Item
                  name="content"
                  label="Nội dung bài học"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung bài học!' }]}
                >
                  <MarkdownEditor onChange={handleContentChange} />
                </Form.Item>
              </div>
              <div className={styles.preview}>
                <h3>Xem trước</h3>
                <div className={styles.previewContent}>
                  <MarkdownViewer content={content} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật bài học
            </Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default LessonEdit;
