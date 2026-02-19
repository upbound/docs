/**
 * Swizzled SearchBar — federated search across `upbound` + `pylon-kb`.
 *
 * Every query is fanned out to both Algolia indices simultaneously.
 * Pylon KB hits are remapped to the DocSearch hierarchy shape and appended
 * to the result set, appearing under a "Knowledge Base" section header.
 *
 * Based on @docusaurus/theme-search-algolia SearchBar (3.9.x).
 * Changes from the original are marked [CHANGE].
 */

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {createPortal} from 'react-dom';
import {DocSearchButton} from '@docsearch/react/button';
import {useDocSearchKeyboardEvents} from '@docsearch/react/useDocSearchKeyboardEvents';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {useHistory} from '@docusaurus/router';
import {
  isRegexpStringMatch,
  useSearchLinkCreator,
} from '@docusaurus/theme-common';
import {
  useAlgoliaContextualFacetFilters,
  useSearchResultUrlProcessor,
  useAlgoliaAskAi,
  mergeFacetFilters,
} from '@docusaurus/theme-search-algolia/client';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import translations from '@theme/SearchTranslations';
import type {
  InternalDocSearchHit,
  DocSearchModal as DocSearchModalType,
  DocSearchModalProps,
  StoredDocSearchHit,
  DocSearchTransformClient,
  DocSearchHit,
  DocSearchTranslations,
  UseDocSearchKeyboardEventsProps,
} from '@docsearch/react';
import type {AutocompleteState} from '@algolia/autocomplete-core';
import type {FacetFilters} from 'algoliasearch/lite';
import type {ThemeConfigAlgolia} from '@docusaurus/theme-search-algolia';

// ---------------------------------------------------------------------------
// [CHANGE] Pylon KB federated search
// ---------------------------------------------------------------------------
const PYLON_INDEX  = 'pylon-kb';
const PYLON_HITS   = 5;
const PYLON_PORTAL = 'https://help.upbound.io';

