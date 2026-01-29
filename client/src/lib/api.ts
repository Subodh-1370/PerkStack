import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
};

export const dealsAPI = {
  getDeals: (params?: any) => api.get('/deals', { params }),
  getDeal: (id: string) => api.get(`/deals/${id}`),
  seedDeals: () => api.post('/deals/seed'),
};

export const claimsAPI = {
  createClaim: (dealId: string) => api.post('/claims', { dealId }),
  getMyClaims: () => api.get('/claims/my'),
  updateClaimStatus: (id: string, status: string) => api.patch(`/claims/${id}/status`, { status }),
};

export default api;
