import React from "react"
import Layout from "@theme/Layout"
import Head from "@docusaurus/Head"
import { useCurrentUser } from "@site/src/hooks"
import { useConfig } from "@site/src/contexts/config"
import { PromptGeneratorApp } from "@site/src/components/PromptGenerator"
import styles from "./prompt-generator.module.css"

function AuthGate({ baseDomain }: { baseDomain: string }) {
  const loginUrl = `https://accounts.${baseDomain}/login?redirectTo=${encodeURIComponent("/prompt-generator")}`

  return (
    <div className={styles.authGate}>
      <div className={styles.authGateInner}>
        <div className={styles.authGateIcon} aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="var(--brand-purple-100)" />
            <path
              d="M10 14v-3a6 6 0 1112 0v3"
              stroke="var(--brand-purple-500)"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            <rect
              x="8"
              y="14"
              width="16"
              height="11"
              rx="2"
              stroke="var(--brand-purple-500)"
              strokeWidth="1.75"
            />
            <circle cx="16" cy="19.5" r="1.5" fill="var(--brand-purple-500)" />
          </svg>
        </div>
        <h1 className={styles.authGateTitle}>Sign in to use the Prompt Generator</h1>
        <p className={styles.authGateBody}>
          The Prompt Generator connects to the{" "}
          <a
            href="https://github.com/upbound/marketplace-mcp-server"
            target="_blank"
            rel="noopener noreferrer"
          >
            Upbound Marketplace MCP server
          </a>{" "}
          using your session to fetch real provider schemas, CRD resource types, and YAML examples.
          It then generates a ready-to-use prompt you can paste into Claude or any MCP-compatible AI client.
        </p>
        <a href={loginUrl} className={styles.authGateButton}>
          Sign in to Upbound
        </a>
        <p className={styles.authGateSignup}>
          Don&apos;t have an account?{" "}
          <a href={`https://accounts.${baseDomain}/register`}>Sign up free</a>
        </p>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className={styles.loading}>
      <span className={styles.loadingSpinner} />
    </div>
  )
}

const isDev =
  typeof window !== "undefined" && window.location.hostname === "localhost"

export default function PromptGeneratorPage() {
  const { isAuthenticated, isLoading } = useCurrentUser()
  const { baseDomain } = useConfig()

  const showApp = isDev || isAuthenticated

  return (
    <Layout title="MCP Prompt Generator" description="Generate optimized prompts for the Upbound Marketplace MCP server based on your infrastructure requirements and real provider schemas.">
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderInner}>
          <span className={styles.badge}>MCP</span>
          <h1 className={styles.pageTitle}>Prompt Generator</h1>
          <p className={styles.pageSubtitle}>
            Search the marketplace, select providers and resource types, then copy an optimized
            prompt for use with the{" "}
            <a
              href="https://github.com/upbound/marketplace-mcp-server"
              target="_blank"
              rel="noopener noreferrer"
            >
              Upbound Marketplace MCP server
            </a>
            .
          </p>
          {isDev && (
            <p className={styles.devNotice}>
              Dev mode — auth gate bypassed. Marketplace API calls require a valid session on{" "}
              <code>*.upbound.io</code> and will fail on localhost.
            </p>
          )}
        </div>
      </div>

      {isLoading && !isDev ? (
        <LoadingState />
      ) : showApp ? (
        <PromptGeneratorApp />
      ) : (
        <AuthGate baseDomain={baseDomain} />
      )}
    </Layout>
  )
}
