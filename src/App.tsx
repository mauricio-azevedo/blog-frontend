import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import SignIn from './components/Users/SignIn';
import SignUp from './components/Users/SignUp';
import PostList from './components/Posts/PostList';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { signOut } from './services/api';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC<{
  children: React.ReactNode;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  colorBgContainer: string;
  borderRadiusLG: number;
}> = ({ children, collapsed, setCollapsed, colorBgContainer, borderRadiusLG }) => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const onLogout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      logout();
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'Posts',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'Users',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'Comments',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Button
            aria-label="logout"
            type="text"
            icon={<LogoutOutlined />}
            onClick={onLogout}
            loading={isLoading}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <AuthProvider>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <MainLayout
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                colorBgContainer={colorBgContainer}
                borderRadiusLG={borderRadiusLG}
              >
                <Routes>
                  <Route path="/posts" element={<PostList />} />
                  <Route path="*" element={<Navigate to="/posts" />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
