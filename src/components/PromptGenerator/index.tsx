import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react"
import { useConfig } from "@site/src/contexts/config"
import { API_CONFIG } from "@site/src/contexts/config"
import styles from "./styles.module.css"

// ─── Types ────────────────────────────────────────────────────────────────────

type ResourceCategory =
  | "compute"
  | "storage"
  | "database"
  | "networking"
  | "iam"
  | "monitoring"
  | "messaging"
  | "dns"

interface SearchResult {
  account: string
  name: string
  currentVersion?: string
  label?: string
  packageType?: string
  tier?: string
}

interface CRDResource {
  group: string
  kind: string
  pluralName?: string
  selected: boolean
}

interface SelectedPackage {
  account: string
  name: string
  version: string
  resources: CRDResource[]
  loadingResources: boolean
  resourceError: boolean
}

interface Requirements {
  description: string
  resourceCategories: ResourceCategory[]
  compositionStyle: "xrd" | "simple"
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RESOURCE_CATEGORIES: {
  id: ResourceCategory
  label: string
  emoji: string
}[] = [
  { id: "compute", label: "Compute", emoji: "⚡" },
  { id: "storage", label: "Storage", emoji: "🗄️" },
  { id: "database", label: "Database", emoji: "🛢️" },
  { id: "networking", label: "Networking", emoji: "🌐" },
  { id: "iam", label: "IAM & Security", emoji: "🔒" },
  { id: "monitoring", label: "Monitoring", emoji: "📊" },
  { id: "messaging", label: "Messaging", emoji: "📨" },
  { id: "dns", label: "DNS", emoji: "🔗" },
]

// ─── Prompt generation ────────────────────────────────────────────────────────

function generatePrompt(
  req: Requirements,
  packages: SelectedPackage[]
): string {
  const hasPackages = packages.length > 0
  const hasCategories = req.resourceCategories.length > 0
  const selectedResources = packages.flatMap((pkg) =>
    pkg.resources.filter((r) => r.selected).map((r) => ({ ...r, pkg }))
  )
  const hasSelectedResources = selectedResources.length > 0

  const isEmpty =
    !req.description &&
    !hasPackages &&
    !hasCategories

  if (isEmpty) {
    return [
      "You have access to the Upbound Marketplace MCP server tools.",
      "",
      "Fill in your requirements and select marketplace packages to generate a tailored prompt.",
      "",
      "## Available MCP Tools",
      "",
      "- `search_packages` — search the marketplace for providers and configurations",
      "- `get_package_metadata` — get details and CRD list for a package",
      "- `get_package_version_resources` — list all resource types in a package version",
      "- `get_package_version_groupkind_resources` — get full schema for a specific resource",
      "- `get_package_version_examples` — fetch YAML examples for a resource type",
      "- `get_package_assets` — fetch docs, readme, or release notes",
    ].join("\n")
  }

  const lines: string[] = []

  lines.push(
    "You have access to the Upbound Marketplace MCP server tools. Help me build Crossplane infrastructure.",
    ""
  )

  // Requirements
  lines.push("## My Infrastructure Requirements", "")
  if (req.description) lines.push(req.description, "")
  if (hasCategories) {
    const catNames = req.resourceCategories
      .map((c) => RESOURCE_CATEGORIES.find((rc) => rc.id === c)?.label)
      .filter(Boolean)
      .join(", ")
    lines.push(`**Resource types needed:** ${catNames}`)
  }
  lines.push("")

  // Step 1: Providers
  lines.push("## Step 1 — Discover and Inspect Providers", "")
  if (hasPackages) {
    lines.push(
      "I have already identified the following packages from the Upbound Marketplace. Start by fetching their metadata and documentation:"
    )
    packages.forEach((pkg) => {
      lines.push(
        "",
        `### ${pkg.account}/${pkg.name} @ ${pkg.version}`,
        `- \`get_package_metadata\` with account="${pkg.account}", repository="${pkg.name}"`,
        `- \`get_package_assets\` with account="${pkg.account}", repository="${pkg.name}", version="${pkg.version}", asset_type="docs"`,
        `- \`get_package_assets\` with account="${pkg.account}", repository="${pkg.name}", version="${pkg.version}", asset_type="readme"`
      )
    })
  } else {
    lines.push(
      "Use `search_packages` to find providers that match my requirements."
    )
    if (hasCategories) {
      const terms = req.resourceCategories.slice(0, 3).join(", ")
      lines.push(`Try search terms like: ${terms}.`)
    }
  }
  lines.push("")

  // Step 2: Schemas
  lines.push("## Step 2 — Fetch Resource Schemas", "")
  if (hasSelectedResources) {
    lines.push(
      "Fetch the full schema for each of these specific resource types I need:"
    )
    selectedResources.forEach(({ group, kind, pkg }) => {
      lines.push(
        `- **${group}/${kind}** from ${pkg.account}/${pkg.name}@${pkg.version}`,
        `  → \`get_package_version_groupkind_resources\` with account="${pkg.account}", repository_name="${pkg.name}", version="${pkg.version}", resource_group="${group}", resource_kind="${kind}"`
      )
    })
  } else if (hasPackages) {
    packages.forEach((pkg) => {
      lines.push(
        `- List all resource types in **${pkg.account}/${pkg.name}@${pkg.version}**:`,
        `  → \`get_package_version_resources\` with account="${pkg.account}", repository_name="${pkg.name}", version="${pkg.version}"`
      )
      if (hasCategories) {
        const catNames = req.resourceCategories
          .map((c) => RESOURCE_CATEGORIES.find((rc) => rc.id === c)?.label)
          .filter(Boolean)
          .join(", ")
        lines.push(
          `  Then fetch schemas for resources related to: ${catNames}.`
        )
      }
    })
  } else {
    lines.push(
      "For each provider found, call `get_package_version_resources` to list available resource types.",
      hasCategories
        ? `Focus on resources related to: ${req.resourceCategories.map((c) => RESOURCE_CATEGORIES.find((rc) => rc.id === c)?.label).filter(Boolean).join(", ")}.`
        : "",
      "Then call `get_package_version_groupkind_resources` for each resource you plan to use."
    )
  }
  lines.push("")

  // Step 3: Examples
  lines.push("## Step 3 — Fetch YAML Examples", "")
  if (hasSelectedResources) {
    lines.push("Get working YAML examples for each resource I selected:")
    selectedResources.forEach(({ group, kind, pkg }) => {
      lines.push(
        `- \`get_package_version_examples\` with account="${pkg.account}", repository_name="${pkg.name}", version="${pkg.version}", resource_group="${group}", resource_kind="${kind}"`
      )
    })
  } else {
    lines.push(
      "For each resource type you plan to use, call `get_package_version_examples` to retrieve working YAML.",
      "Use these as the reference implementation — they show correct field names, types, and structure."
    )
  }
  lines.push("")

  // Step 4: Create
  lines.push("## Step 4 — Create the Crossplane Resources", "")
  if (req.compositionStyle === "xrd") {
    lines.push(
      "Using the schemas and examples above, produce:",
      "",
      "1. **CompositeResourceDefinition (XRD)** — the API surface users will interact with",
      "2. **Composition** — maps XRD fields to managed resources via patches",
      "3. **Claim example** — a minimal YAML to provision the infrastructure",
      "",
      "Composition requirements:",
      "- Use `fromCompositeFieldPath` patches to wire XRD fields into managed resource specs",
      "- Include a `ProviderConfig` reference in each managed resource",
      "- Add readiness checks (`type: MatchString`) where the provider supports status conditions",
      "- Use `crossplane.io/external-name` annotations to control cloud resource naming where needed"
    )
  } else {
    lines.push(
      "Using the schemas and examples above, produce a set of managed resource manifests:",
      "",
      "- One manifest per resource type",
      "- Include a `ProviderConfig` reference in each",
      "- Use realistic field values consistent with my requirements"
    )
  }

  if (req.description) {
    lines.push(
      "",
      `The end result must satisfy: *${req.description.trim()}*`
    )
  }

  return lines.filter((l) => l !== undefined).join("\n")
}

// ─── MarketplaceSearch ────────────────────────────────────────────────────────

function useMarketplaceApi() {
  const { baseDomain } = useConfig()
  const baseUrl = `https://marketplace.${baseDomain}`

  const marketplaceFetch = useCallback(
    async <T,>(path: string, signal?: AbortSignal): Promise<T> => {
      const res = await fetch(`${baseUrl}${path}`, {
        credentials: API_CONFIG.credentials,
        headers: API_CONFIG.headers,
        signal,
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    },
    [baseUrl]
  )

  return marketplaceFetch
}

// ─── Package search component ─────────────────────────────────────────────────

interface PackageSearchProps {
  onSelect: (pkg: SearchResult) => void
  selectedIds: Set<string>
}

function PackageSearch({ onSelect, selectedIds }: PackageSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const marketplaceFetch = useMarketplaceApi()
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setError(null)
      return
    }

    const timer = setTimeout(async () => {
      abortRef.current?.abort()
      const ctrl = new AbortController()
      abortRef.current = ctrl

      setLoading(true)
      setError(null)

      try {
        // Try v2 search endpoint first
        const data = await marketplaceFetch<any>(
          `/v2/search?q=${encodeURIComponent(query)}&onlyLatestVersions=true`,
          ctrl.signal
        )

        // Handle different possible response shapes
        const items: SearchResult[] = (
          data?.packages ||
          data?.items ||
          data?.results ||
          (Array.isArray(data) ? data : [])
        ).map((item: any) => ({
          account: item.account || item.organizationName || item.owner || "",
          name:
            item.name ||
            item.repository ||
            item.repositoryName ||
            item.packageName ||
            "",
          currentVersion:
            item.currentVersion?.name ||
            item.latestVersion ||
            item.version ||
            "latest",
          label: item.label || item.displayName || item.title,
          packageType: item.packageType || item.type,
          tier: item.tier,
        })).filter((r: SearchResult) => r.account && r.name)

        setResults(items.slice(0, 8))
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError("Search unavailable — check that you are signed in to Upbound.")
        }
      } finally {
        setLoading(false)
      }
    }, 350)

    return () => {
      clearTimeout(timer)
      abortRef.current?.abort()
    }
  }, [query, marketplaceFetch])

  return (
    <div className={styles.searchBox}>
      <div className={styles.searchInputWrap}>
        <svg
          className={styles.searchIcon}
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M10.5 10.5L14 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search marketplace providers and configurations…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
        {loading && <span className={styles.spinner} />}
      </div>

      {error && <p className={styles.searchError}>{error}</p>}

      {results.length > 0 && (
        <ul className={styles.searchResults}>
          {results.map((pkg) => {
            const id = `${pkg.account}/${pkg.name}`
            const isSelected = selectedIds.has(id)
            return (
              <li key={id} className={styles.searchResultItem}>
                <button
                  className={`${styles.searchResultBtn} ${isSelected ? styles.searchResultBtnSelected : ""}`}
                  onClick={() => !isSelected && onSelect(pkg)}
                  disabled={isSelected}
                >
                  <div className={styles.searchResultMain}>
                    <span className={styles.searchResultName}>{id}</span>
                    {pkg.currentVersion && (
                      <span className={styles.searchResultVersion}>
                        {pkg.currentVersion}
                      </span>
                    )}
                  </div>
                  <div className={styles.searchResultMeta}>
                    {pkg.tier && (
                      <span
                        className={`${styles.badge} ${
                          pkg.tier === "official"
                            ? styles.badgeOfficial
                            : pkg.tier === "upbound"
                              ? styles.badgeUpbound
                              : styles.badgeCommunity
                        }`}
                      >
                        {pkg.tier}
                      </span>
                    )}
                    {pkg.packageType && (
                      <span className={styles.badgeType}>{pkg.packageType}</span>
                    )}
                    {isSelected && (
                      <span className={styles.badgeAdded}>Added</span>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

// ─── Selected package row ─────────────────────────────────────────────────────

interface SelectedPackageRowProps {
  pkg: SelectedPackage
  onRemove: () => void
  onToggleResource: (group: string, kind: string) => void
}

function SelectedPackageRow({
  pkg,
  onRemove,
  onToggleResource,
}: SelectedPackageRowProps) {
  const [expanded, setExpanded] = useState(true)
  const selectedCount = pkg.resources.filter((r) => r.selected).length

  return (
    <div className={styles.pkgRow}>
      <div className={styles.pkgRowHeader}>
        <button
          className={styles.pkgExpandBtn}
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}
          >
            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={styles.pkgName}>
            {pkg.account}/{pkg.name}
          </span>
          <span className={styles.pkgVersion}>{pkg.version}</span>
          {selectedCount > 0 && (
            <span className={styles.pkgResourceCount}>
              {selectedCount} resource{selectedCount !== 1 ? "s" : ""} selected
            </span>
          )}
        </button>
        <button
          className={styles.pkgRemoveBtn}
          onClick={onRemove}
          aria-label={`Remove ${pkg.account}/${pkg.name}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className={styles.pkgResources}>
          {pkg.loadingResources && (
            <div className={styles.pkgLoading}>
              <span className={styles.spinner} />
              <span>Loading resource types…</span>
            </div>
          )}
          {pkg.resourceError && (
            <p className={styles.pkgError}>
              Could not load resource types. The prompt will reference this package without specific CRDs.
            </p>
          )}
          {!pkg.loadingResources && !pkg.resourceError && pkg.resources.length === 0 && (
            <p className={styles.pkgEmpty}>No resource types found in this package version.</p>
          )}
          {!pkg.loadingResources && pkg.resources.length > 0 && (
            <>
              <p className={styles.pkgResourcesHint}>
                Select the resource types you need — they will be included in the generated prompt:
              </p>
              <div className={styles.resourceGrid}>
                {pkg.resources.map((res) => (
                  <label
                    key={`${res.group}/${res.kind}`}
                    className={`${styles.resourceChip} ${res.selected ? styles.resourceChipSelected : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={res.selected}
                      onChange={() => onToggleResource(res.group, res.kind)}
                      className={styles.resourceCheckbox}
                    />
                    <span className={styles.resourceKind}>{res.kind}</span>
                    <span className={styles.resourceGroup}>{res.group}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main app ─────────────────────────────────────────────────────────────────

export function PromptGeneratorApp() {
  const marketplaceFetch = useMarketplaceApi()

  const [requirements, setRequirements] = useState<Requirements>({
    description: "",
    resourceCategories: [],
    compositionStyle: "xrd",
  })
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackage[]>([])
  const [copied, setCopied] = useState(false)

  const selectedIds = useMemo(
    () => new Set(selectedPackages.map((p) => `${p.account}/${p.name}`)),
    [selectedPackages]
  )

  const handleSelectPackage = useCallback(
    async (pkg: SearchResult) => {
      const version = pkg.currentVersion || "latest"

      const newPkg: SelectedPackage = {
        account: pkg.account,
        name: pkg.name,
        version,
        resources: [],
        loadingResources: true,
        resourceError: false,
      }

      setSelectedPackages((prev) => [...prev, newPkg])

      try {
        const data = await marketplaceFetch<any>(
          `/v1/packages/${pkg.account}/${pkg.name}/${version}/resources`
        )

        const resources: CRDResource[] = (
          data?.resources ||
          data?.items ||
          (Array.isArray(data) ? data : [])
        ).map((r: any) => ({
          group: r.group || r.resourceGroup || r.apiGroup || "",
          kind: r.kind || r.resourceKind || "",
          pluralName: r.pluralName,
          selected: false,
        })).filter((r: CRDResource) => r.group && r.kind)

        setSelectedPackages((prev) =>
          prev.map((p) =>
            p.account === pkg.account && p.name === pkg.name
              ? { ...p, resources, loadingResources: false }
              : p
          )
        )
      } catch {
        setSelectedPackages((prev) =>
          prev.map((p) =>
            p.account === pkg.account && p.name === pkg.name
              ? { ...p, loadingResources: false, resourceError: true }
              : p
          )
        )
      }
    },
    [marketplaceFetch]
  )

  const handleRemovePackage = useCallback((account: string, name: string) => {
    setSelectedPackages((prev) =>
      prev.filter((p) => !(p.account === account && p.name === name))
    )
  }, [])

  const handleToggleResource = useCallback(
    (account: string, name: string, group: string, kind: string) => {
      setSelectedPackages((prev) =>
        prev.map((p) =>
          p.account === account && p.name === name
            ? {
                ...p,
                resources: p.resources.map((r) =>
                  r.group === group && r.kind === kind
                    ? { ...r, selected: !r.selected }
                    : r
                ),
              }
            : p
        )
      )
    },
    []
  )

  const toggleCategory = useCallback((cat: ResourceCategory) => {
    setRequirements((prev) => ({
      ...prev,
      resourceCategories: prev.resourceCategories.includes(cat)
        ? prev.resourceCategories.filter((c) => c !== cat)
        : [...prev.resourceCategories, cat],
    }))
  }, [])

  const prompt = useMemo(
    () => generatePrompt(requirements, selectedPackages),
    [requirements, selectedPackages]
  )

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(prompt)
    } catch {
      const el = document.createElement("textarea")
      el.value = prompt
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [prompt])

  return (
    <div className={styles.app}>
      {/* ── Left panel ── */}
      <div className={styles.panel}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>What do you want to build?</h2>
          <textarea
            className={styles.textarea}
            value={requirements.description}
            onChange={(e) =>
              setRequirements((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="e.g. An S3 bucket with versioning, an RDS PostgreSQL database, and IAM roles for EKS pods to access both"
            rows={4}
          />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Resource types</h2>
          <div className={styles.chips}>
            {RESOURCE_CATEGORIES.map((cat) => {
              const active = requirements.resourceCategories.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <span aria-hidden="true">{cat.emoji}</span> {cat.label}
                </button>
              )
            })}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Search marketplace packages</h2>
          <PackageSearch
            onSelect={handleSelectPackage}
            selectedIds={selectedIds}
          />
        </section>

        {selectedPackages.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Selected packages</h2>
            <div className={styles.pkgList}>
              {selectedPackages.map((pkg) => (
                <SelectedPackageRow
                  key={`${pkg.account}/${pkg.name}`}
                  pkg={pkg}
                  onRemove={() => handleRemovePackage(pkg.account, pkg.name)}
                  onToggleResource={(group, kind) =>
                    handleToggleResource(pkg.account, pkg.name, group, kind)
                  }
                />
              ))}
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Output style</h2>
          <div className={styles.radioGroup}>
            <label
              className={`${styles.radio} ${requirements.compositionStyle === "xrd" ? styles.radioActive : ""}`}
            >
              <input
                type="radio"
                name="compositionStyle"
                value="xrd"
                checked={requirements.compositionStyle === "xrd"}
                onChange={() =>
                  setRequirements((prev) => ({
                    ...prev,
                    compositionStyle: "xrd",
                  }))
                }
              />
              <div>
                <span className={styles.radioLabel}>XRD + Composition</span>
                <span className={styles.radioHint}>
                  Reusable abstraction layer for platform teams
                </span>
              </div>
            </label>
            <label
              className={`${styles.radio} ${requirements.compositionStyle === "simple" ? styles.radioActive : ""}`}
            >
              <input
                type="radio"
                name="compositionStyle"
                value="simple"
                checked={requirements.compositionStyle === "simple"}
                onChange={() =>
                  setRequirements((prev) => ({
                    ...prev,
                    compositionStyle: "simple",
                  }))
                }
              />
              <div>
                <span className={styles.radioLabel}>Managed resources</span>
                <span className={styles.radioHint}>
                  Direct resource manifests, no abstraction
                </span>
              </div>
            </label>
          </div>
        </section>
      </div>

      {/* ── Right panel ── */}
      <div className={styles.outputPanel}>
        <div className={styles.outputHeader}>
          <span className={styles.outputTitle}>Generated prompt</span>
          <button
            className={`${styles.copyButton} ${copied ? styles.copyButtonSuccess : ""}`}
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8l3.5 3.5L13 4"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v6A1.5 1.5 0 003.5 11H5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                Copy prompt
              </>
            )}
          </button>
        </div>
        <pre className={styles.promptText}>{prompt}</pre>
      </div>
    </div>
  )
}
