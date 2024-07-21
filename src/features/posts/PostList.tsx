import React, { useCallback, useEffect, useState } from 'react';
import { Button, Collapse, Flex, Form, Input, List, Modal, Typography } from 'antd';
import { createPost, fetchPosts } from '../../api/api';
import { Post } from './posts.types';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '../../api/api.types';
import { useAuth } from '../auth/AuthContext';
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;
const { Panel } = Collapse;

const PostList: React.FC = () => {
  const { authenticatedUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [form] = Form.useForm();

  const loadPosts = useCallback(async () => {
    try {
      setIsFetching(true);
      const response: AxiosResponse<ApiResponse<Post[]>> = await fetchPosts();
      setPosts(response.data.data ?? []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCreate = async (values: any) => {
    try {
      setIsCreating(true);
      const response: AxiosResponse<ApiResponse<Post>> = await createPost(values);
      setPosts([response.data.data, ...posts]);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Button type="primary" onClick={showModal} disabled={isFetching}>
          Create Post
        </Button>
        <Button
          type="link"
          onClick={loadPosts}
          loading={isFetching}
          disabled={isFetching}
          icon={<ReloadOutlined />}
        ></Button>
      </div>
      <List
        loading={isFetching}
        itemLayout="horizontal"
        dataSource={posts}
        renderItem={(post) => (
          <List.Item
            style={{ alignItems: 'flex-start' }}
            actions={
              post.user.id === authenticatedUser?.id
                ? [
                    <Button type="text" key="edit" icon={<EditOutlined />}></Button>,
                    <Button type="text" key="delete" icon={<DeleteOutlined />}></Button>,
                  ]
                : []
            }
          >
            <Flex vertical style={{ width: '100%' }}>
              <Flex gap={'.5rem'}>
                <Text strong>{post.title}</Text>
                <Link type="secondary">{post.user.name}</Link>
              </Flex>
              <Text>{post.body}</Text>
              {post.comments.length > 0 && (
                <Collapse ghost>
                  <Panel header={`Show ${post.comments.length} comments`} key="1">
                    <List
                      dataSource={post.comments}
                      renderItem={(comment) => (
                        <List.Item style={{ background: 'whitesmoke', padding: '1rem', borderRadius: '.5rem' }}>
                          <Flex vertical>
                            <Link type="secondary">{comment.user.name}</Link>
                            <Text>{comment.body}</Text>
                          </Flex>
                          <Flex>
                            <Button type="text" icon={<EditOutlined />}></Button>
                            <Button type="text" icon={<DeleteOutlined />}></Button>
                          </Flex>
                        </List.Item>
                      )}
                    />
                  </Panel>
                </Collapse>
              )}
            </Flex>
          </List.Item>
        )}
      />
      <Modal title="Create Post" open={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the title' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="body" label="Body" rules={[{ required: true, message: 'Please enter the body' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isCreating}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PostList;
