import { useSession } from "@site/src/contexts/SessionProvider"

/**
 * Hook to access current user data and authentication state
 *
 * Provides convenient access to user information with React Query loading and error states.
 * Use `isAuthenticated` to check if a user is logged in.
 */
export function useCurrentUser() {
  const { currentUser, isLoadingUser, isErrorUser, userError } = useSession()

  return {
    currentUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
    error: userError,
    isAuthenticated: !!currentUser,
  }
}

/**
 * Hook to access all organizations the current user belongs to
 *
 * Returns list of organizations with React Query loading and error states.
 * Only fetches organizations after user is authenticated.
 */
export function useOrganizations() {
  const { organizations, isLoadingOrgs, isErrorOrgs, orgsError } = useSession()

  return {
    organizations,
    isLoading: isLoadingOrgs,
    isError: isErrorOrgs,
    error: orgsError,
  }
}

/**
 * Hook to access and modify the current organization
 *
 * Provides the currently selected organization and a setter to change it.
 * Organization selection is persisted across browser sessions.
 */
export function useCurrentOrg() {
  const { currentOrg, setCurrentOrg } = useSession()

  return {
    currentOrg,
    setCurrentOrg,
  }
}

/**
 * Hook to access the full session context
 *
 * Provides access to all session data including refetch methods.
 * Use this when you need fine-grained control over session state.
 * For most use cases, prefer the more specific hooks above.
 */
export function useFullSession() {
  return useSession()
}
