import apiClient  from './apiClient';

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData) {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginData) {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};
