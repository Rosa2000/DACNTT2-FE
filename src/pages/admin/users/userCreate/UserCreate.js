import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, message, Space } from 'antd';
import { createUser } from '../../../../api/userApi';
import Layout from '../../../../components/layout/Layout';
import styles from './UserCreate.module.css';

const { Option } = Select;

const UserCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await createUser({
        data: {
          ...values,
          phoneNumber: values.phoneNumber
        }
      });
      message.success('Thêm mới người dùng thành công');
      navigate('/admin/users');
    } catch (error) {
      message.error('Thêm mới người dùng thất bại');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumb = [
    { title: 'Trang chủ', path: '/admin' },
    { title: 'Quản lý người dùng', path: '/admin/users' },
    { title: 'Thêm mới người dùng', path: '/admin/users/create' }
  ];

  return (
    <Layout
      pageHeaderTitle="Thêm mới người dùng"
      pageHeaderSubtitle="Tạo tài khoản người dùng mới trong hệ thống"
      pageHeaderBreadcrumb={breadcrumb}
    >
      <div className={styles.container}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className={styles.form}
        >
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="fullname"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="gender" label="Giới tính">
            <Select>
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>

          <Form.Item name="ward" label="Phường/Xã">
            <Input />
          </Form.Item>

          <Form.Item name="district" label="Quận/Huyện">
            <Input />
          </Form.Item>

          <Form.Item name="province" label="Tỉnh/Thành phố">
            <Input />
          </Form.Item>

          <Form.Item name="country" label="Quốc gia">
            <Input />
          </Form.Item>

          <Form.Item
            name="userGroupId"
            label="Nhóm người dùng"
            rules={[{ required: true, message: 'Vui lòng chọn nhóm người dùng' }]}
          >
            <Select mode="multiple">
              <Option value={1}>Admin</Option>
              <Option value={2}>Học viên</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Thêm mới
              </Button>
              <Button onClick={() => navigate('/admin/users')}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
};

export default UserCreate;
