import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { Organization, OrganizationsApi, SelfResponse } from "@upbound/api"
import { usePersistOrgName } from "@upbound/utils"
import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useEffect,
} from "react"

import { useConfig, QUERY_CONFIG } from "./config"
import { createHttpGet } from "@site/src/utils/http"

/**
 * Create API client instance configured with API URL
 */
const createApiClient = (apiUrl: string) =>
  new OrganizationsApi({
    get: createHttpGet(apiUrl),
  })

/**
 * Session context value exposed to consumers
 * Exposes React Query states directly for transparency
 */
type SessionContextValue = {
  // Current user state
  currentUser: SelfResponse["user"] | undefined
  isLoadingUser: boolean
  isErrorUser: boolean
  userError: Error | null
  refetchUser: () => void

  // Organizations state
  organizations: Organization[]
  isLoadingOrgs: boolean
  isErrorOrgs: boolean
  orgsError: Error | null
  refetchOrgs: () => void

  // Current org selection
  currentOrg: Organization | null
  setCurrentOrg: (org: Organization | null) => void
}

/**
 * Session context - undefined when used outside of provider
 */
const SessionContext = createContext<SessionContextValue | undefined>(undefined)

/**
 * Query keys for React Query cache management
 */
const queryKeys = {
  currentUser: ["currentUser"] as const,
  organizations: ["organizations"] as const,
} as const

/**
 * Query hook for fetching current user data
 * Uses React Query for caching and automatic refetching
 */
const useCurrentUserQuery = (
  apiClient: OrganizationsApi
): UseQueryResult<SelfResponse, Error> => {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: () => apiClient.getCurrentUser(),
    staleTime: QUERY_CONFIG.staleTime,
    refetchOnWindowFocus: QUERY_CONFIG.refetchOnWindowFocus,
    retry: QUERY_CONFIG.retryCount,
  })
}

/**
 * Query hook for fetching organizations
 * Only enabled when user ID is available
 */
const useOrganizationsQuery = (
  apiClient: OrganizationsApi,
  enabled: boolean
): UseQueryResult<Organization[], Error> => {
  return useQuery({
    queryKey: queryKeys.organizations,
    queryFn: () => apiClient.getOrganizations(),
    enabled,
    staleTime: QUERY_CONFIG.staleTime,
    refetchOnWindowFocus: QUERY_CONFIG.refetchOnWindowFocus,
    retry: QUERY_CONFIG.retryCount,
  })
}

export const SessionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const config = useConfig()

  // Create API client with config
  const apiClient = useMemo(
    () => createApiClient(config.apiUrl),
    [config.apiUrl]
  )

  // Fetch current user - expose React Query states directly
  const {
    data: userData,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: userError,
    refetch: refetchUser,
  } = useCurrentUserQuery(apiClient)

  const currentUser = userData?.user
  const userId = currentUser?.id

  // Persist org selection across sessions
  const [persistedOrgName, setPersistedOrgName] = usePersistOrgName(
    config.baseDomain,
    userId || null
  )

  // Fetch organizations (only when we have a user)
  const {
    data: organizations = [],
    isLoading: isLoadingOrgs,
    isError: isErrorOrgs,
    error: orgsError,
    refetch: refetchOrgs,
  } = useOrganizationsQuery(apiClient, !!userId)

  // Find current org from persisted name
  const currentOrg = useMemo(() => {
    if (!persistedOrgName || organizations.length === 0) {
      return null
    }
    return organizations.find((org) => org.name === persistedOrgName) || null
  }, [persistedOrgName, organizations])

  // Auto-select first org if none is persisted
  useEffect(() => {
    if (!persistedOrgName && organizations.length > 0) {
      setPersistedOrgName(organizations[0].name)
    }
  }, [persistedOrgName, organizations, setPersistedOrgName])

  // Callback to update current organization
  const setCurrentOrg = (org: Organization | null) => {
    setPersistedOrgName(org?.name || null)
  }

  const value: SessionContextValue = {
    currentUser,
    isLoadingUser,
    isErrorUser,
    userError: userError || null,
    refetchUser,
    organizations,
    isLoadingOrgs,
    isErrorOrgs,
    orgsError: orgsError || null,
    refetchOrgs,
    currentOrg,
    setCurrentOrg,
  }

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

export const useSession = (): SessionContextValue => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used within a SessionProvider")
  }

  return context
}
