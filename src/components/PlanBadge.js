// src/components/PlanBadge.js
import React from 'react';
import { usePluginData } from '@docusaurus/useGlobalData';
import { useLocation } from '@docusaurus/router';
import { isSamePath } from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import clsx from 'clsx';
import styles from './Plans.module.css';

const PLAN_CONFIG = {
  community: {
    label: 'Community',
    className: 'planCommunity',
  },
  standard: {
    label: 'Standard',
    className: 'planStandard', 
  },
  enterprise: {
    label: 'Enterprise',
    className: 'planEnterprise',
  },
  business: {
    label: 'Business',
    className: 'planBusiness',
  }
};

function LockIcon({ size = 10 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className={styles.lockIcon}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M4 4v2h-.25A1.75 1.75 0 0 0 2 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0 0 14 13.25v-5.5A1.75 1.75 0 0 0 12.25 6H12V4a4 4 0 1 0-8 0Zm6.5 2V4a2.5 2.5 0 0 0-5 0v2h5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PlanBadge({ plan }) {
  if (!plan || !PLAN_CONFIG[plan]) return null;
  
  const config = PLAN_CONFIG[plan];
  
  return (
    <span 
      className={clsx(styles.planBadge, styles[config.className])}
      title={`Available in ${config.label} plan`}
    >
      {plan !== 'community' && <LockIcon size={10} />}
      {config.label}
    </span>
  );
}

function extractDocId(href) {
  if (!href) return null;
  const cleanHref = href.replace(/^\/+|\/+$/g, '');
  return cleanHref.endsWith('/') ? cleanHref + 'index' : cleanHref;
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
  
  const pluginData = usePluginData('upbound-plan-plugin') || {};
  const { planData = {} } = pluginData;
  
  const { 
    items, 
    label, 
    href, 
    docId, 
    unlisted, 
    linkUnlisted,
    ...cleanItemProps 
  } = item;
  
  const currentPath = activePath || location.pathname;
  const isActive = isActiveSidebarItem(item, currentPath);
  
  let plan = null;
  
  if (docId && planData[docId]) {
    const planInfo = planData[docId];
    plan = planInfo.plan;
  }
  
  if (!plan && href) {
    const extractedDocId = extractDocId(href);
    if (extractedDocId) {
      const variations = [
        extractedDocId,
        '/' + extractedDocId,
        extractedDocId + '/index',
        extractedDocId.replace(/\/index$/, ''),
        extractedDocId.replace(/^deploy\//, ''),
        extractedDocId.replace(/^deployment\//, ''),
      ];
      
      for (const variation of variations) {
        if (planData[variation]) {
          const planInfo = planData[variation];
          plan = planInfo.plan;
          if (plan) break;
        }
      }
    }
  }
  
  const linkProps = {
    ...cleanItemProps,
    ...(typeof unlisted === 'string' && { unlisted }),
    ...(typeof linkUnlisted === 'string' && { linkUnlisted }),
  };
  
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
        {...linkProps}
      >
        <div className={styles.sidebarItemContent}>
          <span className={styles.sidebarItemLabel}>{label}</span>
          {plan && <PlanBadge plan={plan} />}
        </div>
        {!isInternalUrl(href) && <IconExternalLink />}
      </Link>
    </li>
  );
}
