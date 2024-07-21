import axios from 'axios';
import { message as antdMessage } from 'antd';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data.message) {
      antdMessage.success(data.message);
    }
    return data.data; // Return only the data part of the response
  },
  (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      antdMessage.error(error.response.data.message);
    } else {
      antdMessage.error('An unexpected error occurred');
    }
    return Promise.reject(error);
  }
);

// Users
export const signUp = (credentials: { user: { email: string; password: string } }) => api.post('/users', credentials);
export const signIn = (credentials: { user: { email: string; password: string } }) =>
  api.post('/users/sign_in', credentials);

// Posts
export const createPost = (post: { title: string; content: string }) => api.post('/posts', post);
export const fetchPosts = () => api.get('/posts');
export const fetchPost = (id: string) => api.get(`/posts/${id}`);
export const updatePost = (id: string, post: { title: string; content: string }) => api.put(`/posts/${id}`, post);
export const deletePost = (id: string) => api.delete(`/posts/${id}`);

// Comments
export const createComment = (postId: string, comment: { content: string }) =>
  api.post(`/posts/${postId}/comments`, comment);
export const fetchComments = (postId: string) => api.get(`/posts/${postId}/comments`);
export const fetchComment = (postId: string, commentId: string) => api.get(`/posts/${postId}/comments/${commentId}`);
export const updateComment = (postId: string, commentId: string, comment: { content: string }) =>
  api.put(`/posts/${postId}/comments/${commentId}`, comment);
export const deleteComment = (postId: string, commentId: string) =>
  api.delete(`/posts/${postId}/comments/${commentId}`);
