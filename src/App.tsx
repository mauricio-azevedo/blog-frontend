import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import SignIn from './components/Users/SignIn';
import PostList from './components/Posts/PostList';
import SignUp from './components/Users/SignUp';
import { isAuthenticated } from './services/auth';

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Router>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Layout>
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
                  <Header style={{ padding: 0, background: colorBgContainer }}>
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
                    <Routes>
                      <Route path="/posts" element={<PostList />} />
                      <Route path="*" element={<Navigate to="/posts" />} />
                    </Routes>
                  </Content>
                </Layout>
              </Layout>
            ) : (
              <Navigate to="/sign-in" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
