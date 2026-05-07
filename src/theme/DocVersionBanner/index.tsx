import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { ThemeClassNames } from '@docusaurus/theme-common';
import {
  useActivePlugin,
  useDocVersionSuggestions,
  useDocsPreferredVersion,
  useDocsVersion,
  type GlobalVersion,
} from '@docusaurus/plugin-content-docs/client';
import type { Props } from '@theme/DocVersionBanner';
import type { PropVersionMetadata } from '@docusaurus/plugin-content-docs';

function getVersionMainDoc(version: GlobalVersion) {
  return version.docs.find((doc) => doc.id === version.mainDocId)!;
}

function DocVersionBannerEnabled({
  className,
  versionMetadata,
}: Props & { versionMetadata: PropVersionMetadata }): ReactNode {
  const { pluginId } = useActivePlugin({ failfast: true })!;
  const { savePreferredVersionName } = useDocsPreferredVersion(pluginId);
  const { latestDocSuggestion, latestVersionSuggestion } =
    useDocVersionSuggestions(pluginId);

  const latestDoc =
    latestDocSuggestion ?? getVersionMainDoc(latestVersionSuggestion);

  return (
    <div
      className={clsx(
        className,
        ThemeClassNames.docs.docVersionBanner,
        'alert alert--warning margin-bottom--md',
      )}
      role="alert"
    >
      {/* Edit the banner content below */}
      <div>
        You are viewing documentation for Spaces version{' '}
        <b>{versionMetadata.label}</b>.
      </div>
      <div className="margin-top--md">
        For up-to-date documentation, see the{' '}
        <b>
          <Link
            to={latestDoc.path}
            onClick={() =>
              savePreferredVersionName(latestVersionSuggestion.name)
            }
          >
            latest version
          </Link>
        </b>{' '}
        ({latestVersionSuggestion.label}).
      </div>
    </div>
  );
}

export default function DocVersionBanner({ className }: Props): ReactNode {
  const versionMetadata = useDocsVersion();
  if (versionMetadata.banner) {
    return (
      <DocVersionBannerEnabled
        className={className}
        versionMetadata={versionMetadata}
      />
    );
  }
  return null;
}
