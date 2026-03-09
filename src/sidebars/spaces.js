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
      label: 'Deploy',
      items: [
        'howtos/self-hosted/deployment-reqs',
        'howtos/self-hosted/self-hosted-spaces-deployment',
        'howtos/self-hosted/managed-spaces-deployment',
        'howtos/self-hosted/certs',
        'howtos/self-hosted/proxies-config',
        'howtos/self-hosted/attach-detach',
        'howtos/self-hosted/query-api',
      ],
    },
    {
      type: 'category',
      label: 'Configure',
      items: [
        'howtos/self-hosted/configure-ha',
        'howtos/self-hosted/administer-features',
        'howtos/self-hosted/hub-rbac',
        'howtos/self-hosted/oidc-configuration',
        'howtos/self-hosted/scaling-resources',
        'howtos/self-hosted/spaces-management',
      ],
    },
    {
      type: 'category',
      label: 'Control Planes',
      items: [
        'howtos/managed-service',
        'howtos/control-plane-topologies',
        'howtos/auto-upgrade',
        'howtos/self-hosted/declarative-ctps',
        'howtos/self-hosted/controllers',
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
      ],
    },
    {
      type: 'category',
      label: 'Observe & Debug',
      items: [
        'howtos/observability',
        'howtos/self-hosted/space-observability',
        'howtos/self-hosted/ctp-audit-logs',
        'howtos/debugging-a-ctp',
        'howtos/self-hosted/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'GitOps & Automation',
      items: [
        'howtos/automation-and-gitops/overview',
        'howtos/self-hosted/gitops-with-argocd',
        'howtos/self-hosted/use-argo',
      ],
    },
    {
      type: 'category',
      label: 'Data & Security',
      items: [
        'howtos/backup-and-restore',
        'howtos/self-hosted/dr',
        'howtos/secrets-management',
        {
          type: 'category',
          label: 'Workload Identity',
          items: [
            'howtos/self-hosted/workload-id/backup-restore-config',
            'howtos/self-hosted/workload-id/billing-config',
            'howtos/self-hosted/workload-id/eso-config',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Billing & Licensing',
      items: [
        'howtos/self-hosted/billing',
        'howtos/self-hosted/capacity-licensing',
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
