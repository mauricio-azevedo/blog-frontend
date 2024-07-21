import React, { useEffect, useState } from 'react';
import { List, Button, Typography, Flex } from 'antd';
import { fetchPosts } from '../../api/api';
import { Post } from './posts.types';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '../../api/api.types';

const { Text, Link } = Typography;

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      const response: AxiosResponse<ApiResponse<Post[]>> = await fetchPosts();
      setPosts(response.data.data ?? []);
    };
    loadPosts();
  }, []);

  return (
    <List
      itemLayout="horizontal"
      dataSource={posts}
      renderItem={(post) => (
        <List.Item actions={[<Button>Edit</Button>, <Button>Delete</Button>]}>
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
  );
};

export default PostList;
