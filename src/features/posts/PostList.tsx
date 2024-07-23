import React, { useCallback, useEffect, useState } from 'react';
import { Button, Collapse, Dropdown, Empty, Flex, Form, Input, List, Modal, Typography } from 'antd';
import {
  createComment,
  createPost,
  deleteComment,
  deletePost,
  fetchPosts,
  updateComment,
  updatePost,
} from '../../api/api';
import { Post, PostsPaginated } from './posts.types';
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
import { timeAgo } from '../../shared/utils/date.utils';

const { Text, Link } = Typography;
const { Panel } = Collapse;

const PostList: React.FC = () => {
  const { authenticatedUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isEditCommentModalVisible, setIsEditCommentModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [newComment, setNewComment] = useState<string>('');
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [editComment, setEditComment] = useState<Comment | null>(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [editCommentForm] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setHasMore(posts.length < totalCount);
  }, [posts.length, totalCount]);

  const loadPosts = async (page: number) => {
    try {
      setIsFetching(true);
      const response: AxiosResponse<ApiResponse<PostsPaginated>> = await fetchPosts(page);
      const { pagination, posts: fetchedPosts } = response.data.data;
      setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
      setTotalCount(pagination.total_count);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const loadPostsCallback = useCallback(loadPosts, []);
  useEffect(() => {
    loadPostsCallback(currentPage);
  }, [currentPage, loadPostsCallback]);

  const onPostsReload = async () => {
    setIsReloading(true);
    const newCurrentPage: number = 1;
    setPosts([]);
    setCurrentPage(newCurrentPage);
    await loadPosts(newCurrentPage);
    setIsReloading(false);
  };

  const onPostsLoadMore = async () => {
    setIsLoadingMore(true);
    const newCurrentPage: number = currentPage + 1;
    setCurrentPage(newCurrentPage);
    await loadPosts(newCurrentPage);
    setIsLoadingMore(false);
  };

  const showCreatePostModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreatePostCancel = () => {
    setIsCreateModalVisible(false);
    form.resetFields();
  };

  const handleCreatePostSubmit = async (values: any) => {
    try {
      setIsCreating(true);
      const response: AxiosResponse<ApiResponse<Post>> = await createPost(values);
      setPosts([response.data.data, ...posts]);
      setIsCreateModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const showEditPostModal = (post: Post) => {
    setEditPost(post);
    editForm.setFieldsValue({ title: post.title, body: post.body });
    setIsEditModalVisible(true);
  };

  const handleEditPostCancel = () => {
    setIsEditModalVisible(false);
    setEditPost(null);
    editForm.resetFields();
  };

  const handleEditPostSubmit = async (values: any) => {
    if (!editPost) return;
    try {
      setIsCreating(true);
      const response: AxiosResponse<ApiResponse<Post>> = await updatePost(editPost.id.toString(), values);
      const updatedPosts = posts.map((post) => (post.id === editPost.id ? response.data.data : post));
      setPosts(updatedPosts);
      setIsEditModalVisible(false);
      setEditPost(null);
      editForm.resetFields();
    } catch (error) {
      console.error('Failed to update post:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const showEditCommentModal = (comment: Comment) => {
    setEditComment(comment);
    editCommentForm.setFieldsValue({ body: comment.body });
    setIsEditCommentModalVisible(true);
  };

  const handleEditCommentCancel = () => {
    setIsEditCommentModalVisible(false);
    setEditComment(null);
    editCommentForm.resetFields();
  };

  const handleEditCommentSubmit = async (values: any) => {
    if (!editComment) return;
    try {
      setIsCreating(true);
      const response: AxiosResponse<ApiResponse<Comment>> = await updateComment(
        editComment.post_id.toString(),
        editComment.id.toString(),
        values
      );
      const updatedPosts = posts.map((post) =>
        post.id === editComment.post_id
          ? {
              ...post,
              comments: post.comments.map((comment) => (comment.id === editComment.id ? response.data.data : comment)),
            }
          : post
      );
      setPosts(updatedPosts);
      setIsEditCommentModalVisible(false);
      setEditComment(null);
      editCommentForm.resetFields();
    } catch (error) {
      console.error('Failed to update comment:', error);
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

  const handleEditPostClick = (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      showEditPostModal(post);
    }
  };

  const handleDeletePostClick = async (postId: number) => {
    try {
      await deletePost(postId.toString());
      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleEditCommentClick = (commentId: number) => {
    const comment = posts.flatMap((post) => post.comments).find((c) => c.id === commentId);
    if (comment) {
      showEditCommentModal(comment);
    }
  };

  const handleDeleteCommentClick = async (postId: number, commentId: number) => {
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
        onClick: () => handleEditPostClick(postId),
      },
      {
        key: 'delete',
        icon: <DeleteOutlined />,
        label: 'Delete',
        onClick: () => showDeleteConfirm(() => handleDeletePostClick(postId), 'post'),
        danger: true,
      },
    ],
  });

  const moreMenuComment = (postId: number, commentId: number, commentUserId: number, postUserId: number) => {
    const items = [
      ...(authenticatedUser?.id === commentUserId
        ? [
            {
              key: 'edit',
              icon: <EditOutlined />,
              label: 'Edit',
              onClick: () => handleEditCommentClick(commentId),
            },
          ]
        : []),
      ...(authenticatedUser?.id === commentUserId || authenticatedUser?.id === postUserId
        ? [
            {
              key: 'delete',
              icon: <DeleteOutlined />,
              label: 'Delete',
              onClick: () => showDeleteConfirm(() => handleDeleteCommentClick(postId, commentId), 'comment'),
              danger: true,
            },
          ]
        : []),
    ];

    return { items };
  };

  return (
    <Flex vertical style={{ overflow: 'auto' }}>
      <Flex vertical style={{ minWidth: 220 }}>
        <Flex justify="space-between" gap=".25rem" style={{ marginBottom: '16px' }}>
          <Button type="primary" onClick={showCreatePostModal} disabled={isFetching || isCommenting}>
            Create Post
          </Button>
          <Button
            type="link"
            onClick={onPostsReload}
            loading={isReloading}
            disabled={isFetching || isCommenting}
            icon={<ReloadOutlined />}
          ></Button>
        </Flex>
        <List
          loading={isFetching && currentPage === 1}
          itemLayout="horizontal"
          dataSource={posts}
          renderItem={(post) => (
            <List.Item style={{ alignItems: 'flex-start', overflow: 'hidden' }}>
              <Flex vertical style={{ width: '100%' }}>
                <Flex vertical style={{ overflow: 'hidden', width: '100%' }}>
                  <Flex gap=".5rem" justify="space-between" align="center" flex="1">
                    <Flex gap=".5rem" style={{ maxWidth: 190 }}>
                      <Text strong style={{ whiteSpace: 'nowrap' }}>
                        {post.title}
                      </Text>
                      <Link type="secondary" ellipsis>
                        {post.user.name}
                      </Link>
                    </Flex>
                    {post.user.id === authenticatedUser?.id && (
                      <Dropdown menu={moreMenuPost(post.id)} trigger={['click']}>
                        <Button type="text" icon={<MoreOutlined />} />
                      </Dropdown>
                    )}
                  </Flex>
                  <Text>{post.body}</Text>
                  <Flex justify="space-between" align="center" gap=".25rem">
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
                    <Link type="secondary" style={{ whiteSpace: 'nowrap' }}>
                      {timeAgo(post.created_at)}
                    </Link>
                  </Flex>
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
                              {(authenticatedUser?.id === comment.user.id ||
                                authenticatedUser?.id === post.user.id) && (
                                <Dropdown
                                  menu={moreMenuComment(post.id, comment.id, comment.user.id, post.user.id)}
                                  trigger={['click']}
                                >
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
        {hasMore && (
          <Button
            type="primary"
            onClick={onPostsLoadMore}
            loading={isLoadingMore}
            disabled={isFetching}
            style={{ marginTop: '16px' }}
          >
            Load More
          </Button>
        )}
        <Modal title="Create Post" open={isCreateModalVisible} onCancel={handleCreatePostCancel} footer={null}>
          <Form form={form} layout="vertical" onFinish={handleCreatePostSubmit}>
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
        <Modal title="Edit Post" open={isEditModalVisible} onCancel={handleEditPostCancel} footer={null}>
          <Form form={editForm} layout="vertical" onFinish={handleEditPostSubmit}>
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
        <Modal title="Edit Comment" open={isEditCommentModalVisible} onCancel={handleEditCommentCancel} footer={null}>
          <Form form={editCommentForm} layout="vertical" onFinish={handleEditCommentSubmit}>
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
      </Flex>
    </Flex>
  );
};

export default PostList;
