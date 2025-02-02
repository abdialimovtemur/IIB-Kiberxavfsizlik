import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Upload, message, Space, Card, Row, Col, Statistic, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, FileOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import { usersService } from '../services/users.service';
import { workplacesService } from '../services/workplaces.service';
import { User, WorkPlace } from '../types/api.types';
import type { UploadFile } from 'antd/es/upload/interface';
import { Line } from '@ant-design/plots';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [workplaces, setWorkplaces] = useState<WorkPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [avatar, setAvatar] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersService.getUsers();
      setUsers(data);
    } catch (error) {
      message.error('Foydalanuvchilarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkplaces = async () => {
    try {
      const data = await workplacesService.getWorkplaces();
      setWorkplaces(data);
    } catch (error) {
      message.error('Ish joylarini yuklashda xatolik');
    }
  };

  const fetchUserStats = async (id: number) => {
    try {
      const stats = await usersService.getUserStats(id);
      setUserStats(stats);
    } catch (error) {
      message.error('Statistikani yuklashda xatolik');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWorkplaces();
  }, []);

  const handleAdd = () => {
    setSelectedUser(null);
    form.resetFields();
    setAvatar([]);
    setIsModalVisible(true);
  };

  const handleEdit = (record: User) => {
    setSelectedUser(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await usersService.deleteUser(id);
      message.success('Foydalanuvchi o\'chirildi');
      fetchUsers();
    } catch (error) {
      message.error('O\'chirishda xatolik');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await usersService.bulkDeleteUsers(selectedIds);
      message.success('Tanlangan foydalanuvchilar o\'chirildi');
      setSelectedIds([]);
      fetchUsers();
    } catch (error) {
      message.error('O\'chirishda xatolik');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && key !== 'avatar') {
          formData.append(key, values[key]);
        }
      });

      if (avatar[0]?.originFileObj) {
        formData.append('avatar', avatar[0].originFileObj);
      }

      if (selectedUser) {
        await usersService.updateUser(selectedUser.id, formData);
        message.success('Foydalanuvchi yangilandi');
      }
      setIsModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error('Xatolik yuz berdi');
    }
  };

  const handleStatusChange = async (id: number, isActive: boolean) => {
    try {
      await usersService.changeUserStatus(id, isActive);
      message.success('Status o\'zgartirildi');
      fetchUsers();
    } catch (error) {
      message.error('Statusni o\'zgartirishda xatolik');
    }
  };

  const handleRoleChange = async (id: number, role: string) => {
    try {
      await usersService.changeUserRole(id, role);
      message.success('Rol o\'zgartirildi');
      fetchUsers();
    } catch (error) {
      message.error('Rolni o\'zgartirishda xatolik');
    }
  };

  const handleSearch = async (value: string) => {
    try {
      const data = await usersService.searchUsers(value);
      setUsers(data);
    } catch (error) {
      message.error('Qidirishda xatolik');
    }
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Ism',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Familiya',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/users/${record.id}`)}
          >
            Ko'rish
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/users/edit/${record.id}`)}
          >
            Tahrirlash
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            O'chirish
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Foydalanuvchilar">
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Qidirish..."
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/users/create')}
        >
          Yangi foydalanuvchi
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
      />
    </Card>
  );
};

export default Users;