import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Select } from 'antd';
import { departmentsService } from '../services/departments.service';
import { useNavigate } from 'react-router-dom';
import { workplacesService } from '../services/workplaces.service';

const CreateDepartment = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [workplaces, setWorkplaces] = useState([]);

  useEffect(() => {
    const fetchWorkplaces = async () => {
      try {
        const data = await workplacesService.getWorkplaces();
        setWorkplaces(data);
      } catch (error) {
        message.error('Ish joylarini yuklashda xatolik');
      }
    };

    fetchWorkplaces();
  }, []);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        formData.append(key, values[key]);
      });

      await departmentsService.createDepartment(formData);
      message.success('Bo\'lim yaratildi');
      navigate('/departments');
    } catch (error) {
      message.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Yangi bo'lim"
      extra={
        <Button onClick={() => navigate('/departments')}>
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
          label="Bo'lim nomi"
          rules={[{ required: true, message: 'Bo\'lim nomini kiriting!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="workplace"
          label="Ish joyi"
          rules={[{ required: true, message: 'Ish joyini tanlang!' }]}
        >
          <Select>
            {workplaces.map((workplace: { id: number; name: string }) => (
              <Select.Option key={workplace.id} value={workplace.id}>
                {workplace.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Tavsif"
        >
          <Input.TextArea rows={4} />
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

export default CreateDepartment; 