/**
 * Resolves a doc URL from a docId, approximating Docusaurus's internal URL resolution.
 *
 * Docusaurus handles doc-type navbar items internally via the `useActiveDocContext`
 * and `useDocById` hooks, which resolve docId to the correct URL path. When using
 * custom components (like @upbound/elements) that don't integrate with Docusaurus's
 * doc plugin, we need to manually construct these URLs.
 *
 * Standard Docusaurus behaviors this function replicates:
 * - Index pages: `reference/index` → `/reference/` (index.md is the directory default)
 * - Trailing slashes: Adds trailing slash to match `trailingSlash: true` in docusaurus.config.js
 * - Base path: Assumes docs are served from root (`routeBasePath: "/"`)
 *
 * NOTE: This function cannot handle custom `slug` frontmatter overrides.
 * Docs with custom slugs should use `to` instead of `docId` in navbar config.
 *
 * @param docId - The document ID from navbar config (e.g., "reference/index")
 * @returns The resolved URL path with proper trailing slash
 *
 * @example
 * resolveDocUrl("reference/index") // → "/reference/"
 */
export function resolveDocUrl(docId: string): string {
  let href = `/${docId}`

  // Handle index pages - index.md serves as directory root in Docusaurus
  // e.g., /reference/index → /reference/
  if (href === "/index") {
    href = "/"
  } else if (href.endsWith("/index")) {
    href = href.replace(/\/index$/, "/")
  } else {
    // Add trailing slash to match Docusaurus trailingSlash config
    href = `${href}/`
  }

  return href
}
