// ============================================================
// Users API Service — demonstrates CRUD + filtering + pagination
// ============================================================

import { getApiClient } from '../ApiClient';
import type { MockEndpointMap } from '../ApiClient';

// ── Types ────────────────────────────────────────────
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'disabled';
  createdAt: string;
  avatar?: string;
}

export interface UserQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  role?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ── Mock Data ────────────────────────────────────────
const MOCK_USERS: User[] = [
  { id: '1', username: '张大鹏', email: 'zhangdp@example.com', role: 'admin',    status: 'active',   createdAt: '2026-01-15' },
  { id: '2', username: '李思雨', email: 'lisy@example.com',   role: 'editor',   status: 'active',   createdAt: '2026-02-20' },
  { id: '3', username: '王建国', email: 'wangjg@example.com', role: 'editor',   status: 'active',   createdAt: '2026-03-10' },
  { id: '4', username: '赵灵儿', email: 'zhaolr@example.com', role: 'viewer',   status: 'active',   createdAt: '2026-04-05' },
  { id: '5', username: '陈小明', email: 'chenxm@example.com', role: 'viewer',   status: 'disabled', createdAt: '2026-05-18' },
  { id: '6', username: '刘芳',   email: 'liuf@example.com',   role: 'editor',   status: 'active',   createdAt: '2026-06-22' },
  { id: '7', username: '黄志强', email: 'huangzq@example.com', role: 'viewer',   status: 'disabled', createdAt: '2026-07-01' },
  { id: '8', username: '周美玲', email: 'zhouml@example.com', role: 'editor',   status: 'active',   createdAt: '2026-07-10' },
];

let nextUserId = 9;

// ── Mock Endpoints ───────────────────────────────────
export const usersMocks: MockEndpointMap = {
  'GET /api/users': {
    method: 'GET',
    urlPattern: '/api/users',
    handler: (params?: Record<string, string>): PaginatedResponse<User> => {
      const page = Number(params?.page) || 1;
      const pageSize = Number(params?.pageSize) || 10;
      const keyword = params?.keyword?.toLowerCase();
      const role = params?.role;
      const status = params?.status;

      let filtered = [...MOCK_USERS];

      if (keyword) {
        filtered = filtered.filter(
          (u) =>
            u.username.toLowerCase().includes(keyword) ||
            u.email.toLowerCase().includes(keyword),
        );
      }
      if (role) {
        filtered = filtered.filter((u) => u.role === role);
      }
      if (status) {
        filtered = filtered.filter((u) => u.status === status);
      }

      const total = filtered.length;
      const start = (page - 1) * pageSize;
      const items = filtered.slice(start, start + pageSize);

      return { items, total, page, pageSize };
    },
  },

  'GET /api/users/:id': {
    method: 'GET',
    urlPattern: /^\/api\/users\/\d+$/,
    handler: (): User | undefined => {
      // Simplified — in real mock you'd parse the id from URL
      return MOCK_USERS[0];
    },
  },

  'POST /api/users': {
    method: 'POST',
    urlPattern: '/api/users',
    handler: (_params, data: any): User => {
      const newUser: User = {
        id: String(nextUserId++),
        username: data?.username ?? '新用户',
        email: data?.email ?? `user${nextUserId}@example.com`,
        role: data?.role ?? 'viewer',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
      };
      MOCK_USERS.unshift(newUser);
      return newUser;
    },
  },

  'PUT /api/users/:id': {
    method: 'PUT',
    urlPattern: /^\/api\/users\/\d+$/,
    handler: (_params, data: any): User | undefined => {
      const idx = MOCK_USERS.findIndex((u) => u.id === data?.id);
      if (idx !== -1) {
        MOCK_USERS[idx] = { ...MOCK_USERS[idx], ...data };
        return MOCK_USERS[idx];
      }
      return undefined;
    },
  },

  'DELETE /api/users/:id': {
    method: 'DELETE',
    urlPattern: /^\/api\/users\/\d+$/,
    handler: (): { success: boolean } => {
      return { success: true };
    },
  },
};

// ── API Service ──────────────────────────────────────
export const usersApi = {
  async list(query?: UserQuery): Promise<PaginatedResponse<User>> {
    return getApiClient().get<PaginatedResponse<User>>('/api/users', {
      page: String(query?.page ?? 1),
      pageSize: String(query?.pageSize ?? 10),
      ...(query?.keyword ? { keyword: query.keyword } : {}),
      ...(query?.role ? { role: query.role } : {}),
      ...(query?.status ? { status: query.status } : {}),
    });
  },

  async getById(id: string): Promise<User> {
    return getApiClient().get<User>(`/api/users/${id}`);
  },

  async create(data: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    return getApiClient().post<User>('/api/users', data);
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    return getApiClient().put<User>(`/api/users/${id}`, { ...data, id });
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return getApiClient().delete<{ success: boolean }>(`/api/users/${id}`);
  },
};
