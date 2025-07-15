// src/components/UpboundTierBadges.js
import React from 'react';

export function StandardBadge() {
  return (
    <div className="tier-badge tier-badge--standard">
      <div className="tier-badge__title">
        <span>Standard Tier Feature</span>
      </div>
      <p className="tier-badge__content">
        This is a <strong>Standard tier</strong> feature. For more information, see our{' '}
        <a href="https://www.upbound.io/pricing">pricing plans</a>.
      </p>
    </div>
  );
}

export function BusinessBadge() {
  return (
    <div className="tier-badge tier-badge--business">
      <div className="tier-badge__title">
        <span>Business Tier Feature</span>
      </div>
      <p className="tier-badge__content">
        This is a <strong>Business tier</strong> feature. For more information, see our{' '}
        <a href="https://www.upbound.io/pricing">pricing plans</a>.
      </p>
    </div>
  );
}

export function EnterpriseBadge() {
  return (
    <div className="tier-badge tier-badge--enterprise">
      <div className="tier-badge__title">
        <span>Enterprise Tier Feature</span>
      </div>
      <p className="tier-badge__content">
        This is an <strong>Enterprise tier</strong> feature. For more information, see our{' '}
        <a href="https://www.upbound.io/pricing">pricing plans</a> or{' '}
        <a href="https://www.upbound.io/contact">contact our sales team</a>.
      </p>
    </div>
  );
}
