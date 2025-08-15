import axios from 'axios';
import { AUTH_SERVICE_URL, BLOG_SERVICE_URL } from '../config';

const API_BASE_URL = 'http://localhost:4001';

const api = axios.create({
  baseURL: AUTH_SERVICE_URL,
});

// Request interceptor to add token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {    
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  register: async (firstName: string, email: string, password: string) => {
    const response = await api.post('/register', { firstName, email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  updateProfile: async (userData: any) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  }
};

export const postService = {
  getAllPosts: async (params?: any) => {
    const response = await api.get(`${BLOG_SERVICE_URL}/posts`, { params });
    return response.data;
  },

  getPost: async (id: number) => {
    const response = await api.get(`${BLOG_SERVICE_URL}/posts/${id}`);
    return response.data;
  },

  createPost: async (postData: any) => {
    const response = await api.post(`${BLOG_SERVICE_URL}/posts`, postData);
    return response.data;
  },

  updatePost: async (id: number, postData: any) => {
    const response = await api.put(`${BLOG_SERVICE_URL}/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id: number) => {
    const response = await api.delete(`${BLOG_SERVICE_URL}/posts/${id}`);
    return response.data;
  },

  getUserPosts: async (userId: number) => {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
  }
};

export const commentService = {
  getPostComments: async (postId: number) => {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
  },

  createComment: async (commentData: any) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  updateComment: async (id: number, content: string) => {
    const response = await api.put(`/comments/${id}`, { content });
    return response.data;
  },

  deleteComment: async (id: number) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  }
};

export const reactionService = {
  getPostReactions: async (postId: number) => {
    const response = await api.get(`/reactions/post/${postId}`);
    return response.data;
  },

  getUserReaction: async (postId: number) => {
    const response = await api.get(`/reactions/post/${postId}/user`);
    return response.data;
  },

  addReaction: async (postId: number, type: string) => {
    const response = await api.post('/reactions', { postId, type });
    return response.data;
  },

  removeReaction: async (postId: number) => {
    const response = await api.delete(`/reactions/post/${postId}`);
    return response.data;
  }
};

export const userService = {
  getUserProfile: async (userId: number) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  }
};