import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Select, Button, message } from 'antd';
import Layout from '../../../../components/layout/Layout';
import styles from './LessonCreate.module.css';
import MarkdownEditor from '../../../../components/editor/MarkdownEditor';
import MarkdownViewer from '../../../../components/markdownViewer/MarkdownViewer';
import { createLesson } from '../../../../slices/lessonSlice';

const { Option } = Select;

const CONTENT_TEMPLATE = `## 1. Cấu trúc câu

### Câu khẳng định
- (công thức)
- Ví dụ: 

### Câu phủ định
- (công thức)
- Ví dụ: 

### Câu nghi vấn
- (công thức)
- Ví dụ: 

## 2. Cách dùng

## 3. Dấu hiệu nhận biết

## 4. Lưu ý quan trọng`;

const LessonCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const loading = useSelector(state => state.lessons.loading);
  const error = useSelector(state => state.lessons.error);
  const [content, setContent] = useState(CONTENT_TEMPLATE);

  const handleSubmit = async (values) => {
    try {
      const lessonData = {
        ...values,
        type: 'grammar',
        status_id: '1'
      };
      const resultAction = await dispatch(createLesson(lessonData));
      if (createLesson.fulfilled.match(resultAction)) {
        message.success('Thêm bài học thành công!');
        navigate('/admin/lessons');
      } else {
        message.error(resultAction.payload || 'Có lỗi xảy ra khi thêm bài học!');
      }
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi thêm bài học!');
    }
  };

  const handleCancel = () => {
    navigate('/admin/lessons/');
  };

  const handleContentChange = (value) => {
    setContent(value);
    form.setFieldsValue({ content: value });
  };

  return (
    <Layout role="admin" pageHeaderTitle="Thêm bài học mới">
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
              initialValue={CONTENT_TEMPLATE}
              rules={[{ required: true, message: 'Vui lòng nhập nội dung bài học!' }]}
            >
                  <MarkdownEditor onChange={handleContentChange} placeholder="Nhập nội dung bài học..." />
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
              Thêm bài học
            </Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
};

export default LessonCreate;
