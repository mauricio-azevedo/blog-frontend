import React, { useEffect, useState, useCallback } from 'react';
import { List, Button, Typography, Modal, Form, Input, Flex } from 'antd';
import { fetchPosts, createPost } from '../../api/api';
import { Post } from './posts.types';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '../../api/api.types';
import { useAuth } from '../auth/AuthContext';
import { ReloadOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;

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
      <Flex justify="space-between">
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
      </Flex>
      <List
        loading={isFetching}
        itemLayout="horizontal"
        dataSource={posts}
        renderItem={(post) => (
          <List.Item
            actions={
              post.user.id === authenticatedUser?.id
                ? [<Button key="edit">Edit</Button>, <Button key="delete">Delete</Button>]
                : []
            }
          >
            <Flex vertical>
              <Flex gap={'.5rem'}>
                <Text strong>{post.title}</Text>
                <Link type="secondary">{post.user.name}</Link>
              </Flex>
              <Text>{post.body}</Text>
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
