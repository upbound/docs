/**
 * Centralized configuration management for the application
 *
 * This module provides type-safe access to configuration values from Docusaurus.
 * Uses useDocusaurusContext for proper React integration.
 */

import useDocusaurusContext from "@docusaurus/useDocusaurusContext"

/**
 * Type for custom fields in Docusaurus site config
 */
interface CustomFields {
  apiUrl?: string
  baseDomain?: string
  launchDarklyClientId?: string
}

/**
 * Application configuration
 */
export interface Config {
  apiUrl: string
  baseDomain: string
  launchDarklyClientId: string
}

/**
 * Hook to access application configuration
 * Uses Docusaurus context for proper React integration
 */
export function useConfig(): Config {
  const { siteConfig } = useDocusaurusContext()
  const customFields = (siteConfig.customFields as CustomFields) || {}

  return {
    apiUrl: customFields.apiUrl!,
    baseDomain: customFields.baseDomain!,
    launchDarklyClientId: customFields.launchDarklyClientId || "",
  }
}

/**
 * Query configuration constants (React Query settings)
 */
export const QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  retryCount: 1,
  refetchOnWindowFocus: false,
} as const

/**
 * API request configuration (fetch settings)
 */
export const API_CONFIG = {
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  credentials: "include" as RequestCredentials,
} as const
