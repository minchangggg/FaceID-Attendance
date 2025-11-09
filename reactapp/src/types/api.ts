// API Types
export interface SensorData {
  temperature: number;
  number_people: number;
  fan_status: number;
  light_status: number;
  update_time: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  details?: string;
}

export interface ControlPayload {
  temperature: number;
  number_people: number;
  fan_status: number;
  light_status: number;
}

export interface DateFilter {
  start_time?: string;
  end_time?: string;
}

