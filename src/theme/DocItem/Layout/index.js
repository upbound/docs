import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import { useLocation } from '@docusaurus/router';
import styles from './layout.module.css';

const versionsJson = require('../../../../spaces_versions.json');

const versions = versionsJson.map((version, index) => ({
  label: index === 0 ? `${version} (Latest)` : version,
  value: index === 0 ? '' : version,
}));

export default function LayoutWrapper(props) {
  const location = useLocation();
  const isSpacesPage = location.pathname.startsWith('/spaces');

  const getCurrentVersion = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments[0] === 'spaces') {
      if (/^\d+\.\d+$/.test(pathSegments[1])) {
        return pathSegments[1];
      }
    }
    return '';
  };

  const handleVersionChange = (e) => {
    const selectedVersion = e.target.value;
    const pathSegments = location.pathname.split('/').filter(Boolean);
    let newPath = location.pathname;

    if (pathSegments[0] === 'spaces') {
      if (/^\d+\.\d+$/.test(pathSegments[1])) {
        const contentPath = '/' + pathSegments.slice(2).join('/');
        newPath = selectedVersion ? `/spaces/${selectedVersion}${contentPath}` : `/spaces${contentPath}`;
      } else {
        const contentPath = '/' + pathSegments.slice(1).join('/');
        newPath = selectedVersion ? `/spaces/${selectedVersion}${contentPath}` : `/spaces${contentPath}`;
      }
    }

    window.location.href = newPath;
  };

  return (
    <>
      {isSpacesPage && (
        <div className={styles.versionSelector}>
          <label htmlFor="version-select" className={styles.label}>
            Version:
          </label>
          <select
            id="version-select"
            value={getCurrentVersion()}
            onChange={handleVersionChange}
            className={styles.select}
          >
            {versions.map((v) => (
              <option key={v.value} value={v.value}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      )}
      <Layout {...props} />
    </>
  );
}
