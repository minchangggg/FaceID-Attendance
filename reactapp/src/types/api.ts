export interface AttendanceLog {
  id: number;
  name: string;
  student_id: string;
  timestamp: string;
}

export interface AttendanceResponse {
  date: string | null;
  records: AttendanceLog[];
  error?: string;
}

export interface StudentInfo {
  id: number;
  name: string;
  student_id: string;
}

export interface DateFilter {
  date?: string;
}

