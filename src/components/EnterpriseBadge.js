// src/components/EnterpriseBadge.js
import React from 'react';
import Admonition from '@theme/Admonition';

export default function EnterpriseBadge() {
  return (
    <Admonition type="important">
      <p>This is an <strong>Enterprise tier</strong> feature. For more information, see our{' '}
      <a href="https://www.upbound.io/pricing">pricing plans</a>.</p>
    </Admonition>
  );
}
