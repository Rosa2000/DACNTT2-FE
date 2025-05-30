import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Select, Button, message, Space } from 'antd';
import { getUserById, updateUser } from '../../../../api/userApi';
import Layout from '../../../../components/layout/Layout';
import styles from './UserEdit.module.css';

const { Option } = Select;

const UserEdit = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      const response = await getUserById(id);
      const userData = response.data.data;
      form.setFieldsValue({
        fullname: userData.fullname,
        email: userData.email,
        phoneNumber: userData.phone_number,
        gender: userData.gender,
        address: userData.address,
        ward: userData.ward,
        district: userData.district,
        province: userData.province,
        country: userData.country,
        userGroupId: userData.user_group
      });
    } catch (error) {
      message.error('Không thể tải thông tin người dùng');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await updateUser(id, {
        data: {
          ...values,
          phoneNumber: values.phoneNumber
        }
      });
      message.success('Cập nhật người dùng thành công');
      navigate('/admin/users');
    } catch (error) {
      message.error('Cập nhật người dùng thất bại');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumb = [
    { title: 'Trang chủ', path: '/admin' },
    { title: 'Quản lý người dùng', path: '/admin/users' },
    { title: 'Chỉnh sửa người dùng', path: `/admin/users/edit/${id}` }
  ];

  return (
    <Layout
      pageHeaderTitle="Chỉnh sửa người dùng"
      pageHeaderSubtitle="Cập nhật thông tin người dùng trong hệ thống"
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
                Cập nhật
              </Button>
              <Button onClick={() => navigate('/admin/users')}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
};

export default UserEdit;
