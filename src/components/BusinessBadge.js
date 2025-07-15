// src/components/BusinessBadge.js
import React from 'react';
import Admonition from '@theme/Admonition';

export default function BusinessBadge() {
  return (
    <Admonition type="important">
      <p>This is a <strong>Business tier</strong> feature. For more information, see our{' '}
      <a href="https://www.upbound.io/pricing">pricing plans</a>.</p>
    </Admonition>
  );
}


