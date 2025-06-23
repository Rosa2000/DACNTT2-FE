import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Select, Button, message, InputNumber, Row, Col, Space } from 'antd';
import Layout from '../../../../components/layout/Layout';
import PageTitle from '../../../../components/pageTitle/PageTitle';
import MarkdownEditor from '../../../../components/editor/MarkdownEditor';
import MarkdownViewer from '../../../../components/markdownViewer/MarkdownViewer';
import { createLesson } from '../../../../api/lessonApi';
import styles from './TestCreate.module.css';

const { Option } = Select;

const TestCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loading, error } = useSelector((state) => state.lessons);
  const [content, setContent] = useState('');

  const handleContentChange = (value) => {
    setContent(value);
    form.setFieldsValue({ content: value });
  };

  const handleSubmit = async (values) => {
    const testData = {
      ...values,
      type: 'test', // Hardcode type là 'test'
      status_id: 1, // Mặc định là hoạt động
    };

    try {
      const response = await createLesson(testData);
      if (response.data.code === 0) {
        message.success('Tạo bài kiểm tra thành công!');
        navigate('/admin/tests');
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra!');
      }
    } catch (err) {
      message.error(err.message || 'Có lỗi xảy ra khi tạo bài kiểm tra!');
    }
  };

  return (
    <>
      <PageTitle title="Tạo bài kiểm tra mới" />
      <Layout role="admin" pageHeaderTitle="Tạo bài kiểm tra mới">
        <div className={styles.container}>
          <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorText}>{error}</div>}

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item name="title" label="Tiêu đề bài kiểm tra" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                  <Input placeholder="Nhập tiêu đề" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="level" label="Cấp độ" rules={[{ required: true, message: 'Vui lòng chọn cấp độ!' }]}>
                  <Select placeholder="Chọn cấp độ">
                    <Option value={1}>Cơ bản</Option>
                    <Option value={2}>Trung bình</Option>
                    <Option value={3}>Nâng cao</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="duration" label="Thời gian làm bài (phút)" rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}>
              <InputNumber min={1} style={{ width: '100%' }} placeholder="Ví dụ: 15" />
            </Form.Item>

            <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
              <Input.TextArea rows={4} placeholder="Nhập mô tả ngắn cho bài kiểm tra" />
            </Form.Item>

            <Row gutter={24}>
              <Col xs={24} lg={12}>
                <Form.Item
                  name="content"
                  label="Nội dung/Hướng dẫn"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                  <MarkdownEditor onChange={handleContentChange} />
                </Form.Item>
              </Col>
              <Col xs={24} lg={12}>
                <div className={styles.preview}>
                  <h3>Xem trước</h3>
                  <div className={styles.previewContent}>
                    <MarkdownViewer content={content} />
                  </div>
                </div>
              </Col>
            </Row>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading} style={{ backgroundColor: '#58cc02', borderColor: '#58cc02' }}>
                  Tạo bài kiểm tra
                </Button>
                <Button onClick={() => navigate('/admin/tests')}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Layout>
    </>
  );
};

export default TestCreate; 