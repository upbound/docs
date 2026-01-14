/**
 * HTTP GET utility for making API requests
 *
 * @module utils/http
 */

import { API_CONFIG } from "@site/src/contexts/config"

/**
 * Creates an HTTP GET function configured with a specific API URL
 *
 * @param {string} apiUrl - The base API URL
 * @returns A configured httpGet function
 *
 * @example
 * ```typescript
 * import { createHttpGet } from '@site/src/utils/http';
 *
 * const httpGet = createHttpGet('https://api.example.com');
 * const user = await httpGet<User>('/v1/users/me');
 * ```
 */
export function createHttpGet(apiUrl: string) {
  return async function httpGet<T>(
    url: string,
    options?: { signal?: AbortSignal }
  ): Promise<T> {
    const response = await fetch(`${apiUrl}${url}`, {
      method: "GET",
      credentials: API_CONFIG.credentials,
      headers: API_CONFIG.headers,
      signal: options?.signal,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }
}
