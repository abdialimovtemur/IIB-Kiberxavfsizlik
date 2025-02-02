import { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { workplacesService } from '../services/workplaces.service';
import { useNavigate } from 'react-router-dom';

const CreateWorkPlace = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await workplacesService.createWorkPlace(values);
      message.success('Ish joyi yaratildi');
      navigate('/workplaces');
    } catch (error) {
      message.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Yangi ish joyi"
      extra={
        <Button onClick={() => navigate('/workplaces')}>
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
          name="name"
          label="Nomi"
          rules={[{ required: true, message: 'Nomini kiriting!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="address"
          label="Manzil"
          rules={[{ required: true, message: 'Manzilni kiriting!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Telefon"
          rules={[{ required: true, message: 'Telefonni kiriting!' }]}
        >
          <Input />
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

export default CreateWorkPlace; 