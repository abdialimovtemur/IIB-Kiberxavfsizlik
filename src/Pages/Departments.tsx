import { useEffect, useState } from 'react';
import { Table, Button, Space, Card, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { departmentsService } from '../services/departments.service';
import { Department } from '../types/api.types';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const Departments = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await departmentsService.getDepartments();
      setDepartments(response.results);
    } catch (error) {
      message.error('Bo\'limlarni yuklashda xatolik!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await departmentsService.deleteDepartment(id);
      message.success('Bo\'lim o\'chirildi');
      fetchDepartments();
    } catch (error) {
      message.error('O\'chirishda xatolik');
    }
  };

  const columns = [
    {
      title: 'Nomi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: Department) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/departments/${record.id}`)}
          >
            Ko'rish
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/departments/edit/${record.id}`)}
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
    <Card title="Bo'limlar">
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Qidirish..."
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/departments/create')}
        >
          Yangi bo'lim
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={departments}
        loading={loading}
        rowKey="id"
      />
    </Card>
  );
};

export default Departments; 