import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { regionsService } from '../services/regions.service';
import { useNavigate, useParams } from 'react-router-dom';
import { Region } from '../types/api.types';

const EditRegion = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Region | null>(null);

  useEffect(() => {
    const fetchRegion = async () => {
      if (!id) return;
      try {
        const data = await regionsService.getRegionById(Number(id));
        setInitialData(data);
        form.setFieldsValue(data);
      } catch (error) {
        message.error('Viloyat ma\'lumotlarini yuklashda xatolik');
        navigate('/regions');
      }
    };

    fetchRegion();
  }, [id, form, navigate]);

  const handleSubmit = async (values: any) => {
    if (!id) return;
    
    setLoading(true);
    try {
      await regionsService.updateRegion(Number(id), values);
      message.success('Viloyat yangilandi');
      navigate('/regions');
    } catch (error) {
      message.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Viloyatni tahrirlash"
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
        initialValues={initialData || {}}
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

export default EditRegion; 