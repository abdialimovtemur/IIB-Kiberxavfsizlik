export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role: 'super_admin' | 'admin' | 'staff';
  is_active: boolean;
  avatar?: string;
  workplace?: number;
  created_at: string;
  updated_at: string;
}

export interface WorkPlace {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Crime {
  id: number;
  department: number;
  date: string;
  terrorism: number;
  atheism: number;
  illegal_weapon: number;
  human_trafficking: number;
  narcotic: number;
  subculture: number;
  violence: number;
  pornography: number;
  mining: number;
  crypto: number;
  imei: number;
  pentesting: number;
  gateway: number;
  virus: number;
  gambling: number;
  fake_trading: number;
  darknet: number;
  files?: File[];
  created_at: string;
  updated_at: string;
}

export interface File {
  id: number;
  file: string;
  name: string;
  size: number;
  type: string;
  uploaded_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface UserStats {
  reports_count: number;
  activity_rate: number;
  chart_config: any;
}

export interface DepartmentStats {
  reports_count: number;
  total_incidents: number;
  average_daily: number;
  chart_config: any;
}

export interface WorkPlaceStats {
  users_count: number;
  reports_count: number;
  chart_config: any;
}

export interface ReportStats {
  total_reports: number;
  total_incidents: number;
  average_daily: number;
  chart_config: any;
}

export interface ApiError {
  detail: string;
  code?: string;
  errors?: Record<string, string[]>;
} 