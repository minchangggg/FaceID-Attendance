import axios from 'axios';
import type { AttendanceResponse, AttendanceLog, DateFilter } from '@/types/api';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAttendanceLogs = async (filter?: DateFilter): Promise<AttendanceLog[]> => {
  const params = new URLSearchParams();
  if (filter?.date) {
    params.append('date', filter.date);
  }
  
  const url = `/view-logs/${params.toString() ? '?' + params.toString() : ''}`;
  const response = await api.get<AttendanceResponse>(url);
  
  return response.data.records || [];
};