function toAbsoluteUrl(url: string): string {
  if (!url) return '';
  if (/^https?:\/\//.test(url)) return url;
  return `${PYLON_PORTAL}${url.startsWith('/') ? '' : '/'}${url}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function remapPylonHit(hit: any) {
  return {
    ...hit,
    // Ensure the URL is absolute so the navigator routes it externally.
    // The index may still contain relative paths from an earlier sync.
    url: toAbsoluteUrl(hit.url ?? ''),
    type: 'content' as const,
    hierarchy: {
      lvl0: 'Knowledge Base',
      lvl1: hit.title ?? '',
      lvl2: null,
      lvl3: null,
      lvl4: null,
      lvl5: null,
      lvl6: null,
    },
    content:
      hit.excerpt ??
      (typeof hit.content === 'string' ? hit.content.slice(0, 200) : null),
    _highlightResult: {
      hierarchy: {
        lvl0: {value: 'Knowledge Base', matchLevel: 'none', matchedWords: []},
        lvl1:
          hit._highlightResult?.title ?? {
            value: hit.title ?? '',
            matchLevel: 'none',
            matchedWords: [],
          },
      },
      content:
        hit._highlightResult?.excerpt ??
        hit._highlightResult?.content ?? {
          value: hit.excerpt ?? '',
          matchLevel: 'none',
          matchedWords: [],
        },
    },
    _snippetResult: {
      content:
        hit._snippetResult?.content ?? {
          value: (hit.excerpt ?? '').slice(0, 100),
          matchLevel: 'none',
        },
    },
  };
}

function withPylonKB(
  searchClient: DocSearchTransformClient,
): DocSearchTransformClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const originalSearch = (searchClient as any).search.bind(searchClient);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (searchClient as any).search = async function (requests: any) {
    const isArray = Array.isArray(requests);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const list: any[] = isArray ? requests : (requests?.requests ?? []);
    const query: string =
      list[0]?.query ?? list[0]?.params?.query ?? '';

    if (!query.trim()) {
      return originalSearch(requests);
    }

    const pylonReq = isArray
      ? [{
          indexName: PYLON_INDEX,
          query,
          params: {
            hitsPerPage: PYLON_HITS,
            attributesToHighlight: ['title', 'excerpt'],
            attributesToSnippet: ['content:15'],
          },
        }]
      : {
          requests: [{
            indexName: PYLON_INDEX,
            query,
            hitsPerPage: PYLON_HITS,
            attributesToHighlight: ['title', 'excerpt'],
            attributesToSnippet: ['content:15'],
          }],
        };

    const [main, pylon] = await Promise.all([
      originalSearch(requests),
      originalSearch(pylonReq).catch(() => null),
    ]);

    if (!pylon) return main;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pylonHits: any[] = pylon.results?.[0]?.hits ?? [];
    if (pylonHits.length === 0) return main;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any[] = Array.isArray(main.results) ? [...main.results] : [];
    if (results.length > 0) {
      results[0] = {
        ...results[0],
        hits: [...(results[0].hits ?? []), ...pylonHits.map(remapPylonHit)],
        nbHits: (results[0].nbHits ?? 0) + pylonHits.length,
      };
    }

    return {...main, results};
  };

  return searchClient;
}

// ---------------------------------------------------------------------------
// Original SearchBar — minimal changes below
// ---------------------------------------------------------------------------

type DocSearchProps = Omit<DocSearchModalProps, 'onClose' | 'initialScrollY'> & {
  contextualSearch?: string;
  externalUrlRegex?: string;
  searchPagePath: boolean | string;
  askAi?: Exclude<
    (DocSearchModalProps & {askAi: unknown})['askAi'],
    string | undefined
  >;
};

interface DocSearchV4Props extends DocSearchProps {
  indexName: string;
  askAi?: ThemeConfigAlgolia['askAi'];
  translations?: DocSearchTranslations;
}

let DocSearchModal: typeof DocSearchModalType | null = null;

function importDocSearchModalIfNeeded() {
  if (DocSearchModal) return Promise.resolve();
  return Promise.all([
    import('@docsearch/react/modal'),
    import('@docsearch/react/style'),
    import('./styles.css'),
  ]).then(([{DocSearchModal: Modal}]) => {
    DocSearchModal = Modal;
  });
}

// [CHANGE] treat any absolute URL (Pylon KB articles) as external so
// React Router doesn't try to handle them as internal SPA paths.
function useNavigator({externalUrlRegex}: Pick<DocSearchProps, 'externalUrlRegex'>) {
  const history = useHistory();
  const [navigator] = useState<DocSearchModalProps['navigator']>(() => ({
    navigate(params) {
      const {itemUrl} = params;
      if (/^https?:\/\//.test(itemUrl) || isRegexpStringMatch(externalUrlRegex, itemUrl)) {
        window.location.href = itemUrl;
      } else {
        history.push(itemUrl);
      }
    },
  }));
  return navigator;
}

function useTransformSearchClient(): DocSearchModalProps['transformSearchClient'] {
  const {siteMetadata: {docusaurusVersion}} = useDocusaurusContext();
  return useCallback(
    (searchClient: DocSearchTransformClient) => {
      searchClient.addAlgoliaAgent('docusaurus', docusaurusVersion);
      return searchClient;
    },
    [docusaurusVersion],
  );
}

function useTransformItems(props: Pick<DocSearchProps, 'transformItems'>) {
  const processSearchResultUrl = useSearchResultUrlProcessor();
  const [transformItems] = useState<DocSearchModalProps['transformItems']>(() =>
    (items: DocSearchHit[]) => {
      if (props.transformItems) return props.transformItems(items);
      return items.map((item) => {
        // Pylon KB hits have absolute external URLs — don't let
        // processSearchResultUrl turn them into relative site paths.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((item as any).objectID?.startsWith('pylon-')) return item;
        return {...item, url: processSearchResultUrl(item.url)};
      });
    },
  );
  return transformItems;
}

function useResultsFooterComponent({closeModal}: {closeModal: () => void}): DocSearchProps['resultsFooterComponent'] {
  return useMemo(
    () => ({state}) => <ResultsFooter state={state} onClose={closeModal} />,
    [closeModal],
  );
}

function Hit({
  hit,
  children,
}: {
  hit: InternalDocSearchHit | StoredDocSearchHit;
  children: ReactNode;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((hit as any).objectID?.startsWith('pylon-')) {
    // Render as a plain anchor so the browser handles navigation directly,
    // bypassing React Router. URL is guaranteed absolute by remapPylonHit.
    return <a href={hit.url} target="_blank" rel="noopener noreferrer">{children}</a>;
  }
  return <Link to={hit.url}>{children}</Link>;
}

type ResultsFooterProps = {
  state: AutocompleteState<InternalDocSearchHit>;
  onClose: () => void;
};

function ResultsFooter({state, onClose}: ResultsFooterProps) {
  const createSearchLink = useSearchLinkCreator();
  return (
    <Link to={createSearchLink(state.query)} onClick={onClose}>
      <Translate id="theme.SearchBar.seeAll" values={{count: state.context.nbHits}}>
        {'See all {count} results'}
      </Translate>
    </Link>
  );
}

function useSearchParameters({contextualSearch, ...props}: DocSearchProps): DocSearchProps['searchParameters'] {
  const contextualSearchFacetFilters = useAlgoliaContextualFacetFilters();
  const configFacetFilters: FacetFilters = props.searchParameters?.facetFilters ?? [];
  const facetFilters: FacetFilters = contextualSearch
    ? mergeFacetFilters(contextualSearchFacetFilters, configFacetFilters)
    : configFacetFilters;
  return {...props.searchParameters, facetFilters};
}

function DocSearch({externalUrlRegex, ...props}: DocSearchV4Props) {
  const navigator          = useNavigator({externalUrlRegex});
  const searchParameters   = useSearchParameters({...props});
  const transformItems     = useTransformItems(props);
  const addAgentTransform  = useTransformSearchClient();

  // [CHANGE] chain: add-agent → user-provided (if any) → Pylon KB fan-out
  const userTransform = (props as DocSearchV4Props).transformSearchClient;
  const transformSearchClient = useCallback(
    (client: DocSearchTransformClient) =>
      withPylonKB(
        userTransform ? userTransform(addAgentTransform(client)) : addAgentTransform(client),
      ),
    [addAgentTransform, userTransform],
  );

  const searchContainer  = useRef<HTMLDivElement | null>(null);
  const searchButtonRef  = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen]               = useState(false);
  const [initialQuery, setInitialQuery]   = useState<string | undefined>(undefined);

  const {isAskAiActive, currentPlaceholder, onAskAiToggle, extraAskAiProps} =
    useAlgoliaAskAi(props);

  const prepareSearchContainer = useCallback(() => {
    if (!searchContainer.current) {
      const div = document.createElement('div');
      searchContainer.current = div;
      document.body.insertBefore(div, document.body.firstChild);
    }
  }, []);

  const openModal = useCallback(() => {
    prepareSearchContainer();
    importDocSearchModalIfNeeded().then(() => setIsOpen(true));
  }, [prepareSearchContainer]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    searchButtonRef.current?.focus();
    setInitialQuery(undefined);
    onAskAiToggle(false);
  }, [onAskAiToggle]);

  const handleInput = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'f' && (event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setInitialQuery(event.key);
      openModal();
    },
    [openModal],
  );

  const resultsFooterComponent = useResultsFooterComponent({closeModal});

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen: openModal,
    onClose: closeModal,
    onInput: handleInput,
    searchButtonRef,
    isAskAiActive: isAskAiActive ?? false,
    onAskAiToggle: onAskAiToggle ?? (() => {}),
  } satisfies UseDocSearchKeyboardEventsProps & {
    isAskAiActive: boolean;
    onAskAiToggle: (askAiToggle: boolean) => void;
  } as UseDocSearchKeyboardEventsProps);

  return (
    <>
      <Head>
        <link
          rel="preconnect"
          href={`https://${props.appId}-dsn.algolia.net`}
          crossOrigin="anonymous"
        />
      </Head>

      <DocSearchButton
        onTouchStart={importDocSearchModalIfNeeded}
        onFocus={importDocSearchModalIfNeeded}
        onMouseOver={importDocSearchModalIfNeeded}
        onClick={openModal}
        ref={searchButtonRef}
        translations={props.translations?.button ?? translations.button}
      />

      {isOpen && DocSearchModal && searchContainer.current &&
        createPortal(
          <DocSearchModal
            onClose={closeModal}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            navigator={navigator}
            transformItems={transformItems}
            hitComponent={Hit}
            {...(props.searchPagePath && {resultsFooterComponent})}
            placeholder={currentPlaceholder}
            {...props}
            translations={props.translations?.modal ?? translations.modal}
            searchParameters={searchParameters}
            {...extraAskAiProps}
            // [CHANGE] always placed last so it wins over the {...props} spread
            transformSearchClient={transformSearchClient}
          />,
          searchContainer.current,
        )}
    </>
  );
}

export default function SearchBar(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return <DocSearch {...(siteConfig.themeConfig.algolia as DocSearchV4Props)} />;
}
