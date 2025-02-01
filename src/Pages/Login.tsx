import { Button, Card, Form, Input, Layout, Typography } from "antd";
const { Title } = Typography;
const LoginPage = () => {
    const onFinish = (values: any) => {
      console.log('Success:', values);
    };
  
    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5' }}>
        <Card style={{ width: 400, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: 8 }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>Login</Title>
          <Form name="login" onFinish={onFinish} layout="vertical">
            <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}> 
              <Input placeholder="Username" size="large" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}> 
              <Input.Password placeholder="Password" size="large" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }} size="large">Login</Button>
            </Form.Item>
          </Form>
        </Card>
      </Layout>
    );
  };
  
    export default LoginPage;