import React from 'react';
import { Button, Card, Form, Input } from 'antd';
import { signIn } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const SignIn: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    setIsLoading(true);

    try {
      await signIn({ user: { ...values } });
      login();
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
