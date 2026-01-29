import { simpleAPI } from './simpleApi';

export interface User {
  id: string;
  name: string;
  email: string;
  startupName: string;
  isVerified: boolean;
}

export class SimpleAuthService {
  private static instance: SimpleAuthService;

  static getInstance(): SimpleAuthService {
    if (!SimpleAuthService.instance) {
      SimpleAuthService.instance = new SimpleAuthService();
    }
    return SimpleAuthService.instance;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    startupName: string;
  }) {
    try {
      console.log('Starting registration...');
      const response = await simpleAPI.register(userData);
      console.log('Registration response:', response);
      
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { success: true, user: response.user };
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      console.log('Starting login...');
      const response = await simpleAPI.login({ email, password });
      console.log('Login response:', response);
      
      if (response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { success: true, user: response.user };
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const simpleAuth = SimpleAuthService.getInstance();
