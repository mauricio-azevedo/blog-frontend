import React, { useCallback, useEffect, useState } from 'react';
import { Button, Collapse, Dropdown, Empty, Flex, Form, Input, List, Modal, Typography } from 'antd';
import { createComment, createPost, fetchPosts, deleteComment, deletePost } from '../../api/api';
import { Post } from './posts.types';
import { Comment } from '../comments/comments.types';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '../../api/api.types';
import { useAuth } from '../auth/AuthContext';
import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  ReloadOutlined,
  SendOutlined,
} from '@ant-design/icons';

const { Text, Link } = Typography;
const { Panel } = Collapse;

const PostList: React.FC = () => {
  const { authenticatedUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState<string>('');
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

  const toggleComments = (postId: number) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
    setNewComment(''); // Reset new comment input when toggling
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = async (postId: number) => {
    if (!newComment.trim()) return;

    try {
      setIsCommenting(true);
      const response: AxiosResponse<ApiResponse<Comment>> = await createComment(postId, { body: newComment });
      const updatedPosts = posts.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, response.data.data] } : post
      );
      setPosts(updatedPosts);
      setNewComment('');
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const showDeleteConfirm = (deleteFn: () => void, item: 'post' | 'comment') => {
    Modal.confirm({
      title: `Are you sure you want to delete this ${item}?`,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteFn();
      },
    });
  };

  const handleEditPost = (postId: number) => {
    // Add your edit post logic here
    console.log(`Edit post ${postId}`);
  };

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePost(postId.toString());
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleEditComment = (commentId: number) => {
    // Add your edit comment logic here
    console.log(`Edit comment ${commentId}`);
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    try {
      await deleteComment(postId.toString(), commentId.toString());
      const updatedPosts = posts.map((post) =>
        post.id === postId ? { ...post, comments: post.comments.filter((comment) => comment.id !== commentId) } : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const moreMenuPost = (postId: number) => ({
    items: [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => handleEditPost(postId),
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => showDeleteConfirm(() => handleDeletePost(postId), 'post'),
        danger: true,
      },
    ],
  });

  const moreMenuComment = (postId: number, commentId: number) => ({
    items: [
      {
        key: 'edit',
        icon: <EditOutlined />,
        label: 'Edit',
        onClick: () => handleEditComment(commentId),
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => showDeleteConfirm(() => handleDeleteComment(postId, commentId), 'comment'),
        danger: true,
      },
    ],
  });

  return (
    <>
      <Flex justify="space-between" style={{ marginBottom: '16px' }}>
        <Button type="primary" onClick={showModal} disabled={isFetching || isCommenting}>
          Create Post
        </Button>
        <Button
          type="link"
          onClick={loadPosts}
          loading={isFetching}
          disabled={isFetching || isCommenting}
          icon={<ReloadOutlined />}
        ></Button>
      </Flex>
      <List
        loading={isFetching}
        itemLayout="horizontal"
        dataSource={posts}
        renderItem={(post) => (
          <List.Item style={{ alignItems: 'flex-start' }}>
            <Flex vertical style={{ width: '100%' }}>
              <Flex justify="space-between">
                <Flex vertical>
                  <Flex gap={'.5rem'}>
                    <Text strong>{post.title}</Text>
                    <Link type="secondary">{post.user.name}</Link>
                  </Flex>
                  <Text>{post.body}</Text>
                  <Button
                    className="grey-link-button"
                    type="link"
                    icon={<CommentOutlined />}
                    style={{ alignSelf: 'flex-start', padding: 0 }}
                    onClick={() => toggleComments(post.id)}
                  >
                    {post.comments.length === 0 && 'No comments yet'}
                    {post.comments.length === 1 && '1 comment'}
                    {post.comments.length > 1 && `${post.comments.length} comments`}
                  </Button>
                </Flex>
                <Dropdown menu={moreMenuPost(post.id)} trigger={['click']}>
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              </Flex>
              <Collapse activeKey={expandedPostId === post.id ? '1' : undefined} ghost>
                <Panel header="" key="1" showArrow={false}>
                  <Flex align="center" gap=".25rem" style={{ marginBottom: '1.5rem' }}>
                    <Input.TextArea
                      showCount
                      autoSize
                      placeholder="Leave a comment..."
                      rows={1}
                      maxLength={300}
                      value={newComment}
                      onChange={handleCommentChange}
                    />
                    <Button
                      type="primary"
                      onClick={() => handleCommentSubmit(post.id)}
                      disabled={!newComment.trim()}
                      loading={isCommenting}
                      icon={<SendOutlined />}
                    ></Button>
                  </Flex>
                  {post.comments.length === 0 ? (
                    <Empty description={<Text type="secondary">Be the first to comment!</Text>}></Empty>
                  ) : (
                    <List
                      dataSource={post.comments}
                      renderItem={(comment) => (
                        <List.Item
                          style={{
                            border: 'none',
                            marginTop: '.5rem',
                            background: 'whitesmoke',
                            padding: '1rem',
                            borderRadius: '.5rem',
                          }}
                        >
                          <Flex justify="space-between" style={{ width: '100%' }}>
                            <Flex vertical>
                              <Link type="secondary">{comment.user.name}</Link>
                              <Text>{comment.body}</Text>
                            </Flex>
                            {comment.user.id === authenticatedUser?.id && (
                              <Dropdown menu={moreMenuComment(post.id, comment.id)} trigger={['click']}>
                                <Button type="text" icon={<MoreOutlined />} />
                              </Dropdown>
                            )}
                          </Flex>
                        </List.Item>
                      )}
                    />
                  )}
                </Panel>
              </Collapse>
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
