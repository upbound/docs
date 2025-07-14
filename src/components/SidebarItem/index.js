// src/components/UpboundSidebarItem/index.js
import React from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import { useLocation } from '@docusaurus/router';
import { isSamePath } from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import clsx from 'clsx';
import styles from './styles.module.css';

const TIER_CONFIG = {
  community: {
    label: 'Community',
    className: 'tier-community',
    color: '#10b981', // emerald-500
  },
  standard: {
    label: 'Standard',
    className: 'tier-standard', 
    color: '#3b82f6', // blue-500
  },
  enterprise: {
    label: 'Enterprise',
    className: 'tier-enterprise',
    color: '#8b5cf6', // violet-500
  },
  business: {
    label: 'Business',
    className: 'tier-business',
    color: '#f59e0b', // amber-500
  }
};

function TierBadge({ tier }) {
  if (!tier || !TIER_CONFIG[tier]) return null;
  
  const config = TIER_CONFIG[tier];
  
  return (
    <span 
      className={clsx(styles.tierBadge, styles[config.className])}
      style={{ backgroundColor: config.color }}
      title={`Available in ${config.label} tier`}
    >
      {config.label}
    </span>
  );
}

function extractDocId(href) {
  if (!href) return null;
  
  const cleanHref = href.replace(/^\/+|\/+$/g, '');
  
  if (cleanHref.endsWith('/')) {
    return cleanHref + 'index';
  }
  
  return cleanHref;
}

function isActiveSidebarItem(item, activePath) {
  if (item.href && !item.linkUnlisted) {
    return isSamePath(item.href, activePath);
  }
  return false;
}

export default function UpboundSidebarItem({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}) {
  const location = useLocation();
  const { tierData, categoryTiers } = usePluginData('upbound-tier-plugin') || { tierData: {}, categoryTiers: {} };
  const { items, label, href, docId, ...itemProps } = item;
  
  const currentPath = activePath || location.pathname;
  const isActive = isActiveSidebarItem(item, currentPath);
  
  let tier = null;
  
  if (docId && tierData[docId]) {
    tier = tierData[docId].tier;
  }
  
  // If no docId or not found, try to extract from href
  if (!tier && href) {
    const extractedDocId = extractDocId(href);
    if (extractedDocId) {
      // Try multiple variations of the path
      const pathVariations = [
        extractedDocId,
        '/' + extractedDocId,
        extractedDocId + '/index',
        extractedDocId.replace(/\/index$/, ''),
        // Handle nested paths like deploy/deployment/mode1
        extractedDocId.replace(/^deploy\//, ''),
        extractedDocId.replace(/^deployment\//, ''),
      ];
      
      for (const variation of pathVariations) {
        if (tierData[variation]) {
          tier = tierData[variation].tier;
          break;
        }
      }
    }
  }
  
 
  return (
    <li
      className={clsx(
        'theme-doc-sidebar-item-link',
        'theme-doc-sidebar-item-link-level-' + level,
        {
          'menu__list-item--active': isActive,
        }
      )}
      key={label}
      data-debug={`href:${href} docId:${docId} tier:${tier || 'none'}`}
    >
      <Link
        className={clsx('menu__link', styles.sidebarLink, {
          'menu__link--active': isActive,
        })}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalUrl(href) && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...itemProps}
      >
        <div className={styles.sidebarItemContent}>
          <span className={styles.sidebarItemLabel}>{label}</span>
          <TierBadge tier={tier} />
        </div>
        {!isInternalUrl(href) && <IconExternalLink />}
      </Link>
    </li>
  );
}
