/**
 * Feature flag hooks for accessing LaunchDarkly flags
 *
 * These hooks provide type-safe access to feature flags with sensible defaults.
 * All flags default to `false` if not configured or if LaunchDarkly is unavailable.
 *
 * @module useFeatureFlags
 */

import { useBooleanFlagDetails } from "@openfeature/react-sdk"
import { FlagKeys } from "../contexts/FeatureFlagsProvider"

export const useFlagFrontendBillingAndMetering = (): boolean => {
  const details = useBooleanFlagDetails(
    FlagKeys.ReleaseFrontendBillingAndMetering,
    false
  )
  return details.value
}

export const useFlagFrontendLicenseManagement = (): boolean => {
  const details = useBooleanFlagDetails(
    FlagKeys.ReleaseFrontendLicenseManagement,
    false
  )
  return details.value
}

export const useFeatureFlags = () => {
  const frontendBillingAndMeteringEnabled = useFlagFrontendBillingAndMetering()
  const frontendLicenseManagementEnabled = useFlagFrontendLicenseManagement()

  return {
    frontendBillingAndMeteringEnabled,
    frontendLicenseManagementEnabled,
  }
}
