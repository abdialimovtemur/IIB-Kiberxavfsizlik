import { Layout, Menu, Avatar, Space } from 'antd';
import { useState } from 'react';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileOutlined,
  BankOutlined,
  FolderOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Notifications from '../components/Notifications';

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const getMenuItems = () => {
    const items = [];

    // Foydalanuvchi rolini tekshirish
    const userRole = user?.role || 'user';

    // Barcha rollar uchun (super_admin, admin va oddiy foydalanuvchi)
    items.push(
      {
        key: '1',
        icon: <DashboardOutlined />,
        label: <Link to="/dashboard">Dashboard</Link>,
      },
      {
        key: '2',
        icon: <FileOutlined />,
        label: <Link to="/reports">Hisobotlar</Link>,
      },
      {
        key: '3',
        icon: <SettingOutlined />,
        label: <Link to="/settings">Sozlamalar</Link>,
      }
    );

    // Super admin uchun qo'shimcha menu elementlari
    if (userRole === 'super_admin') {
      items.push(
        {
          key: '4',
          icon: <UserOutlined />,
          label: <Link to="/users">Foydalanuvchilar</Link>,
        },
        {
          key: '5',
          icon: <BankOutlined />,
          label: <Link to="/workplaces">Ish joylari</Link>,
        },
        {
          key: '6',
          icon: <FolderOutlined />,
          label: <Link to="/departments">Bo'limlar</Link>,
        },
        {
          key: '7',
          icon: <BankOutlined />,
          label: <Link to="/regions">Viloyatlar</Link>,
        }
      );
    }
    // Admin uchun qo'shimcha menu elementlari
    else if (userRole === 'admin') {
      items.push(
        {
          key: '4',
          icon: <FolderOutlined />,
          label: <Link to="/departments">Bo'limlar</Link>,
        }
      );
    }
    // Oddiy foydalanuvchi uchun qo'shimcha menu elementlari (agar kerak bo'lsa)
    else if (userRole === 'user') {
      // Oddiy foydalanuvchi uchun maxsus menu elementlari
    }

    // Chiqish tugmasi (barcha rollar uchun)
    items.push({
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Chiqish',
      onClick: handleLogout,
    });

    return items;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" style={{ height: 64, textAlign: 'center', color: 'white', padding: '16px' }}>
          {collapsed ? 'A' : 'Admin Panel'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={getMenuItems()}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16 }}>
          <div onClick={() => setCollapsed(!collapsed)} style={{ padding: 16, cursor: 'pointer' }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <Space size={24}>
            <Notifications />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.username || 'User'} ({user?.role || 'user'})</span>
            </div>
          </Space>
        </Header>
        <Content style={{ margin: '16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export { AdminLayout }; 