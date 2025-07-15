// src/components/StandardBadge.js
import React from 'react';
import Admonition from '@theme/Admonition';

export default function StandardBadge() {
  return (
    <Admonition type="important">
      <p>This is a <strong>Standard tier</strong> feature. For more information, see our{' '}
      <a href="https://www.upbound.io/pricing">pricing plans</a>.</p>
    </Admonition>
  );
}


