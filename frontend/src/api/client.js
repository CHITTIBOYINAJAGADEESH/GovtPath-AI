import axios from 'axios';

export const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to inject JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('govtpath_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('govtpath_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          const newAccess = res.data.access;
          localStorage.setItem('govtpath_access_token', newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return apiClient(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('govtpath_access_token');
          localStorage.removeItem('govtpath_refresh_token');
          localStorage.removeItem('govtpath_user');
          localStorage.removeItem('govtpath_admin_auth');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// API Domain Helper Methods
export const authApi = {
  login: async (email, password) => {
    const res = await apiClient.post('/auth/token/', { email, password });
    const { access, refresh, user } = res.data;
    localStorage.setItem('govtpath_access_token', access);
    localStorage.setItem('govtpath_refresh_token', refresh);
    localStorage.setItem('govtpath_user', JSON.stringify(user));
    if (user.is_admin) {
      localStorage.setItem('govtpath_admin_auth', JSON.stringify(user));
    }
    return res.data;
  },
  register: async (userData) => {
    return (await apiClient.post('/auth/register/', userData)).data;
  },
  getProfile: async () => {
    return (await apiClient.get('/auth/me/')).data;
  },
  logout: () => {
    localStorage.removeItem('govtpath_access_token');
    localStorage.removeItem('govtpath_refresh_token');
    localStorage.removeItem('govtpath_user');
    localStorage.removeItem('govtpath_admin_auth');
  },
  getUsers: async (params) => {
    return (await apiClient.get('/auth/users/', { params })).data;
  },
};

export const examsApi = {
  getAll: async (params) => {
    const res = await apiClient.get('/exams/', { params });
    return res.data?.results || res.data;
  },
  getBySlug: async (slug) => {
    return (await apiClient.get(`/exams/${slug}/`)).data;
  },
  create: async (data) => {
    return (await apiClient.post('/exams/', data)).data;
  },
  update: async (slug, data) => {
    return (await apiClient.patch(`/exams/${slug}/`, data)).data;
  },
  delete: async (slug) => {
    return (await apiClient.delete(`/exams/${slug}/`)).data;
  },
  getCategories: async () => {
    const res = await apiClient.get('/exams/categories/');
    return res.data?.results || res.data;
  },
  getCustomRequests: async () => {
    const res = await apiClient.get('/exams/requests/custom/');
    return res.data?.results || res.data;
  },
  submitCustomRequest: async (data) => {
    return (await apiClient.post('/exams/requests/custom/', data)).data;
  },
  approveCustomRequest: async (id, data) => {
    return (await apiClient.post(`/exams/requests/custom/${id}/approve/`, data)).data;
  },
};

export const syllabusApi = {
  getByExam: async (examSlug) => {
    return (await apiClient.get(`/syllabus/exam/${examSlug}/`)).data;
  },
  createSubject: async (data) => {
    return (await apiClient.post('/syllabus/subjects/', data)).data;
  },
  createTopic: async (data) => {
    return (await apiClient.post('/syllabus/topics/', data)).data;
  },
};

export const questionsApi = {
  getAll: async (params) => {
    const res = await apiClient.get('/questions/', { params });
    return res.data?.results || res.data;
  },
  create: async (data) => {
    return (await apiClient.post('/questions/', data)).data;
  },
  bulkImport: async (questionsList) => {
    return (await apiClient.post('/questions/bulk-import/', { questions: questionsList })).data;
  },
  delete: async (id) => {
    return (await apiClient.delete(`/questions/${id}/`)).data;
  },
};

export const mockTestsApi = {
  getAll: async (params) => {
    const res = await apiClient.get('/mock-tests/', { params });
    return res.data?.results || res.data;
  },
  getById: async (id) => {
    return (await apiClient.get(`/mock-tests/${id}/`)).data;
  },
  create: async (data) => {
    return (await apiClient.post('/mock-tests/', data)).data;
  },
  submitAttempt: async (testId, data) => {
    return (await apiClient.post(`/mock-tests/${testId}/submit/`, data)).data;
  },
  getAttempts: async () => {
    const res = await apiClient.get('/mock-tests/attempts/');
    return res.data?.results || res.data;
  },
};

export const jobsApi = {
  getAll: async (params) => {
    const res = await apiClient.get('/jobs/', { params });
    return res.data?.results || res.data;
  },
  getById: async (jobId) => {
    return (await apiClient.get(`/jobs/${jobId}/`)).data;
  },
  create: async (data) => {
    return (await apiClient.post('/jobs/', data)).data;
  },
};

export const statsApi = {
  getDashboardKPIs: async () => {
    return (await apiClient.get('/dashboard/stats/')).data;
  },
};
