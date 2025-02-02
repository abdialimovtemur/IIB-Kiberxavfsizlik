import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Space, message, Modal, Form, Input, Select } from 'antd';
import { UserOutlined, FileOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { usersService } from '../services/users.service';
import { Line } from '@ant-design/plots';
import { User, Crime } from '../types/api.types';

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Crime[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchUserDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [userData, userStats, userReports] = await Promise.all([
        usersService.getUserById(Number(id)),
        usersService.getUserStats(Number(id)),
        usersService.getUserReports(Number(id))
      ]);
      setUser(userData);
      setStats(userStats);
      setReports(userReports);
    } catch (error) {
      message.error('Ma\'lumotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const handleEdit = () => {
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      await usersService.deleteUser(Number(id));
      message.success('Foydalanuvchi o\'chirildi');
      navigate('/users');
    } catch (error) {
      message.error('O\'chirishda xatolik');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await usersService.updateUser(Number(id), values);
      message.success('Foydalanuvchi yangilandi');
      setIsModalVisible(false);
      fetchUserDetails();
    } catch (error) {
      message.error('Xatolik yuz berdi');
    }
  };

  const columns = [
    {
      title: 'Sana',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Bo\'lim',
      dataIndex: ['department', 'name'],
      key: 'department',
    },
    {
      title: 'Hodisalar soni',
      dataIndex: 'total_incidents',
      key: 'total_incidents',
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: Crime) => (
        <Button type="link" onClick={() => navigate(`/reports/${record.id}`)}>
          Ko'rish
        </Button>
      ),
    }
  ];

  return (
    <Card 
      title="Foydalanuvchi ma'lumotlari"
      loading={loading}
      extra={
        <Space>
          <Button onClick={() => navigate('/users')}>
            Orqaga
          </Button>
          <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
            Tahrirlash
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
            O'chirish
          </Button>
        </Space>
      }
    >
      {user && (
        <>
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Space align="center" style={{ marginBottom: 16 }}>
                  {user.avatar ? (
                    <img src={user.avatar} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%' }} />
                  ) : (
                    <UserOutlined style={{ fontSize: 64 }} />
                  )}
                  <div>
                    <h3>{user.first_name} {user.last_name}</h3>
                    <p>{user.role}</p>
                  </div>
                </Space>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Telefon:</strong> {user.phone_number || '-'}</p>
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Hisobotlar soni"
                  value={stats?.reports_count || 0}
                  prefix={<FileOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Faollik"
                  value={stats?.activity_rate || 0}
                  suffix="%"
                />
              </Card>
            </Col>
          </Row>

          <Card title="Faollik statistikasi" style={{ marginTop: 16 }}>
            {stats?.chart_config && <Line {...stats.chart_config} />}
          </Card>

          <Card title="Hisobotlar" style={{ marginTop: 16 }}>
            <Table
              columns={columns}
              dataSource={reports}
              loading={loading}
              rowKey="id"
            />
          </Card>
        </>
      )}

      <Modal
        title="Foydalanuvchini tahrirlash"
        open={isModalVisible}
        onOk={form.submit}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            label="Foydalanuvchi nomi"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="first_name"
            label="Ism"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Familiya"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label="Telefon"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Rol"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="super_admin">Super Admin</Select.Option>
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="staff">Xodim</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserDetails; 