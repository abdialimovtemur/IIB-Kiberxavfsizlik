import { useEffect, useState } from 'react';
import { Badge, Dropdown, List, Button, message } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { notificationsService } from '../services/notifications.service';

interface Notification {
  id: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationsService.getNotifications();
      setNotifications(data);
    } catch (error) {
      message.error('Xabarlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      message.error('Xatolik yuz berdi');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
      message.success('Barcha xabarlar o\'qilgan deb belgilandi');
    } catch (error) {
      message.error('Xatolik yuz berdi');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationsService.deleteNotification(id);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      message.success('Xabar o\'chirildi');
    } catch (error) {
      message.error('Xatolik yuz berdi');
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const notificationList = (
    <List
      loading={loading}
      itemLayout="horizontal"
      dataSource={notifications}
      style={{ width: 300, maxHeight: 400, overflow: 'auto' }}
      header={
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px' }}>
          <span>Xabarlar</span>
          {unreadCount > 0 && (
            <Button type="link" size="small" onClick={handleMarkAllAsRead}>
              Hammasini o'qilgan deb belgilash
            </Button>
          )}
        </div>
      }
      renderItem={(item) => (
        <List.Item
          actions={[
            !item.is_read && 
              <Button type="link" size="small" onClick={() => handleMarkAsRead(item.id)}>
                O'qilgan
              </Button>,
            <Button type="link" danger size="small" onClick={() => handleDelete(item.id)}>
              O'chirish
            </Button>
          ]}
          style={{ 
            backgroundColor: item.is_read ? 'transparent' : '#f0f2f5',
            padding: '8px 16px'
          }}
        >
          <List.Item.Meta
            title={item.message}
            description={new Date(item.created_at).toLocaleString()}
          />
        </List.Item>
      )}
    />
  );

  return (
    <Dropdown
      overlay={notificationList}
      trigger={['click']}
      placement="bottomRight"
    >
      <Badge count={unreadCount} style={{ cursor: 'pointer' }}>
        <BellOutlined style={{ fontSize: 20 }} />
      </Badge>
    </Dropdown>
  );
};

export default Notifications; 