import { Method } from './api.type';

export const callApi = async (
  url: string,
  method: Method,
  accessToken: string | null,
  body: Record<string, unknown> | null = null
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  // Get host fomr envs for dev. If not defined, check ENVs stored in html
  // to make them dynamic in production given the static files via NGINX
  let host = 'http://localhost:8001';
  if (import.meta.env.VITE_BACKEND_URL) {
    host = import.meta.env.VITE_BACKEND_URL;
  }
  if (window.__ENV__?.VITE_BACKEND_URL && window.__ENV__?.VITE_BACKEND_URL !== '${VITE_BACKEND_URL}') {
    host = window.__ENV__?.VITE_BACKEND_URL;
  }
  let finalUrl = `${host}${url}`;
  let fetchBody: string | undefined;

  if (method === Method.GET || method === Method.HEAD) {
    if (body) {
      const query = new URLSearchParams(
        Object.entries(body)
          .filter(([, value]) => value != null)
          .map(([key, value]) => [key, String(value)])
      );
      finalUrl += `?${query.toString()}`;
    }
  } else {
    fetchBody = body ? JSON.stringify(body) : undefined;
  }

  return fetch(finalUrl, {
    method,
    headers,
    body: fetchBody,
  });
};
