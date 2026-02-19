#!/usr/bin/env node
/**
 * sync-pylon-to-algolia.js
 *
 * Pulls articles from the Pylon Knowledge Base API and upserts them into an
 * Algolia index. Run once for a full sync, or on a schedule (e.g. cron/CI) to
 * keep the index up-to-date as articles are created or updated.
 *
 * Required environment variables:
 *   PYLON_API_KEY          - Pylon bearer token
 *   PYLON_KB_ID            - Knowledge-base ID to sync (or leave blank to sync all)
 *   ALGOLIA_APP_ID         - Algolia application ID
 *   ALGOLIA_ADMIN_API_KEY  - Algolia Admin API key (write access)
 *   ALGOLIA_INDEX_NAME     - Target index name (e.g. "pylon-kb")
 *
 * Optional environment variables:
 *   PYLON_VISIBILITY       - Comma-separated list of visibility values to include.
 *                            Valid values: public, customer, internal-only
 *                            Defaults to "public"
 *   SYNC_MODE              - "full" (default) clears stale records; "delta" only upserts
 */

'use strict';

const { algoliasearch } = require('algoliasearch');

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const PYLON_BASE_URL  = 'https://api.usepylon.com';
const PYLON_API_KEY   = process.env.PYLON_API_KEY;
const PYLON_KB_ID     = process.env.PYLON_KB_ID; // optional – empty means all KBs
const ALGOLIA_APP_ID  = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN   = process.env.ALGOLIA_ADMIN_API_KEY;
const INDEX_NAME      = process.env.ALGOLIA_INDEX_NAME || 'pylon-kb';
const ALLOWED_VIS     = (process.env.PYLON_VISIBILITY || 'public')
  .split(',')
  .map(v => v.trim().toLowerCase());
const SYNC_MODE       = (process.env.SYNC_MODE || 'full').toLowerCase();
// Base URL for the Pylon KB portal (used to make article URLs absolute).
// e.g. https://support.upbound.io
const PYLON_KB_PORTAL = (process.env.PYLON_KB_PORTAL_URL || '').replace(/\/$/, '');

// How many articles to request per page (API max is unspecified; 100 is safe)
const PAGE_LIMIT = 100;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
function assertEnv() {
  const missing = [];
  if (!PYLON_API_KEY)  missing.push('PYLON_API_KEY');
  if (!ALGOLIA_APP_ID) missing.push('ALGOLIA_APP_ID');
  if (!ALGOLIA_ADMIN)  missing.push('ALGOLIA_ADMIN_API_KEY');
  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Pylon API helpers
// ---------------------------------------------------------------------------
async function pylonFetch(path) {
  const url = `${PYLON_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${PYLON_API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Pylon API error ${res.status} for ${url}: ${body}`);
  }

  return res.json();
}

/** Return an array of all knowledge-base objects. */
async function fetchKnowledgeBases() {
  const data = await pylonFetch('/knowledge-bases');
  // The API returns either an array or { data: [...] }
  return Array.isArray(data) ? data : (data.data || []);
}

/** Fetch every article in a knowledge base, following cursor pagination. */
async function fetchAllArticles(kbId) {
  const articles = [];
  let cursor    = null;
  let page      = 0;

  do {
    page++;
    const qs    = new URLSearchParams({ limit: String(PAGE_LIMIT) });
    if (cursor) qs.set('cursor', cursor);

    const data  = await pylonFetch(`/knowledge-bases/${kbId}/articles?${qs}`);
    const items = Array.isArray(data) ? data : (data.data || []);
    articles.push(...items);

    // Advance cursor – adapt to whatever shape the API returns
    cursor = data.next_cursor || data.cursor || data.meta?.next_cursor || null;

    console.log(`  Page ${page}: fetched ${items.length} articles (total so far: ${articles.length})`);
  } while (cursor);

  return articles;
}

// ---------------------------------------------------------------------------
// HTML → plain-text (no external deps required)
// ---------------------------------------------------------------------------
function htmlToText(html) {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Build an excerpt (first ~300 chars of plain text content). */
function excerpt(text, max = 300) {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length <= max ? clean : `${clean.slice(0, max)}…`;
}

// ---------------------------------------------------------------------------
// Ensure article URLs are absolute so Algolia search results link correctly
// ---------------------------------------------------------------------------
function toAbsoluteUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;           // already absolute
  if (PYLON_KB_PORTAL) return `${PYLON_KB_PORTAL}${url.startsWith('/') ? '' : '/'}${url}`;
  return url; // no portal URL configured — leave as-is (will log a warning)
}

