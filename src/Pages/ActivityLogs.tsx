import { useEffect, useState } from 'react';
import { Table, Card, Button, DatePicker, Space, message } from 'antd';
import { activityService } from '../services/activity.service';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface ActivityLog {
  id: number;
  user: string;
  action: string;
  details: string;
  ip_address: string;
  created_at: string;
}

const ActivityLogs = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = dateRange[0] && dateRange[1] ? {
        start_date: dateRange[0].format('YYYY-MM-DD'),
        end_date: dateRange[1].format('YYYY-MM-DD')
      } : undefined;

      const data = await activityService.getLogs(params);
      setLogs(data.results);
    } catch (error) {
      message.error('Loglarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [dateRange]);

  const handleClearLogs = async () => {
    try {
      await activityService.clearLogs();
      message.success('Loglar tozalandi');
      setLogs([]);
    } catch (error) {
      message.error('Xatolik yuz berdi');
    }
  };

  const columns = [
    {
      title: 'Foydalanuvchi',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Harakat',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Tafsilotlar',
      dataIndex: 'details',
      key: 'details',
    },
    {
      title: 'IP manzil',
      dataIndex: 'ip_address',
      key: 'ip_address',
    },
    {
      title: 'Sana',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <Card title="Faoliyat tarixi">
      <Space style={{ marginBottom: 16 }}>
        <RangePicker
          onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
        />
        <Button danger onClick={handleClearLogs}>
          Loglarni tozalash
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={logs}
        loading={loading}
        rowKey="id"
      />
    </Card>
  );
};

export default ActivityLogs; 