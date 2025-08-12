// src/components/PlanCallout.js
import React from 'react';
import { useDoc } from '@docusaurus/theme-common';
import './Plans.module.css';

function LockIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      className="lockIcon"
      aria-hidden="true"
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: '0.375rem',
        opacity: 0.9
      }}
    >
      <path
        fillRule="evenodd"
        d="M4 4v2h-.25A1.75 1.75 0 0 0 2 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0 0 14 13.25v-5.5A1.75 1.75 0 0 0 12.25 6H12V4a4 4 0 1 0-8 0Zm6.5 2V4a2.5 2.5 0 0 0-5 0v2h5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Callouts
export function Standard() {
  return (
    <div className="plan-callout plan-badge--standard">
      <div className="plan-callout__title">
        <span><LockIcon size={14} /> Standard Plan Feature</span>
      </div>
      <p className="plan-callout__content">
        This feature is available in the <strong>Standard Plan</strong> and above. For more information, see our{' '}
        <a href="https://www.upbound.io/pricing">pricing plans</a> or{' '}
        <a href="https://www.upbound.io/contact">contact our sales team</a>.
      </p>
    </div>
  );
}

export function Business() {
  return (
    <div className="plan-callout plan-badge--business">
      <div className="plan-callout__title">
        <span><LockIcon size={14} /> Business Critical Plan Feature</span>
      </div>
      <p className="plan-callout__content">
        This is a <strong>Business Critical Plan</strong> feature. For more information, see our{' '}
        <a href="https://www.upbound.io/pricing">pricing plans</a> or{' '}
        <a href="https://www.upbound.io/contact">contact our sales team</a>.
      </p>
    </div>
  );
}

export function Enterprise() {
  return (
    <div className="plan-callout plan-badge--enterprise">
      <div className="plan-callout__title">
        <span><LockIcon size={14} /> Enterprise Plan Feature</span>
      </div>
      <p className="plan-callout__content">
        This feature is available in the <strong>Enterprise Plan</strong> and above. For more information, see our{' '}
        <a href="https://www.upbound.io/pricing">pricing plans</a> or{' '}
        <a href="https://www.upbound.io/contact">contact our sales team</a>.
      </p>
    </div>
  );
}
