import { useEffect, useState } from 'react';
import { Table, Button, message, Space, Card, Input, DatePicker, Select } from 'antd';
import { PlusOutlined, DownloadOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { reportsService } from '../services/reports.service';
import { Crime } from '../types/api.types';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Search } = Input;

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await reportsService.getReports();
      setReports(response.results);
    } catch (error) {
      message.error('Hisobotlarni yuklashda xatolik!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await reportsService.deleteReport(id);
      message.success('Hisobot o\'chirildi');
      fetchReports();
    } catch (error) {
      message.error('O\'chirishda xatolik');
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
        <Space>
          <Button 
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/reports/${record.id}`)}
          >
            Ko'rish
          </Button>
          <Button 
            icon={<EditOutlined />}
            onClick={() => navigate(`/reports/edit/${record.id}`)}
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
    <Card title="Hisobotlar">
      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="Qidirish..."
          onSearch={value => setSearchText(value)}
          style={{ width: 200 }}
        />
        <RangePicker
          onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/reports/create')}
        >
          Yangi hisobot
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={reports}
        loading={loading}
        rowKey="id"
      />
    </Card>
  );
};

export default Reports; 