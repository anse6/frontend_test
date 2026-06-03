import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/objects`;

export const fetchObjects = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createObject = async (formData: FormData) => {
  const response = await axios.post(API_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const fetchObjectById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateObject = async (id: string, formData: FormData) => {
  const response = await axios.put(`${API_URL}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteObject = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};