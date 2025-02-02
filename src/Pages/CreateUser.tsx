import { useState } from 'react';
import { Card, Form, Input, Select, Button, message } from 'antd';
import { usersService } from '../services/users.service';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });

      await usersService.createUser(formData);
      message.success('Foydalanuvchi yaratildi');
      navigate('/users');
    } catch (error) {
      message.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Yangi foydalanuvchi"
      extra={
        <Button onClick={() => navigate('/users')}>
          Orqaga
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Username kiritish majburiy!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Parol"
          rules={[{ required: true, message: 'Parol kiritish majburiy!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="first_name"
          label="Ism"
          rules={[{ required: true, message: 'Ism kiritish majburiy!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="last_name"
          label="Familiya"
          rules={[{ required: true, message: 'Familiya kiritish majburiy!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Email kiritish majburiy!' },
            { type: 'email', message: 'Noto\'g\'ri email format!' }
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

        <Form.Item
          name="role"
          label="Rol"
          rules={[{ required: true, message: 'Rol tanlash majburiy!' }]}
        >
          <Select>
            <Select.Option value="super_admin">Super Admin</Select.Option>
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="user">Foydalanuvchi</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateUser; 