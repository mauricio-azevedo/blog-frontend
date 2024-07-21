import React from 'react';
import { Button, Card, Form, Input } from 'antd';
import { signUp } from '../../api/api';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const SignUp: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();

  const [isLoading, setIsLoading] = React.useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/posts" state={{ from: location }} replace />;
  }

  const onFinish = async (values: any) => {
    setIsLoading(true);

    try {
      const response = await signUp(values);
      login(response.data.data);
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
