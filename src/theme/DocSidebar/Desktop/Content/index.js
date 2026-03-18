import React from 'react';
import Content from '@theme-original/DocSidebar/Desktop/Content';
import { useLocation } from '@docusaurus/router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@upbound/elements';
import styles from './styles.module.css';

const versionsJson = require('../../../../../self-hosted-spaces_versions.json');

const LATEST = 'latest';

const versions = versionsJson.map((version, index) => ({
  label: index === 0 ? `${version} (Latest)` : version,
  value: index === 0 ? LATEST : version,
}));

function getVersionFromPath(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] === 'self-hosted-spaces' && /^\d+\.\d+$/.test(segments[1])) {
    return segments[1];
  }
  return LATEST;
}

function buildVersionPath(pathname, selectedVersion) {
  const segments = pathname.split('/').filter(Boolean);
  const hasVersion = /^\d+\.\d+$/.test(segments[1]);
  const contentPath = '/' + segments.slice(hasVersion ? 2 : 1).join('/');
  return selectedVersion === LATEST
    ? `/self-hosted-spaces${contentPath}`
    : `/self-hosted-spaces/${selectedVersion}${contentPath}`;
}

export default function DocSidebarDesktopContentWrapper(props) {
  const location = useLocation();
  const isSelfHostedSpaces = location.pathname.startsWith('/self-hosted-spaces');

  function handleVersionChange(value) {
    window.location.href = buildVersionPath(location.pathname, value);
  }

  return (
    <>
      {isSelfHostedSpaces && (
        <div className={styles.versionSelector}>
          <Select
            value={getVersionFromPath(location.pathname)}
            onValueChange={handleVersionChange}
          >
            <SelectTrigger className={styles.trigger}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {versions.map((v) => (
                <SelectItem key={v.value} value={v.value}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <Content {...props} />
    </>
  );
}
