import { useEffect, useState } from 'react';
import { Card, Form, Input, Select, Button, message } from 'antd';
import { usersService } from '../services/users.service';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../types/api.types';

const EditUser = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const data = await usersService.getUserById(Number(id));
        setInitialData(data);
        form.setFieldsValue({
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number,
          role: data.role
        });
      } catch (error) {
        message.error('Foydalanuvchi ma\'lumotlarini yuklashda xatolik');
        navigate('/users');
      }
    };

    fetchUser();
  }, [id, form, navigate]);

  const handleSubmit = async (values: any) => {
    if (!id) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      await usersService.updateUser(Number(id), formData);
      message.success('Foydalanuvchi yangilandi');
      navigate('/users');
    } catch (error) {
      message.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Foydalanuvchini tahrirlash"
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
        initialValues={initialData || {}}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Username kiritish majburiy!' }]}
        >
          <Input />
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

export default EditUser; 