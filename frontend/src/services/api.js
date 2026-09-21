import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

export const getIncidents = () => api.get('/incidents');
export const getIncident = (id) => api.get(`/incidents/${id}`);
export const getStats = () => api.get('/incidents/stats');
export const createIncident = (data) => api.post('/incidents', data);
export const updateIncident = (id, data) => api.put(`/incidents/${id}`, data);
export const deleteIncident = (id) => api.delete(`/incidents/${id}`);
export const remediateIncident = (id) => api.post(`/incidents/${id}/remediate`);

export default api;
