import { LaunchDarklyClientProvider } from "@openfeature/launchdarkly-client-provider"
import {
  EvaluationContext,
  InMemoryProvider,
  OpenFeature,
} from "@openfeature/web-sdk"
import { OpenFeatureProvider } from "@openfeature/react-sdk"
import {
  FeatureFlagGuard,
  OrgUserFlagContext,
  OrgUserFlagContextSchema,
  setContextDebounced,
  upboundMemberContextEvaluator,
} from "@upbound/utils"
import { PropsWithChildren, useCallback, useEffect } from "react"

import { useSession } from "./SessionProvider"

type FlagConfiguration = ConstructorParameters<typeof InMemoryProvider>[0]

const booleanFlagDetails = {
  disabled: false,
  variants: {
    on: true,
    off: false,
  },
  defaultVariant: "off",
  contextEvaluator: upboundMemberContextEvaluator,
}

export enum FlagKeys {
  ReleaseFrontendBillingAndMetering = "rls-frontend-billing-and-metering",
  ReleaseFrontendLicenseManagement = "rls-frontend-license-management",
}

const flagConfig: FlagConfiguration = {
  [FlagKeys.ReleaseFrontendBillingAndMetering]: booleanFlagDetails,
  [FlagKeys.ReleaseFrontendLicenseManagement]: booleanFlagDetails,
}

const isDevelopment = process.env.NODE_ENV === "development"
const isTest = process.env.NODE_ENV === "test"

const getFeatureFlagsClientID = () =>
  (globalThis.docusaurus?.siteConfig?.customFields as any)
    ?.launchDarklyClientId || ""

// Initialize OpenFeature provider at module level
if (!isDevelopment && !isTest) {
  if (typeof window !== "undefined") {
    const ldOptions = {
      streaming: true,
      initializationTimeout: 2,
    }
    OpenFeature.setProvider(
      new LaunchDarklyClientProvider(getFeatureFlagsClientID(), ldOptions)
    )
  } else {
    // Use empty InMemoryProvider for SSR
    OpenFeature.setProvider(new InMemoryProvider())
  }
} else {
  OpenFeature.setProvider(new InMemoryProvider(flagConfig))
}

export const FeatureFlagsProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { currentUser, currentOrg } = useSession()

  useEffect(() => {
    if (!currentUser || !currentOrg) {
      return
    }

    const ctx: OrgUserFlagContext = {
      kind: "multi",
      user: {
        targetingKey: currentUser.id,
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email,
        location: currentUser.location || "",
      },
      org: {
        targetingKey: currentOrg.id,
        name: currentOrg.name,
        tier: currentOrg.tier || "free",
      },
    }

    setContextDebounced(ctx)
  }, [currentUser, currentOrg])

  const isContextLoaded = useCallback(
    (context: EvaluationContext) => {
      // Return false if context is not set yet (wait for flags to load)
      if (!context || Object.keys(context).length === 0) {
        return false
      }

      if (!currentOrg) {
        return false
      }

      const orgUserParse = OrgUserFlagContextSchema.safeParse(context).data
      return orgUserParse?.org?.name === currentOrg.name
    },
    [currentOrg]
  )

  const onError = useCallback((error: Error) => {
    console.error("Feature flag error:", error)
  }, [])

  return (
    <OpenFeatureProvider>
      <FeatureFlagGuard onError={onError} isContextLoaded={isContextLoaded}>
        {({ flagsLoaded }) => {
          // For docs site, don't block on flag loading to ensure fast page loads
          return children
        }}
      </FeatureFlagGuard>
    </OpenFeatureProvider>
  )
}
