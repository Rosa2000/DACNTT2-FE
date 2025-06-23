import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../../../../components/layout/Layout';
import CommonTable from '../../../../components/commonTable/CommonTable';
import { fetchUsers, deleteUserAction, restoreUserAction } from '../../../../slices/userSlice';
import { getUserById } from '../../../../api/userApi';
import { Button, Space, Modal, message, Input, Select, Typography, Tag, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import styles from './UserList.module.css';
import PageTitle from '../../../../components/pageTitle/PageTitle';

const { Option } = Select;
const { Title } = Typography;
const { confirm } = Modal;

const STATUS_MAP = {
  1: { text: 'Hoạt động', color: 'green' },
  2: { text: 'Đã ẩn', color: 'red' }
};

const ROLE_MAP = {
  1: 'Quản trị viên',
  2: 'Học viên'
};

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, total } = useSelector((state) => state.userManagement);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [searchText, setSearchText] = useState('');
  const [groupIdFilter, setGroupIdFilter] = useState(undefined);
  const [statusIdFilter, setStatusIdFilter] = useState(undefined);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userDetailLoading, setUserDetailLoading] = useState(false);
  const searchDebounceRef = useRef();

  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    searchDebounceRef.current = setTimeout(() => {
      dispatch(fetchUsers({
        page: pagination.current,
        pageSize: pagination.pageSize,
        filters: searchText,
        groupId: groupIdFilter,
        status_id: statusIdFilter,
      }));
    }, 200);
    return () => clearTimeout(searchDebounceRef.current);
  }, [dispatch, pagination, searchText, groupIdFilter, statusIdFilter]);

  const handleRowClick = async (record) => {
    setIsModalVisible(true);
    setUserDetailLoading(true);
    try {
      const res = await getUserById(record.id);
      setSelectedUser(res.data.data);
    } catch (err) {
      message.error('Không thể tải chi tiết người dùng');
      setSelectedUser(null);
    } finally {
      setUserDetailLoading(false);
    }
  };

  const handleDeleteUser = (id) => {
    confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa người dùng này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const result = await dispatch(deleteUserAction(id)).unwrap();
          if (result.code === 0) {
            message.success('Xóa người dùng thành công!');
            dispatch(fetchUsers({
              page: pagination.current,
              pageSize: pagination.pageSize,
              filters: searchText,
              groupId: groupIdFilter,
              status_id: statusIdFilter,
            }));
          } else {
            message.error(result.message || 'Có lỗi xảy ra khi xóa người dùng!');
          }
        } catch (error) {
          message.error(error.message || 'Có lỗi xảy ra khi xóa người dùng!');
        }
      }
    });
  };

  const handleRestoreUser = (id) => {
    confirm({
      title: 'Xác nhận khôi phục',
      content: 'Bạn có chắc chắn muốn khôi phục người dùng này?',
      okText: 'Khôi phục',
      okType: 'primary',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const result = await dispatch(restoreUserAction(id)).unwrap();
          if (result.code === 0) {
            message.success('Khôi phục người dùng thành công!');
            dispatch(fetchUsers({
              page: pagination.current,
              pageSize: pagination.pageSize,
              filters: searchText,
              groupId: groupIdFilter,
              status_id: statusIdFilter,
            }));
          } else {
            message.error(result.message || 'Có lỗi xảy ra khi khôi phục người dùng!');
          }
        } catch (error) {
          message.error(error.message || 'Có lỗi xảy ra khi khôi phục người dùng!');
        }
      }
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Tên đăng nhập', dataIndex: 'username', key: 'username', ellipsis: true },
    { title: 'Họ tên', dataIndex: 'fullname', key: 'fullname', ellipsis: true },
    { title: 'Email', dataIndex: 'email', key: 'email', ellipsis: true },
    { 
      title: 'Vai trò', 
      dataIndex: 'user_group', 
      key: 'user_group', 
      render: (user_group) => ROLE_MAP[user_group?.[0]] || 'Không xác định'
    },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status_id', 
      key: 'status_id', 
      render: (status_id) => {
        const { text, color } = STATUS_MAP[status_id] || { text: 'Không xác định', color: 'default' };
        return <Tag color={color}>{text}</Tag>;
      }
    },
    { 
      title: 'Ngày tạo', 
      dataIndex: 'created_date', 
      key: 'created_date', 
      render: (date) => new Date(date).toLocaleDateString('vi-VN') 
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={e => { e.stopPropagation(); navigate(`/admin/users/edit/${record.id}`); }}>
            <span>Sửa</span>
          </Button>
          {record.status_id === 1 ? (
            <Button type="link" danger onClick={e => { e.stopPropagation(); handleDeleteUser(record.id); }}>
              <span>Xóa</span>
            </Button>
          ) : (
            <Button type="link" onClick={e => { e.stopPropagation(); handleRestoreUser(record.id); }}>
              <span>Khôi phục</span>
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <>
      <PageTitle title="Quản lý người dùng" />
      <Layout role="admin" pageHeaderTitle="Quản lý người dùng">
        <div className={styles.container}>
          <Row gutter={[16, 16]} align="middle" className={styles.header}>
            <Col xs={24} lg={18}>
              <div className={styles.filters}>
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  allowClear
                  className={styles.filterInput}
                />
                <Select
                  placeholder="Vai trò"
                  allowClear
                  value={groupIdFilter}
                  onChange={setGroupIdFilter}
                  className={styles.filterSelect}
                >
                  <Option value={1}>Quản trị viên</Option>
                  <Option value={2}>Học viên</Option>
                </Select>
                <Select
                  placeholder="Trạng thái"
                  allowClear
                  value={statusIdFilter}
                  onChange={setStatusIdFilter}
                  className={styles.filterSelect}
                >
                  <Option value={1}>Hoạt động</Option>
                  <Option value={2}>Đã ẩn</Option>
                </Select>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={() => navigate('/admin/users/create')}
                  className={styles.filterButton}
                >
                  Thêm người dùng
                </Button>
              </div>
            </Col>
          </Row>

          <div className={styles.tableContainer}>
            <CommonTable
              columns={columns}
              dataSource={users}
              loading={loading}
              total={total}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: total,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} người dùng`,
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
            title="Chi tiết người dùng"
            footer={null}
            onCancel={() => {
              setIsModalVisible(false);
              setSelectedUser(null);
            }}
          >
            {userDetailLoading ? (
              <div>Đang tải...</div>
            ) : selectedUser ? (
              <div>
                <p><b>Tên đăng nhập:</b> {selectedUser.username}</p>
                <p><b>Họ tên:</b> {selectedUser.fullname}</p>
                <p><b>Email:</b> {selectedUser.email}</p>
                <p><b>Số điện thoại:</b> {selectedUser.phone_number}</p>
                <p><b>Giới tính:</b> {selectedUser.gender}</p>
                <p><b>Địa chỉ:</b> {selectedUser.address}</p>
                <p><b>Phường/Xã:</b> {selectedUser.ward}</p>
                <p><b>Quận/Huyện:</b> {selectedUser.district}</p>
                <p><b>Tỉnh/Thành phố:</b> {selectedUser.province}</p>
                <p><b>Quốc gia:</b> {selectedUser.country}</p>
                <p><b>Vai trò:</b> {ROLE_MAP[selectedUser.user_group?.[0]] || 'Không xác định'}</p>
                <p><b>Trạng thái:</b> {STATUS_MAP[selectedUser.status_id]?.text || 'Không xác định'}</p>
                <p><b>Ngày tạo:</b> {new Date(selectedUser.created_date).toLocaleDateString('vi-VN')}</p>
              </div>
            ) : (
              <div>Không có dữ liệu</div>
            )}
          </Modal>
        </div>
      </Layout>
    </>
  );
};

export default UserList;
