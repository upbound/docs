// src/theme/MDXComponents.js
import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import StandardBadge from '@site/src/components/StandardBadge';
import BusinessBadge from '@site/src/components/BusinessBadge';
import EnterpriseBadge from '@site/src/components/EnterpriseBadge';

export default {
  ...MDXComponents,
  StandardBadge,
  BusinessBadge,
  EnterpriseBadge,
};
