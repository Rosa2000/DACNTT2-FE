import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Select, Button, message, InputNumber } from 'antd';
import Layout from '../../../../components/layout/Layout';
import PageTitle from '../../../../components/pageTitle/PageTitle';
import MarkdownEditor from '../../../../components/editor/MarkdownEditor';
import { createLesson } from '../../../../api/lessonApi';
import styles from './TestCreate.module.css';

const { Option } = Select;

const TestCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loading, error } = useSelector((state) => state.lessons);

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

            <Form.Item name="title" label="Tiêu đề bài kiểm tra" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
              <Input placeholder="Nhập tiêu đề" />
            </Form.Item>

            <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
              <Select placeholder="Chọn danh mục">
                <Option value="Kiểm tra đầu vào">Kiểm tra đầu vào</Option>
                <Option value="Kiểm tra giữa kỳ">Kiểm tra giữa kỳ</Option>
                <Option value="Kiểm tra cuối kỳ">Kiểm tra cuối kỳ</Option>
                <Option value="Kiểm tra tổng hợp">Kiểm tra tổng hợp</Option>
              </Select>
            </Form.Item>

            <Form.Item name="level" label="Cấp độ" rules={[{ required: true, message: 'Vui lòng chọn cấp độ!' }]}>
              <Select placeholder="Chọn cấp độ">
                <Option value={1}>Cấp 1 (Dễ)</Option>
                <Option value={2}>Cấp 2 (Trung bình)</Option>
                <Option value={3}>Cấp 3 (Khó)</Option>
              </Select>
            </Form.Item>

            <Form.Item name="duration" label="Thời gian làm bài (phút)" rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}>
              <InputNumber min={1} style={{ width: '100%' }} placeholder="Ví dụ: 15" />
            </Form.Item>

            <Form.Item name="content" label="Nội dung/Hướng dẫn" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
              <MarkdownEditor />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} className={styles.submitButton}>
                Tạo bài kiểm tra
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Layout>
    </>
  );
};

export default TestCreate; 