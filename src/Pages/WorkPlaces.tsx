import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Card, Tabs, Row, Col, Statistic } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, FileOutlined, EyeOutlined } from '@ant-design/icons';
import { workplacesService } from '../services/workplaces.service';
import { WorkPlace, User, Crime } from '../types/api.types';
import { Line } from '@ant-design/plots';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const WorkPlaces = () => {
  const navigate = useNavigate();
  const [workplaces, setWorkplaces] = useState<WorkPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedWorkplace, setSelectedWorkplace] = useState<WorkPlace | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [workplaceStats, setWorkplaceStats] = useState<any>(null);
  const [workplaceUsers, setWorkplaceUsers] = useState<User[]>([]);
  const [workplaceReports, setWorkplaceReports] = useState<Crime[]>([]);
  const [form] = Form.useForm();

  const fetchWorkplaces = async () => {
    setLoading(true);
    try {
      const response = await workplacesService.getWorkplaces();
      setWorkplaces(response.results);
    } catch (error) {
      message.error('Ish joylarini yuklashda xatolik!');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkplaceDetails = async (id: number) => {
    try {
      const [stats, users, reports] = await Promise.all([
        workplacesService.getWorkplaceStats(id),
        workplacesService.getWorkplaceUsers(id),
        workplacesService.getWorkplaceReports(id)
      ]);
      setWorkplaceStats(stats);
      setWorkplaceUsers(users);
      setWorkplaceReports(reports);
    } catch (error) {
      message.error('Ma\'lumotlarni yuklashda xatolik');
    }
  };

  useEffect(() => {
    fetchWorkplaces();
  }, []);

  const handleAdd = () => {
    setSelectedWorkplace(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: WorkPlace) => {
    setSelectedWorkplace(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await workplacesService.deleteWorkPlace(id);
      message.success('Ish joyi o\'chirildi');
      fetchWorkplaces();
    } catch (error) {
      message.error('O\'chirishda xatolik');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await workplacesService.bulkDeleteWorkplaces(selectedIds);
      message.success('Tanlangan ish joylari o\'chirildi');
      setSelectedIds([]);
      fetchWorkplaces();
    } catch (error) {
      message.error('O\'chirishda xatolik');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (selectedWorkplace) {
        await workplacesService.updateWorkplace(selectedWorkplace.id, values);
        message.success('Ish joyi yangilandi');
      } else {
        await workplacesService.createWorkplace(values);
        message.success('Ish joyi yaratildi');
      }
      setIsModalVisible(false);
      fetchWorkplaces();
    } catch (error) {
      message.error('Xatolik yuz berdi');
    }
  };

  const columns = [
    {
      title: 'Nomi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Manzil',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: WorkPlace) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/workplaces/${record.id}`)}
          >
            Ko'rish
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/workplaces/edit/${record.id}`)}
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
    <Card title="Ish joylari">
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Qidirish..."
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/workplaces/create')}
        >
          Yangi ish joyi
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={workplaces}
        loading={loading}
        rowKey="id"
      />

      {workplaceStats && (
        <Card style={{ marginTop: 16 }}>
          <Tabs>
            <Tabs.TabPane tab="Statistika" key="1">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic 
                    title="Xodimlar soni" 
                    value={workplaceStats.users_count} 
                    prefix={<UserOutlined />} 
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="Hisobotlar soni" 
                    value={workplaceStats.reports_count} 
                    prefix={<FileOutlined />} 
                  />
                </Col>
              </Row>
              <div style={{ marginTop: 24 }}>
                <Line {...workplaceStats.chart_config} />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Xodimlar" key="2">
              <Table 
                columns={[
                  { title: 'Ism', dataIndex: 'first_name' },
                  { title: 'Familiya', dataIndex: 'last_name' },
                  { title: 'Telefon', dataIndex: 'phone_number' },
                  { title: 'Rol', dataIndex: 'role' }
                ]}
                dataSource={workplaceUsers}
                rowKey="id"
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Hisobotlar" key="3">
              <Table 
                columns={[
                  { title: 'Sana', dataIndex: 'date' },
                  { title: 'Hodisalar soni', dataIndex: 'incidents_count' }
                ]}
                dataSource={workplaceReports}
                rowKey="id"
              />
            </Tabs.TabPane>
          </Tabs>
        </Card>
      )}

      <Modal
        title={selectedWorkplace ? "Ish joyini tahrirlash" : "Yangi ish joyi"}
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
            name="name"
            label="Nomi"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Manzil"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Telefon"
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default WorkPlaces; 