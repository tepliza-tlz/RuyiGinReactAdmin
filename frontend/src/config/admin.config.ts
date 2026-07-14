// ============================================================
// ADMIN CONFIG — the single file you change for a new project
// ============================================================
// Copy this framework, replace this file, point to your page
// components, and you have a new admin system.
// ============================================================

import { defineConfig } from './types';
import { ruyiTheme } from '../theme/themes/ruyi';
import { lightTheme } from '../theme/themes/light';
import { analyticsPlugin } from '../plugins/analytics';
import { dashboardApi } from '../api/services/dashboard';
import { usersApi } from '../api/services/users';

// ---- Lazy page imports (code-split per page) ----
// Vite/Rollup will split each page into its own chunk.
const DashboardPage    = () => import('../pages/Dashboard');
const UserListPage     = () => import('../pages/UserList');
const ContentListPage  = () => import('../pages/ContentList');
const DataAnalysisPage = () => import('../pages/DataAnalysis');
const RolePermPage     = () => import('../pages/RolePermission');
const MenuManagePage   = () => import('../pages/MenuManage');
const OperationLogPage = () => import('../pages/OperationLog');
const AiAssistantPage  = () => import('../pages/AiAssistant');

export const adminConfig = defineConfig({
  // ── App Info ──────────────────────────────────────
  app: {
    name: '如意管理后台',
    shortName: '如意',
    version: '2.0.0',
    logo: '☁',
    description: '吉祥如意 · 万事如意',
    footer: '如意 v2.0 — Powered by Admin Framework',
  },

  // ── Permissions ───────────────────────────────────
  permissions: [
    { key: 'dashboard',       label: '仪表盘',  description: '查看仪表盘' },
    { key: 'user:view',       label: '查看用户',  description: '查看用户列表' },
    { key: 'user:create',     label: '新建用户',  description: '创建新用户' },
    { key: 'user:edit',       label: '编辑用户',  description: '编辑用户信息' },
    { key: 'user:delete',     label: '删除用户',  description: '删除用户' },
    { key: 'content:view',    label: '查看内容',  description: '查看内容列表' },
    { key: 'content:edit',    label: '编辑内容',  description: '编辑内容' },
    { key: 'data:view',       label: '数据分析',  description: '查看数据分析' },
    { key: 'system:role',     label: '角色管理',  description: '管理角色权限' },
    { key: 'system:menu',     label: '菜单管理',  description: '管理菜单配置' },
    { key: 'system:log',      label: '操作日志',  description: '查看操作日志' },
    { key: 'ai:access',       label: 'AI 助手',   description: '使用 AI 助手' },
    // Admin gets all permissions
    { key: 'admin',           label: '超级管理员', description: '全部权限', parent: undefined },
  ],

  // ── Menu structure ────────────────────────────────
  menu: [
    {
      key: 'dashboard', label: '仪表盘', icon: '📊',
      route: '/dashboard',
      permission: 'dashboard',
      badge: { type: 'dot', color: '#10b981' },
    },
    {
      key: 'user', label: '用户管理', icon: '👥',
      route: '/users',
      permission: 'user:view',
      children: [
        { key: 'user-list',    label: '用户列表', icon: '📋', route: '/users', permission: 'user:view' },
        { key: 'user-create',  label: '新建用户', icon: '➕', route: '/users/create', permission: 'user:create', hideInMenu: false },
      ],
    },
    {
      key: 'content', label: '内容管理', icon: '📝',
      route: '/content',
      permission: 'content:view',
    },
    {
      key: 'data', label: '数据分析', icon: '📈',
      route: '/data-analysis',
      permission: 'data:view',
      badge: { value: 5, type: 'count' },
    },
    {
      key: 'system', label: '系统设置', icon: '⚙',
      isGroup: true,
      children: [
        { key: 'role', label: '角色权限', icon: '🔑', route: '/system/roles', permission: 'system:role' },
        { key: 'menu', label: '菜单管理', icon: '📋', route: '/system/menus', permission: 'system:menu' },
        { key: 'log',  label: '操作日志', icon: '📄', route: '/system/logs',  permission: 'system:log' },
      ],
    },
    {
      key: 'ai', label: 'AI 助手', icon: '🤖',
      route: '/ai-assistant',
      permission: 'ai:access',
      dividerBefore: true,
    },
  ],

  // ── Routes ────────────────────────────────────────
  routes: [
    { key: 'dashboard',     path: '/dashboard',      title: '仪表盘',     permission: 'dashboard',    component: { type: 'lazy', loader: DashboardPage } },
    { key: 'user-list',     path: '/users',           title: '用户列表',   permission: 'user:view',    component: { type: 'lazy', loader: UserListPage } },
    { key: 'user-create',   path: '/users/create',   title: '新建用户',   permission: 'user:create',  component: { type: 'lazy', loader: UserListPage }, hideInMenu: true },
    { key: 'content',       path: '/content',         title: '内容管理',   permission: 'content:view', component: { type: 'lazy', loader: ContentListPage } },
    { key: 'data',          path: '/data-analysis',   title: '数据分析',   permission: 'data:view',    component: { type: 'lazy', loader: DataAnalysisPage } },
    { key: 'role',          path: '/system/roles',    title: '角色权限',   permission: 'system:role',  component: { type: 'lazy', loader: RolePermPage } },
    { key: 'menu',          path: '/system/menus',    title: '菜单管理',   permission: 'system:menu',  component: { type: 'lazy', loader: MenuManagePage } },
    { key: 'log',           path: '/system/logs',     title: '操作日志',   permission: 'system:log',   component: { type: 'lazy', loader: OperationLogPage } },
    { key: 'ai',            path: '/ai-assistant',    title: 'AI 助手',    permission: 'ai:access',    component: { type: 'lazy', loader: AiAssistantPage } },
    // Catch-all: redirect unknown paths to dashboard
    { key: 'not-found',     path: '*',                title: '404',        component: { type: 'lazy', loader: () => import('../pages/NotFound') }, hideInMenu: true },
  ],

  // ── Theme ─────────────────────────────────────────
  theme: {
    defaultTheme: 'ruyi',
    themes: [ruyiTheme, lightTheme],
  },

  // ── API ───────────────────────────────────────────
  api: {
    mode: 'mock',           // ← switch to 'real' when your backend is ready
    baseURL: 'http://localhost:8080/api',
    timeout: 10_000,
    headers: { 'Content-Type': 'application/json' },
    mockDelay: 300,          // simulate network latency in mock mode
    mockVerbose: true,       // log mock responses to console
  },

  // ── Plugins ───────────────────────────────────────
  plugins: [analyticsPlugin],

  // ── User permissions resolver ─────────────────────
  getUserPermissions: () => {
    // TODO: Replace with real auth (JWT decode, API call, etc.)
    // For now, return all permissions (admin mode).
    return ['admin']; // 'admin' permission implies all
  },
});