// ---------------------------------------------------------------------------
// Transform a Pylon article into an Algolia record
// ---------------------------------------------------------------------------
function toAlgoliaRecord(article, kb) {
  const bodyText = htmlToText(article.body || article.content || '');

  return {
    objectID:           `pylon-${kb.id}-${article.id}`,
    type:               'pylon-kb',
    title:              article.title || '',
    content:            bodyText,
    excerpt:            excerpt(bodyText),
    url:                toAbsoluteUrl(article.url || article.public_url || ''),
    slug:               article.slug || '',
    knowledge_base_id:  kb.id,
    knowledge_base_name: kb.name || kb.title || kb.display_name || '',
    collection_id:      article.collection_id || '',
    collection_name:    article.collection_name || '',
    visibility:         article.visibility || 'public',
    author:             article.author?.name || article.created_by?.name || '',
    created_at:         article.created_at || '',
    updated_at:         article.updated_at || '',
    // numeric version for Algolia date-range filters
    updated_at_ts: article.updated_at
      ? Math.floor(new Date(article.updated_at).getTime() / 1000)
      : 0,
  };
}

// ---------------------------------------------------------------------------
// Main sync logic
// ---------------------------------------------------------------------------
async function sync() {
  assertEnv();

  console.log(`\n=== Pylon → Algolia sync ===`);
  console.log(`Mode:       ${SYNC_MODE}`);
  console.log(`Index:      ${INDEX_NAME}`);
  console.log(`Visibility: ${ALLOWED_VIS.join(', ')}`);
  console.log('');

  // --- 1. Determine which knowledge bases to sync ---
  let kbs;
  if (PYLON_KB_ID) {
    console.log(`Fetching single knowledge base: ${PYLON_KB_ID}`);
    const kb = await pylonFetch(`/knowledge-bases/${PYLON_KB_ID}`);
    kbs = [kb];
  } else {
    console.log('Fetching all knowledge bases…');
    kbs = await fetchKnowledgeBases();
    console.log(`Found ${kbs.length} knowledge base(s)`);
  }

  // --- 2. Fetch all articles ---
  const allRecords = [];

  for (const kb of kbs) {
    const kbLabel = kb.name || kb.title || kb.display_name || kb.id;
    console.log(`\nKnowledge base: "${kbLabel}" (${kb.id})`);
    // Debug: surface unexpected shapes on first run
    if (!kb.name && !kb.title) {
      console.log('  [debug] KB keys:', Object.keys(kb).join(', '));
    }
    const articles = await fetchAllArticles(kb.id);

    for (const article of articles) {
      const vis = (article.visibility || 'public').toLowerCase();
      if (!ALLOWED_VIS.includes(vis)) {
        continue; // skip articles not in the allowed visibility list
      }
      allRecords.push(toAlgoliaRecord(article, kb));
    }

    console.log(`  → ${allRecords.length} total records after this KB`);
  }

  if (allRecords.length === 0) {
    console.warn('\nNo records to index. Check visibility filters and KB IDs.');
    return;
  }

  // --- 3. Push to Algolia ---
  // algoliasearch v5: no initIndex – all methods are on the client directly
  console.log(`\nConnecting to Algolia (app: ${ALGOLIA_APP_ID}, index: ${INDEX_NAME})…`);
  const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN);

  if (SYNC_MODE === 'full') {
    // Atomically replace all records; stale (deleted) articles are removed.
    console.log(`Full sync: replacing all ${allRecords.length} records…`);
    const result = await client.replaceAllObjects({
      indexName: INDEX_NAME,
      objects:   allRecords,
    });
    console.log(`✓ Indexed ${result.objectIDs?.length ?? allRecords.length} records.`);
  } else {
    // Delta: upsert only what we fetched (no stale-record cleanup)
    console.log(`Delta sync: upserting ${allRecords.length} records…`);
    const result = await client.saveObjects({
      indexName: INDEX_NAME,
      objects:   allRecords,
    });
    console.log(`✓ Upserted ${result.objectIDs?.length ?? allRecords.length} records.`);
  }

  console.log('\nSync complete.\n');
}

sync().catch(err => {
  console.error('Sync failed:', err.message || err);
  process.exit(1);
});
