// Core types — everything flows from these
export type {
  AdminConfig,
  AppInfo,
  MenuItemConfig,
  MenuBadge,
  RouteConfig,
  ComponentSource,
  PermissionConfig,
  PermissionChecker,
  ThemeDefinition,
  ThemeMode,
  ApiConfig,
  ApiMode,
  IApiClient,
  ApiEndpointDefinition,
  ApiServiceDefinition,
  AdminPlugin,
  PluginContext,
  ApiMiddleware,
} from './types';

export { defineConfig } from './types';

// Config provider + hooks
export { ConfigProvider, useConfig, useMenu } from './ConfigContext';

// Default config for this project
export { adminConfig } from './admin.config';
