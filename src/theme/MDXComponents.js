// src/theme/MDXComponents.js
import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import EditCode from '@site/src/components/EditCode';
import Hover from '@site/src/components/Hover';
import { StandardBadge, BusinessBadge, EnterpriseBadge } from '@site/src/components/UpboundTierBadges';


export default {
  ...MDXComponents,
  Tabs,
  TabItem,
  EditCode,
  Hover,
  StandardBadge,
  BusinessBadge,
  EnterpriseBadge,

};

