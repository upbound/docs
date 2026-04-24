module.exports = {
  sidebar: [
    {
      type: 'doc',
      id: 'overview/index',
      label: 'Overview',
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/control-planes',
        'concepts/groups',
        'concepts/deployment-modes',
      ],
    },
    {
      type: 'category',
      label: 'Deploy',
      items: [
        'howtos/dedicated-spaces-deployment',
      ],
    },
    {
      type: 'category',
      label: 'Control Planes',
      items: [
        'howtos/managed-service',
        'howtos/auto-upgrade',
        'howtos/migrating-to-mcps',
        'howtos/simulations',
      ],
    },
    {
      type: 'category',
      label: 'Connect',
      items: [
        'howtos/api-connector',
        'howtos/ctp-connector',
        'howtos/mcp-connector-guide',
        'howtos/query-api',
        'howtos/private-network-agent',
      ],
    },
    {
      type: 'category',
      label: 'Observe & Debug',
      items: [
        'howtos/observability',
        'howtos/debugging-a-ctp',
      ],
    },
    {
      type: 'category',
      label: 'GitOps & Automation',
      items: [
        'howtos/automation-and-gitops/overview',
        'howtos/gitops-on-upbound',
      ],
    },
    {
      type: 'category',
      label: 'Data & Security',
      items: [
        'howtos/backup-and-restore',
        'howtos/secrets-management',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'reference/index',
      ],
    },
  ],
};
