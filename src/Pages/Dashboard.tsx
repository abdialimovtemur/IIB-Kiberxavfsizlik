import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Button, Space, message } from 'antd';
import { 
  UserOutlined, 
  FileOutlined, 
  BankOutlined,
  WarningOutlined,
  DownloadOutlined 
} from '@ant-design/icons';
import { Line, Pie } from '@ant-design/plots';
import { reportsService } from '../services/reports.service';
import { usersService } from '../services/users.service';
import { workplacesService } from '../services/workplaces.service';
import { exportService } from '../services/export.service';
import { Crime } from '../types/api.types';
import { useAuth } from '../hooks/useAuth';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    reports: 0,
    workplaces: 0,
    totalIncidents: 0,
    incidentsByType: [],
    recentReports: [],
    chartData: []
  });

  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null]);

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params = dateRange[0] && dateRange[1] ? {
        start_date: dateRange[0].format('YYYY-MM-DD'),
        end_date: dateRange[1].format('YYYY-MM-DD')
      } : undefined;

      const [reportsStats, analytics] = await Promise.all([
        reportsService.getReports(params),
        reportsService.getReportAnalytics(params)
      ]);

      if (user?.role === 'super_admin') {
        const [usersData, workplacesData] = await Promise.all([
          usersService.getUsers(),
          workplacesService.getWorkplaces()
        ]);
        
        setStats(prev => ({
          ...prev,
          users: usersData.length,
          workplaces: workplacesData.length
        }));
      }

      setStats(prev => ({
        ...prev,
        reports: reportsStats.count,
        totalIncidents: analytics.total_incidents,
        incidentsByType: analytics.incidents_by_type,
        recentReports: reportsStats.results.slice(0, 5),
        chartData: analytics.chart_data
      }));

    } catch (error) {
      message.error('Dashboard ma\'lumotlarini yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, dateRange]);

  const handleExport = async () => {
    try {
      const params = dateRange[0] && dateRange[1] ? {
        start_date: dateRange[0].format('YYYY-MM-DD'),
        end_date: dateRange[1].format('YYYY-MM-DD')
      } : undefined;

      const blob = await exportService.exportAllToPdf(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'reports.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
      message.success('Hisobot yuklab olindi');
    } catch (error) {
      message.error('Hisobotni yuklashda xatolik');
    }
  };

  const handleExportExcel = async () => {
    try {
      const params = dateRange[0] && dateRange[1] ? {
        start_date: dateRange[0].format('YYYY-MM-DD'),
        end_date: dateRange[1].format('YYYY-MM-DD')
      } : undefined;

      const blob = await reportsService.exportReportExcel(params);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'reports.xlsx';
      link.click();
      window.URL.revokeObjectURL(url);
      message.success('Excel fayl yuklab olindi');
    } catch (error) {
      message.error('Excel faylni yuklashda xatolik');
    }
  };

  const handleUserClick = (userId: number) => {
    navigate(`/users/${userId}`);
  };

  const handleReportClick = (reportId: number) => {
    navigate(`/reports/${reportId}`);
  };

  const handleRegionClick = (regionId: number) => {
    navigate(`/regions/${regionId}`);
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
      render: (_, record: any) => (
        <Button type="link" onClick={() => handleReportClick(record.id)}>
          Ko'rish
        </Button>
      ),
    }
  ];

  const lineConfig = {
    data: stats.chartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  const pieConfig = {
    data: stats.incidentsByType,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
    },
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Dashboard</h2>
        <Space>
          <RangePicker 
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])}
            value={dateRange}
          />
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleExport}
          >
            PDF
          </Button>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleExportExcel}
          >
            Excel
          </Button>
        </Space>
      </div>
      
      <Row gutter={16}>
        {user?.role === 'super_admin' && (
          <>
            <Col span={6}>
              <Card 
                hoverable
                onClick={() => navigate('/users')}
              >
                <Statistic
                  title="Foydalanuvchilar"
                  value={stats.users}
                  prefix={<UserOutlined />}
                  loading={loading}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Ish joylari"
                  value={stats.workplaces}
                  prefix={<BankOutlined />}
                  loading={loading}
                />
              </Card>
            </Col>
          </>
        )}
        <Col span={user?.role === 'super_admin' ? 6 : 12}>
          <Card>
            <Statistic
              title="Hisobotlar"
              value={stats.reports}
              prefix={<FileOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={user?.role === 'super_admin' ? 6 : 12}>
          <Card>
            <Statistic
              title="Jami hodisalar"
              value={stats.totalIncidents}
              prefix={<WarningOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card title="Hodisalar statistikasi">
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Hodisalar turlari">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      <Card title="Oxirgi hisobotlar" style={{ marginTop: 16 }}>
        <Table 
          columns={columns} 
          dataSource={stats.recentReports}
          loading={loading}
          pagination={false}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default Dashboard;