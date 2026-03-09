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
        'concepts/deployment-modes',
        'concepts/groups',
      ],
    },
    {
      type: 'category',
      label: 'How-tos',
      items: [
        'howtos/api-connector',
        'howtos/auto-upgrade',
        'howtos/backup-and-restore',
        'howtos/control-plane-topologies',
        'howtos/ctp-connector',
        'howtos/debugging-a-ctp',
        'howtos/dedicated-spaces-deployment',
        'howtos/managed-service',
        'howtos/migrating-to-mcps',
        'howtos/observability',
        'howtos/query-api',
        'howtos/secrets-management',
        'howtos/simulations',
        {
          type: 'category',
          label: 'Automation and GitOps',
          items: [
            'howtos/automation-and-gitops/overview',
            'howtos/gitops-on-upbound',
          ],
        },
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
