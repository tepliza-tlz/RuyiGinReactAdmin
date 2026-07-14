// ============================================================
// Dashboard API Service — mock data + endpoint definitions
// ============================================================
// Each service file defines BOTH mock data AND endpoint configs.
// The mock data is used when api.mode = 'mock'.
// When you switch to 'real', the same method names work,
// but requests go to baseURL + the url pattern.
// ============================================================

import { getApiClient } from '../ApiClient';
import type { MockEndpointMap } from '../ApiClient';

// ── Types ────────────────────────────────────────────
export interface DashboardStats {
  users: { total: number; active: number; trend: number };
  content: { total: number; trend: number };
  system: { load: number; trend: number };
}

export interface Activity {
  id: string;
  time: string;
  text: string;
  icon: string;
}

export interface QuickAction {
  key: string;
  label: string;
  icon: string;
}

// ── Mock Data ────────────────────────────────────────
const MOCK_STATS: DashboardStats = {
  users:  { total: 12_846, active: 3_421, trend: 12 },
  content: { total: 9_853, trend: 23 },
  system: { load: 42, trend: -5 },
};

const MOCK_ACTIVITIES: Activity[] = [
  { id: '1', time: '10分钟前', text: '管理员 更新了系统配置', icon: '⚙' },
  { id: '2', time: '30分钟前', text: '用户 张三 提交了内容审核申请', icon: '📄' },
  { id: '3', time: '1小时前',  text: 'AI 助手 完成了数据清洗任务', icon: '🤖' },
  { id: '4', time: '2小时前',  text: '系统 自动备份完成', icon: '💾' },
  { id: '5', time: '3小时前',  text: '新用户 李四 完成注册', icon: '👤' },
];

let nextActivityId = 6;

// ── Mock Endpoints (registered with ApiClient) ───────
export const dashboardMocks: MockEndpointMap = {
  'GET /api/dashboard/stats': {
    method: 'GET',
    urlPattern: '/api/dashboard/stats',
    handler: () => MOCK_STATS,
  },
  'GET /api/dashboard/activities': {
    method: 'GET',
    urlPattern: '/api/dashboard/activities',
    handler: () => MOCK_ACTIVITIES,
  },
  'POST /api/dashboard/activities': {
    method: 'POST',
    urlPattern: '/api/dashboard/activities',
    handler: (_params, data: any) => {
      const newActivity: Activity = {
        id: String(nextActivityId++),
        time: '刚刚',
        text: data?.text ?? '新活动',
        icon: data?.icon ?? '📌',
      };
      MOCK_ACTIVITIES.unshift(newActivity);
      return newActivity;
    },
  },
};

// ── API Service (used by components) ─────────────────
export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    return getApiClient().get<DashboardStats>('/api/dashboard/stats');
  },

  async getActivities(): Promise<Activity[]> {
    return getApiClient().get<Activity[]>('/api/dashboard/activities');
  },

  async addActivity(data: { text: string; icon: string }): Promise<Activity> {
    return getApiClient().post<Activity>('/api/dashboard/activities', data);
  },
};
