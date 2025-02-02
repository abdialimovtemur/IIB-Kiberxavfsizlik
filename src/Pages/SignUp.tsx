import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

const SignUp = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      if (values.password !== values.confirm_password) {
        message.error('Parollar mos kelmadi');
        return;
      }

      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key !== 'confirm_password') {
          formData.append(key, values[key]);
        }
      });

      await authService.register(formData);
      message.success('Muvaffaqiyatli ro\'yxatdan o\'tdingiz');
      navigate('/login');
    } catch (error: any) {
      message.error(error.response?.data?.detail || 'Ro\'yxatdan o\'tishda xatolik');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400, padding: 24 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Ro'yxatdan o'tish</h2>
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
            name="password"
            label="Parol"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label="Parolni tasdiqlang"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Ro'yxatdan o'tish
            </Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button type="link" onClick={() => navigate('/login')}>
              Kirish
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
