import { useState } from 'react';
import { Card, Form, Input,  Button, message, Space } from 'antd';
import { reportsService } from '../services/reports.service';
import { useNavigate } from 'react-router-dom';
import type { UploadFile } from 'antd/es/upload/interface';

const CreateReport = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      Object.keys(values).forEach(key => {
        if (values[key] !== undefined && key !== 'files') {
          if (key === 'date') {
            formData.append(key, values[key].format('YYYY-MM-DD'));
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      for (const file of fileList) {
        if (file.originFileObj) {
          formData.append('file', file.originFileObj);
        }
      }

      await reportsService.createReport(formData);
      message.success('Hisobot yaratildi');
      navigate('/reports');
    } catch (error) {
      message.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title="Yangi hisobot yaratish"
      extra={
        <Button onClick={() => navigate('/reports')}>
          Orqaga
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* Form fields */}
        <Space style={{ width: '100%' }} wrap>
          {[
            'terrorism', 'atheism', 'illegal_weapon', 'human_trafficking',
            'narcotic', 'subculture', 'violence', 'pornography',
            'mining', 'crypto', 'imei', 'pentesting',
            'gateway', 'virus', 'gambling', 'fake_trading',
            'darknet'
          ].map(field => (
            <Form.Item
              key={field}
              name={field}
              label={field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
              initialValue={0}
              style={{ width: '45%', marginRight: 8 }}
            >
              <Input type="number" min={0} />
            </Form.Item>
          ))}
        </Space>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Saqlash
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateReport; 