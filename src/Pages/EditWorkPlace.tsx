import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { workplacesService } from '../services/workplaces.service';
import { useNavigate, useParams } from 'react-router-dom';
import { WorkPlace } from '../types/api.types';

const EditWorkPlace = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<WorkPlace | null>(null);

  useEffect(() => {
    const fetchWorkPlace = async () => {
      if (!id) return;
      try {
        const data = await workplacesService.getWorkPlaceById(Number(id));
        setInitialData(data);
        form.setFieldsValue(data);
      } catch (error) {
        message.error('Ish joyi ma\'lumotlarini yuklashda xatolik');
        navigate('/workplaces');
      }
    };

    fetchWorkPlace();
  }, [id, form, navigate]);

  const handleSubmit = async (values: any) => {
    if (!id) return;
    
    setLoading(true);
    try {
      await workplacesService.updateWorkPlace(Number(id), values);
      message.success('Ish joyi yangilandi');
      navigate('/workplaces');
    } catch (error) {
      message.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Ish joyini tahrirlash"
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

export default EditWorkPlace; 