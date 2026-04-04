import axios from 'axios';

// ✅ use environment variable
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL + '/api'
});

// ✅ token attach
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('myweb_token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ================= AUTH =================
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  getColleges: () => API.get('/colleges')
};

// ================= USER =================
export const userAPI = {
  getProfile: (username) => API.get(`/users/${username}`),
  updateProfile: (data) => API.put('/users/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  searchUsers: (q) => API.get(`/search/users?q=${q}`)
};

// ================= PROJECT =================
export const projectAPI = {
  getByUser: (username) => API.get(`/projects/user/${username}`),
  create: (data) => API.post('/projects', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => API.put(`/projects/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/projects/${id}`),
  like: (id) => API.post(`/projects/${id}/like`)
};

// ================= CERTIFICATE =================
export const certificateAPI = {
  getByUser: (username) => API.get(`/certificates/user/${username}`),
  create: (data) => API.post('/certificates', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => API.put(`/certificates/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/certificates/${id}`)
};

export default API;