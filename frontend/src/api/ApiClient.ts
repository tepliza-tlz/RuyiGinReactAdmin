// ============================================================
// API Layer — mock/real switching via config flag
// ============================================================
// Change ONE line in admin.config.ts:
//   api: { mode: 'mock' }   →   api: { mode: 'real' }
//
// Services use createApiClient() which returns a unified
// client. In mock mode, all requests are intercepted and
// served from mock definitions. In real mode, they hit
// the baseURL via fetch.
// ============================================================

import type { ApiConfig, IApiClient, ApiMiddleware } from '../config/types';
import { getMiddlewares } from '../plugins/PluginManager';

// ── Helpers ──────────────────────────────────────────
function resolveMode(config: ApiConfig): 'mock' | 'real' {
  if (config.mode === 'auto') {
    // @ts-ignore — Vite exposes import.meta.env
    return (typeof import.meta !== 'undefined' && (import.meta as any).env?.PROD)
      ? 'real'
      : 'mock';
  }
  return config.mode;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Middleware pipeline ──────────────────────────────
async function applyRequestMiddlewares(
  middlewares: ApiMiddleware[],
  req: {
    method: string;
    url: string;
    headers: Record<string, string>;
    data?: unknown;
    params?: Record<string, string>;
  },
) {
  let current = req;
  for (const mw of middlewares) {
    if (mw.onRequest) {
      current = await mw.onRequest(current);
    }
  }
  return current;
}

async function applyResponseMiddlewares<T>(
  middlewares: ApiMiddleware[],
  res: { data: T; status: number },
) {
  let current = res;
  for (const mw of middlewares) {
    if (mw.onResponse) {
      current = await mw.onResponse(current);
    }
  }
  return current;
}

// ── Real API Client (fetch-based) ────────────────────
function createRealClient(config: ApiConfig): IApiClient {
  const middlewares = getMiddlewares();

  async function request<T>(reqConfig: {
    method: string;
    url: string;
    data?: unknown;
    params?: Record<string, string>;
  }): Promise<T> {
    let url = `${config.baseURL}${reqConfig.url}`;

    if (reqConfig.params) {
      const qs = new URLSearchParams(reqConfig.params).toString();
      url += `?${qs}`;
    }

    const headers: Record<string, string> = {
      ...(config.headers ?? {}),
    };
    if (reqConfig.data && !(reqConfig.data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    let processed = await applyRequestMiddlewares(middlewares, {
      method: reqConfig.method,
      url,
      headers,
      data: reqConfig.data,
      params: reqConfig.params,
    });

    // Auto-attach auth token from localStorage
    try {
      const token = localStorage.getItem('admin-token');
      if (token) {
        processed.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch { /* ignore */ }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const fetchInit: RequestInit = {
        method: processed.method,
        headers: processed.headers,
        signal: controller.signal,
      };

      if (
        processed.data &&
        ['POST', 'PUT', 'PATCH'].includes(processed.method.toUpperCase())
      ) {
        fetchInit.body = processed.data instanceof FormData
          ? processed.data
          : JSON.stringify(processed.data);
      }

      const response = await fetch(url, fetchInit);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        throw new Error(
          `API ${response.status}: ${response.statusText}${errorBody ? ` — ${errorBody}` : ''}`,
        );
      }

      const data = response.status === 204 ? null : await response.json();
      const middlewareResult = await applyResponseMiddlewares<T>(middlewares, {
        data: data as T,
        status: response.status,
      });

      return middlewareResult.data;
    } catch (err) {
      // Apply error middlewares
      let error = err instanceof Error ? err : new Error(String(err));
      for (const mw of middlewares) {
        if (mw.onError) {
          error = await mw.onError(error);
        }
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    request,
    get: <T>(url: string, params?: Record<string, string>) =>
      request<T>({ method: 'GET', url, params }),
    post: <T>(url: string, data?: unknown) =>
      request<T>({ method: 'POST', url, data }),
    put: <T>(url: string, data?: unknown) =>
      request<T>({ method: 'PUT', url, data }),
    patch: <T>(url: string, data?: unknown) =>
      request<T>({ method: 'PATCH', url, data }),
    delete: <T>(url: string) =>
      request<T>({ method: 'DELETE', url }),
  };
}

// ── Mock API Client ──────────────────────────────────
export type MockEndpointMap = Record<
  string,
  {
    method: string;
    urlPattern: string | RegExp;
    handler: (params: any, data: any) => any | Promise<any>;
  }
>;

function createMockClient(config: ApiConfig, mocks: MockEndpointMap): IApiClient {
  async function request<T>(reqConfig: {
    method: string;
    url: string;
    data?: unknown;
    params?: Record<string, string>;
  }): Promise<T> {
    if (config.mockVerbose) {
      console.log(
        `%c[MOCK] %c${reqConfig.method} %c${reqConfig.url}`,
        'color: #f59e0b; font-weight: bold',
        'color: #3b82f6',
        'color: #e8ecf2',
        reqConfig.params ?? '',
      );
    }

    if (config.mockDelay > 0) {
      await sleep(config.mockDelay);
    }

    // Find matching mock handler
    for (const [, mock] of Object.entries(mocks)) {
      if (mock.method.toUpperCase() !== reqConfig.method.toUpperCase()) continue;

      const pattern = mock.urlPattern;
      const matches =
        typeof pattern === 'string'
          ? pattern === reqConfig.url
          : pattern.test(reqConfig.url);

      if (matches) {
        const result = await mock.handler(reqConfig.params, reqConfig.data);
        return result as T;
      }
    }

    console.warn(
      `[MOCK] No handler found for ${reqConfig.method} ${reqConfig.url}`,
    );
    return undefined as unknown as T;
  }

  return {
    request,
    get: <T>(url: string, params?: Record<string, string>) =>
      request<T>({ method: 'GET', url, params }),
    post: <T>(url: string, data?: unknown) =>
      request<T>({ method: 'POST', url, data }),
    put: <T>(url: string, data?: unknown) =>
      request<T>({ method: 'PUT', url, data }),
    patch: <T>(url: string, data?: unknown) =>
      request<T>({ method: 'PATCH', url, data }),
    delete: <T>(url: string) =>
      request<T>({ method: 'DELETE', url }),
  };
}

// ── Factory — the magic switch ───────────────────────
let _apiClient: IApiClient | null = null;

/**
 * Create (or reuse) the API client based on config.
 * Call once at app boot; services import this to make calls.
 */
export function createApiClient(
  config: ApiConfig,
  mocks: MockEndpointMap,
): IApiClient {
  if (_apiClient) return _apiClient;

  const mode = resolveMode(config);
  console.log(`[API] Mode: ${mode.toUpperCase()} (baseURL: ${config.baseURL})`);

  _apiClient =
    mode === 'mock'
      ? createMockClient(config, mocks)
      : createRealClient(config);

  return _apiClient;
}

/** Get the current API client (throws if not initialized) */
export function getApiClient(): IApiClient {
  if (!_apiClient) {
    throw new Error(
      'API client not initialized. Call createApiClient() at app boot.',
    );
  }
  return _apiClient;
}

/** Re-initialize with new config at runtime (useful for dev) */
export function resetApiClient(): void {
  _apiClient = null;
}
