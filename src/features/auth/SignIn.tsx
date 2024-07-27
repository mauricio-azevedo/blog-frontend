import React from 'react';
import { Button, Card, Form, Input } from 'antd';
import { signIn } from '../../api/api';
import { useAuth } from './AuthContext';
import { Link, Navigate, useLocation } from 'react-router-dom';

const SignIn: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();

  const [isLoading, setIsLoading] = React.useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/posts" state={{ from: location }} replace />;
  }

  const onFinish = async (values: any) => {
    setIsLoading(true);

    try {
      const response = await signIn(values);
      const { user, access_token } = response.data.data;
      login(user, access_token);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
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
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%', marginBottom: '.5rem' }}
              loading={isLoading}
            >
              Sign In
            </Button>
            Not registered yet? <Link to="/sign-up">Sign up</Link>!
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
