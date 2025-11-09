import axios from 'axios';
import type { ApiResponse, SensorData, ControlPayload, DateFilter } from '@/types/api';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1/pbl31/tdt';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get current sensor data
export const getCurrentData = async (): Promise<SensorData> => {
  const response = await api.get<ApiResponse<SensorData>>('/getData.php');
  if (response.data.status === 'success' && response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Failed to fetch data');
};

// Get filtered data by date range
export const getFilteredData = async (filter: DateFilter): Promise<SensorData[]> => {
  const params = new URLSearchParams();
  if (filter.start_time) params.append('start_time', filter.start_time);
  if (filter.end_time) params.append('end_time', filter.end_time);
  
  const response = await api.get<ApiResponse<SensorData[]>>(`/getData.php?${params.toString()}`);
  if (response.data.status === 'success' && response.data.data) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'Failed to fetch filtered data');
};

// Control devices (fan and light)
export const controlDevice = async (payload: ControlPayload): Promise<void> => {
  const response = await api.post<ApiResponse<SensorData>>('/postData.php', payload);
  if (response.data.status !== 'success') {
    throw new Error(response.data.message || 'Failed to control device');
  }
};

