import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../services/api';

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      await signIn({ user: { ...values } });
      navigate('/posts');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="Sign In" style={{ width: 300 }}>
        <Form name="sign_in" layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
