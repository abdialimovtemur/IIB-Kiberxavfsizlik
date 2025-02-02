import { useEffect, useState } from 'react';
import { Table, Button, Space, Card, Input, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { regionsService } from '../services/regions.service';
import { Region } from '../types/api.types';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const Regions = () => {
  const navigate = useNavigate();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRegions = async () => {
    setLoading(true);
    try {
      const response = await regionsService.getRegions();
      setRegions(response.results);
    } catch (error) {
      message.error('Viloyatlarni yuklashda xatolik!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await regionsService.deleteRegion(id);
      message.success('Viloyat o\'chirildi');
      fetchRegions();
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
      title: 'Kod',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Amallar',
      key: 'actions',
      render: (_: any, record: Region) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/regions/${record.id}`)}
          >
            Ko'rish
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/regions/edit/${record.id}`)}
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
    <Card title="Viloyatlar">
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Qidirish..."
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/regions/create')}
        >
          Yangi viloyat
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={regions}
        loading={loading}
        rowKey="id"
      />
    </Card>
  );
};

export default Regions; 