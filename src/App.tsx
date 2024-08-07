import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { FireOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MessageOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, Modal, theme } from 'antd';
import SignIn from './features/auth/SignIn';
import SignUp from './features/auth/SignUp';
import PostList from './features/posts/PostList';
import ProtectedRoute from './features/auth/ProtectedRoute';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { signOut } from './api/api';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC<{
  children: React.ReactNode;
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  colorBgContainer: string;
  borderRadiusLG: number;
}> = ({ children, collapsed, setCollapsed, colorBgContainer, borderRadiusLG }) => {
  const { onServerSignOut } = useAuth();

  const showLogoutConfirm = () => {
    Modal.confirm({
      title: `Are you sure you want to logout?`,
      okText: 'Logout',
      cancelText: 'Go back',
      icon: <LogoutOutlined />,
      async onOk() {
        await onSignOutClick();
      },
    });
  };

  const onSignOutClick = async () => {
    try {
      await signOut();
      onServerSignOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <MessageOutlined />,
              label: 'Posts',
            },
            {
              key: '2',
              icon: <FireOutlined />,
              label: 'More to come',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
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
            onClick={showLogoutConfirm}
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
  const [collapsed, setCollapsed] = useState(true);
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
