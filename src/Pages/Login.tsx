import { Button, Card, Form, Input, Layout, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { LoginRequest } from "../types/api.types";
import { useAuth } from "../hooks/useAuth";

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginRequest) => {
    try {
      const response = await authService.login(values);
      localStorage.setItem('token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      
      // Login bo'lgandan keyin user ma'lumotlarini yangilash
      await checkAuth();
      
      navigate('/dashboard');
    } catch (error) {
      message.error('Login yoki parol xato!');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 8 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>Kirish</Title>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item 
            name="username" 
            rules={[{ required: true, message: 'Foydalanuvchi nomini kiriting!' }]}
          >
            <Input placeholder="Foydalanuvchi nomi" size="large" />
          </Form.Item>
          <Form.Item 
            name="password" 
            rules={[{ required: true, message: 'Parolni kiriting!' }]}
          >
            <Input.Password placeholder="Parol" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }} size="large">
              Kirish
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default LoginPage;