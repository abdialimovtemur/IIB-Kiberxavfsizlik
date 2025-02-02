import { useState } from 'react';
import { Card, Form, Input, Button, Upload, message, Tabs, Avatar } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { settingsService } from '../services/settings.service';
import type { UploadFile } from 'antd/es/upload/interface';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { user } = useAuth();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<UploadFile[]>([]);

  const handleProfileUpdate = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      Object.keys(values).forEach(key => {
        if (values[key] && key !== 'avatar') {
          formData.append(key, values[key]);
        }
      });

      if (avatar[0]?.originFileObj) {
        formData.append('avatar', avatar[0].originFileObj);
      }

      await settingsService.updateProfile(formData);
      message.success('Profil muvaffaqiyatli yangilandi');
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Profilni yangilashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values: any) => {
    setLoading(true);
    try {
      await settingsService.changePassword(values);
      message.success('Parol muvaffaqiyatli o\'zgartirildi');
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Parolni o\'zgartirishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: '1',
      label: 'Profil',
      children: (
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileUpdate}
          initialValues={user || undefined}
        >
          <Form.Item label="Avatar">
            <Upload
              listType="picture-circle"
              fileList={avatar}
              onChange={({ fileList }) => setAvatar(fileList)}
              maxCount={1}
              beforeUpload={() => false}
            >
              {avatar.length === 0 && (
                user?.avatar ? 
                <Avatar src={user.avatar} size={80} /> :
                <div>
                  <UserOutlined />
                  <div style={{ marginTop: 8 }}>Yuklash</div>
                </div>
              )}
            </Upload>
          </Form.Item>

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
            rules={[
              { required: true },
              { type: 'email' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone_number"
            label="Telefon"
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: 'Parol',
      children: (
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            name="old_password"
            label="Joriy parol"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="new_password"
            label="Yangi parol"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="new_password2"
            label="Yangi parolni tasdiqlang"
            dependencies={['new_password']}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Parollar mos kelmadi!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Parolni o'zgartirish
            </Button>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <Card title="Sozlamalar">
      <Tabs defaultActiveKey="1" items={items} />
    </Card>
  );
};

export default Settings;