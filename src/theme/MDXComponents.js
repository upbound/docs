// src/theme/MDXComponents.js
import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import EditCode from '@site/src/components/EditCode';
import Hover from '@site/src/components/Hover';
import ScrollTable from '@site/src/components/ScrollTable';
import { Standard, Business, Enterprise } from '../components/PlanCallout';

export default {
  ...MDXComponents,
  Tabs,
  TabItem,
  EditCode,
  Hover,
  ScrollTable,
  Standard,
  Business,
  Enterprise,
};

