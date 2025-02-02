import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Select } from 'antd';
import { departmentsService } from '../services/departments.service';
import { workplacesService } from '../services/workplaces.service';
import { useNavigate, useParams } from 'react-router-dom';
import { Department } from '../types/api.types';

const EditDepartment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Department | null>(null);
  const [workplaces, setWorkplaces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [departmentData, workplacesData] = await Promise.all([
          departmentsService.getDepartmentById(Number(id)),
          workplacesService.getWorkplaces()
        ]);

        setInitialData(departmentData);
        setWorkplaces(workplacesData);
        
        form.setFieldsValue({
          name: departmentData.name,
          workplace: departmentData.workplace,
          description: departmentData.description
        });
      } catch (error) {
        message.error('Ma\'lumotlarni yuklashda xatolik');
        navigate('/departments');
      }
    };

    fetchData();
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

      await departmentsService.updateDepartment(Number(id), formData);
      message.success('Bo\'lim yangilandi');
      navigate('/departments');
    } catch (error) {
      message.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Bo'limni tahrirlash"
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
        initialValues={initialData || {}}
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
            {workplaces.map(workplace => (
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

export default EditDepartment; 