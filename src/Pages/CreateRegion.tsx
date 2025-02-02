import { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { regionsService } from '../services/regions.service';
import { useNavigate } from 'react-router-dom';

const CreateRegion = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await regionsService.createRegion(values);
      message.success('Viloyat yaratildi');
      navigate('/regions');
    } catch (error) {
      message.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Yangi viloyat"
      extra={
        <Button onClick={() => navigate('/regions')}>
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
          name="code"
          label="Kod"
          rules={[{ required: true, message: 'Kodni kiriting!' }]}
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

export default CreateRegion; 