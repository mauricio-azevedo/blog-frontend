import React, { useEffect, useState } from 'react';
import { List, Button } from 'antd';
import { fetchPosts } from '../../services/api';

interface Post {
  id: string;
  title: string;
  content: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      const response = await fetchPosts();
      setPosts(response.data);
    };
    loadPosts();
  }, []);

  return (
    <List
      itemLayout="horizontal"
      dataSource={posts}
      renderItem={(post) => (
        <List.Item actions={[<Button>Edit</Button>, <Button>Delete</Button>]}>
          <List.Item.Meta title={post.title} description={post.content} />
        </List.Item>
      )}
    />
  );
};

export default PostList;
