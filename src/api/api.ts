import axios, { AxiosResponse, HttpStatusCode } from 'axios';
import { message as antdMessage } from 'antd';
import { ApiResponse } from './api.types';
import { Post } from '../features/posts/posts.types';
import { User } from '../features/users/users.types';
import authEventEmitter from '../features/auth/AuthEventEmitter';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (r: AxiosResponse<ApiResponse<unknown>>) => {
    handleMessages(r.data?.message, r.data?.ok);
    return r;
  },
  (e) => {
    handleMessages(e.response?.data?.message, e.response?.data?.ok);
    handleUnauthorized(e.response?.status);
    return Promise.reject(e);
  }
);

const handleMessages = (message: string | undefined, ok: boolean | undefined): void => {
  if (message) {
    ok ? antdMessage.success(message) : antdMessage.error(message);
  } else {
    antdMessage.error('An unexpected error occurred');
  }
};

const handleUnauthorized = (status: HttpStatusCode | undefined): void => {
  if (status === 401) {
    authEventEmitter.emit('logout');
  }
};

// Users
export const signUp = (user: { email: string; password: string }) =>
  api.post<ApiResponse<{ user: User; token: string }>>('/users', { user });
export const signIn = (user: { email: string; password: string }) =>
  api.post<ApiResponse<{ user: User; token: string }>>('/users/sign_in', { user });

// Posts
export const createPost = (post: { title: string; body: string }) => api.post<ApiResponse<Post>>('/posts', { post });
export const fetchPosts = () => api.get<ApiResponse<Post[]>>('/posts');
export const fetchPost = (id: string) => api.get(`/posts/${id}`);
export const updatePost = (id: string, post: { title: string; body: string }) => api.put(`/posts/${id}`, { post });
export const deletePost = (id: string) => api.delete(`/posts/${id}`);

// Comments
export const createComment = (postId: number, comment: { body: string }) =>
  api.post(`/posts/${postId}/comments`, { comment });
export const fetchComments = (postId: string) => api.get(`/posts/${postId}/comments`);
export const fetchComment = (postId: string, commentId: string) => api.get(`/posts/${postId}/comments/${commentId}`);
export const updateComment = (postId: string, commentId: string, comment: { body: string }) =>
  api.put(`/posts/${postId}/comments/${commentId}`, { comment });
export const deleteComment = (postId: string, commentId: string) =>
  api.delete(`/posts/${postId}/comments/${commentId}`);
