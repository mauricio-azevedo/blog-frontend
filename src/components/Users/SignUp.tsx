import React from 'react';
import { Button, Card, Form, Input } from 'antd';
import { signUp } from '../../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SignUp: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    setIsLoading(true);

    try {
      await signUp({ user: { ...values } });
      login();
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="Sign Up" style={{ width: 300 }}>
        <Form name="sign_up" layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name' }]}>
            <Input />
          </Form.Item>
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
          <Form.Item
            label="Confirm password"
            name="password_confirmation"
            rules={[{ required: true, message: 'Please confirm your password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              style={{ width: '100%', marginBottom: '.5rem' }}
            >
              Sign Up
            </Button>
            Already registered? <Link to="/sign-in">Sign in</Link>!
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
