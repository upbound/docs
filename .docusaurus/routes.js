import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/search',
    component: ComponentCreator('/search', '5de'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '0c9'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '424'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '6c4'),
            routes: [
              {
                path: '/fundamentals/builders-workshop/create-configuration',
                component: ComponentCreator('/fundamentals/builders-workshop/create-configuration', '082'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/builders-workshop/deployment',
                component: ComponentCreator('/fundamentals/builders-workshop/deployment', '59b'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/builders-workshop/project-foundations',
                component: ComponentCreator('/fundamentals/builders-workshop/project-foundations', '305'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/builders-workshop/testing',
                component: ComponentCreator('/fundamentals/builders-workshop/testing', 'ea4'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/consumer-portal-get-started',
                component: ComponentCreator('/fundamentals/consumer-portal-get-started', '13f'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/', 'cde'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/adding-dependencies',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/adding-dependencies', '67e'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/', '620'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/go-templating/',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/go-templating/', '731'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/go-templating/inputs-outputs',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/go-templating/inputs-outputs', '03a'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/go-templating/schemas',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/go-templating/schemas', '75e'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/go/',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/go/', 'b9a'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/go/inputs-outputs',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/go/inputs-outputs', 'b3f'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/go/models',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/go/models', '15f'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/', 'f8a'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/conditionals',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/conditionals', 'bc6'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/inputs-outputs',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/inputs-outputs', 'c49'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/loops',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/loops', 'f5c'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/read-pipeline-state',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/read-pipeline-state', '1cb'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/resource-data-extraction',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/resource-data-extraction', '3b1'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/resource-schemas',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/resource-schemas', '954'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/variables',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/variables', '158'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/write-status-to-composite',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/write-status-to-composite', '53b'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/python/',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/python/', '84a'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/python/inputs-outputs',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/python/inputs-outputs', '6fa'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-compositions/python/models',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-compositions/python/models', '516'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/authoring-xrds',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/authoring-xrds', '0fe'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/building-pushing',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/building-pushing', 'e73'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/simulations',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/simulations', '744'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/control-plane-projects/testing',
                component: ComponentCreator('/fundamentals/control-planes/control-plane-projects/testing', '7ef'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/controllers',
                component: ComponentCreator('/fundamentals/control-planes/controllers', '42e'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/migrating-to-mcps',
                component: ComponentCreator('/fundamentals/control-planes/migrating-to-mcps', '410'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/provider-authentication',
                component: ComponentCreator('/fundamentals/control-planes/provider-authentication', '9d2'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/repositories/',
                component: ComponentCreator('/fundamentals/control-planes/repositories/', '04f'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/repositories/management',
                component: ComponentCreator('/fundamentals/control-planes/repositories/management', '941'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/repositories/publish-packages',
                component: ComponentCreator('/fundamentals/control-planes/repositories/publish-packages', '061'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/control-planes/repositories/store-configurations',
                component: ComponentCreator('/fundamentals/control-planes/repositories/store-configurations', '7a6'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/core-concepts/claims',
                component: ComponentCreator('/fundamentals/core-concepts/claims', 'e93'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/core-concepts/compositions',
                component: ComponentCreator('/fundamentals/core-concepts/compositions', '67e'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/core-concepts/control-planes',
                component: ComponentCreator('/fundamentals/core-concepts/control-planes', '269'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/core-concepts/functions',
                component: ComponentCreator('/fundamentals/core-concepts/functions', '797'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/core-concepts/managed-control-planes',
                component: ComponentCreator('/fundamentals/core-concepts/managed-control-planes', '59a'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/core-concepts/projects',
                component: ComponentCreator('/fundamentals/core-concepts/projects', '3da'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/core-concepts/providers',
                component: ComponentCreator('/fundamentals/core-concepts/providers', 'a45'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/fundamentals/core-concepts/xrds',
                component: ComponentCreator('/fundamentals/core-concepts/xrds', '1ef'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/reference/',
                component: ComponentCreator('/reference/', '96b'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/apis/crossplane-api/',
                component: ComponentCreator('/reference/apis/crossplane-api/', '7d6'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/apis/query-api/',
                component: ComponentCreator('/reference/apis/query-api/', '894'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/apis/spaces-api/',
                component: ComponentCreator('/reference/apis/spaces-api/', '744'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/apis/spaces-api/v1_10',
                component: ComponentCreator('/reference/apis/spaces-api/v1_10', '354'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/apis/spaces-api/v1_11',
                component: ComponentCreator('/reference/apis/spaces-api/v1_11', '0a2'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/apis/spaces-api/v1_12',
                component: ComponentCreator('/reference/apis/spaces-api/v1_12', 'a08'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/apis/spaces-api/v1_13',
                component: ComponentCreator('/reference/apis/spaces-api/v1_13', 'a87'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/apis/spaces-api/v1_9',
                component: ComponentCreator('/reference/apis/spaces-api/v1_9', 'b63'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/apis/spaces-api/yaml/v1.13/',
                component: ComponentCreator('/reference/apis/spaces-api/yaml/v1.13/', '98d'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/apis/testing-api/',
                component: ComponentCreator('/reference/apis/testing-api/', '7b7'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/cli-reference',
                component: ComponentCreator('/reference/cli-reference', 'db5'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/legacy/',
                component: ComponentCreator('/reference/legacy/', '85a'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/legacy/connect-argo-to-upbound',
                component: ComponentCreator('/reference/legacy/connect-argo-to-upbound', 'f3c'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/legacy/control-plane-configurations',
                component: ComponentCreator('/reference/legacy/control-plane-configurations', '116'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/legacy/multicloud-deploy',
                component: ComponentCreator('/reference/legacy/multicloud-deploy', '2ee'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/marketplace/',
                component: ComponentCreator('/reference/marketplace/', '787'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/marketplace/authentication',
                component: ComponentCreator('/reference/marketplace/authentication', '920'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/marketplace/dmca',
                component: ComponentCreator('/reference/marketplace/dmca', '2ca'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/marketplace/packages',
                component: ComponentCreator('/reference/marketplace/packages', '2c6'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/',
                component: ComponentCreator('/reference/providers/', '53a'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/faq',
                component: ComponentCreator('/reference/providers/faq', 'f47'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/migration',
                component: ComponentCreator('/reference/providers/migration', 'eda'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/monolithic',
                component: ComponentCreator('/reference/providers/monolithic', 'a9d'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/policies',
                component: ComponentCreator('/reference/providers/policies', '29e'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-aws/',
                component: ComponentCreator('/reference/providers/provider-aws/', 'a71'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-aws/authentication',
                component: ComponentCreator('/reference/providers/provider-aws/authentication', '834'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-azure/',
                component: ComponentCreator('/reference/providers/provider-azure/', '26b'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-azure/authentication',
                component: ComponentCreator('/reference/providers/provider-azure/authentication', '4ca'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-azuread/',
                component: ComponentCreator('/reference/providers/provider-azuread/', '27d'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-families',
                component: ComponentCreator('/reference/providers/provider-families', 'c2d'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-gcp/',
                component: ComponentCreator('/reference/providers/provider-gcp/', '54c'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-gcp/authentication',
                component: ComponentCreator('/reference/providers/provider-gcp/authentication', 'e91'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-helm/',
                component: ComponentCreator('/reference/providers/provider-helm/', 'efd'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-kubernetes/',
                component: ComponentCreator('/reference/providers/provider-kubernetes/', '6ea'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-kubernetes/authentication',
                component: ComponentCreator('/reference/providers/provider-kubernetes/authentication', '5f6'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-terraform/',
                component: ComponentCreator('/reference/providers/provider-terraform/', '78e'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-terraform/migrate-hcl',
                component: ComponentCreator('/reference/providers/provider-terraform/migrate-hcl', 'b7b'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-terraform/migrate-provider-tf',
                component: ComponentCreator('/reference/providers/provider-terraform/migrate-provider-tf', '2c1'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/pull-secrets',
                component: ComponentCreator('/reference/providers/pull-secrets', '3aa'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/signature-verification',
                component: ComponentCreator('/reference/providers/signature-verification', '1db'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/release-notes/',
                component: ComponentCreator('/reference/release-notes/', '708'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/release-notes/mcp-connector',
                component: ComponentCreator('/reference/release-notes/mcp-connector', 'd68'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/release-notes/spaces',
                component: ComponentCreator('/reference/release-notes/spaces', 'f68'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/release-notes/up-cli',
                component: ComponentCreator('/reference/release-notes/up-cli', '9d0'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/usage/',
                component: ComponentCreator('/reference/usage/', '249'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/usage/feature-lifecycle',
                component: ComponentCreator('/reference/usage/feature-lifecycle', '5cf'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/usage/ipaddresses',
                component: ComponentCreator('/reference/usage/ipaddresses', 'b7f'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/usage/licenses',
                component: ComponentCreator('/reference/usage/licenses', 'f0e'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/usage/lifecycle',
                component: ComponentCreator('/reference/usage/lifecycle', '406'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/usage/support',
                component: ComponentCreator('/reference/usage/support', '5a7'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/usage/vscode-extensions',
                component: ComponentCreator('/reference/usage/vscode-extensions', '0c5'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/solutions/idp-starter-kit',
                component: ComponentCreator('/solutions/idp-starter-kit', '381'),
                exact: true,
                sidebar: "solutionsSidebar"
              },
              {
                path: '/solutions/upbound-platform-ref',
                component: ComponentCreator('/solutions/upbound-platform-ref', '09c'),
                exact: true,
                sidebar: "solutionsSidebar"
              },
              {
                path: '/upbound/',
                component: ComponentCreator('/upbound/', '4c3'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/connect/declarative-ctps',
                component: ComponentCreator('/upbound/connect/declarative-ctps', '35c'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/connect/git-integration',
                component: ComponentCreator('/upbound/connect/git-integration', '71a'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/connect/gitops',
                component: ComponentCreator('/upbound/connect/gitops', 'f5e'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/connect/mcp-connector-guide',
                component: ComponentCreator('/upbound/connect/mcp-connector-guide', '8be'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/connect/oidc',
                component: ComponentCreator('/upbound/connect/oidc', '5c4'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/connect/query-api',
                component: ComponentCreator('/upbound/connect/query-api', '6dc'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/backup-and-restore',
                component: ComponentCreator('/upbound/deploy/backup-and-restore', '8c8'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/control-plane-topologies',
                component: ComponentCreator('/upbound/deploy/control-plane-topologies', 'b56'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/dedicated-spaces/',
                component: ComponentCreator('/upbound/deploy/dedicated-spaces/', 'dc2'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/dedicated-spaces/aws',
                component: ComponentCreator('/upbound/deploy/dedicated-spaces/aws', 'c64'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/dedicated-spaces/gcp',
                component: ComponentCreator('/upbound/deploy/dedicated-spaces/gcp', '571'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/query-api',
                component: ComponentCreator('/upbound/deploy/query-api', '325'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/', '22a'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/attach-detach',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/attach-detach', 'c20'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/aws/',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/aws/', '2b8'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/aws/workload-id-backup-restore',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/aws/workload-id-backup-restore', 'ef0'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/azure/',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/azure/', '199'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/billing',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/billing', '64a'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/deployment',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/deployment', '44d'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/dr',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/dr', 'f38'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/gcp/',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/gcp/', '987'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/helm-reference',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/helm-reference', '661'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/proxies-config',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/proxies-config', 'ecb'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/scaling-resources',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/scaling-resources', '8e2'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/self-hosted-qs',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/self-hosted-qs', '6c6'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/space-observability',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/space-observability', '320'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/spaces-management',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/spaces-management', '394'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/troubleshooting',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/troubleshooting', '297'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/self-hosted-spaces/use-argo',
                component: ComponentCreator('/upbound/deploy/self-hosted-spaces/use-argo', '855'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/spaces/',
                component: ComponentCreator('/upbound/deploy/spaces/', 'f6d'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/deploy/spaces/console',
                component: ComponentCreator('/upbound/deploy/spaces/console', '99a'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/accounts/',
                component: ComponentCreator('/upbound/operate/accounts/', '3f0'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/accounts/authentication/enable-sso',
                component: ComponentCreator('/upbound/operate/accounts/authentication/enable-sso', '166'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/accounts/authentication/oidc-configuration',
                component: ComponentCreator('/upbound/operate/accounts/authentication/oidc-configuration', 'fc7'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/accounts/authorization/hub-rbac',
                component: ComponentCreator('/upbound/operate/accounts/authorization/hub-rbac', 'f7c'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/accounts/authorization/k8s-rbac',
                component: ComponentCreator('/upbound/operate/accounts/authorization/k8s-rbac', 'a10'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/accounts/authorization/upbound-rbac',
                component: ComponentCreator('/upbound/operate/accounts/authorization/upbound-rbac', 'b47'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/accounts/identity-management/organizations',
                component: ComponentCreator('/upbound/operate/accounts/identity-management/organizations', '01e'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/accounts/identity-management/robots',
                component: ComponentCreator('/upbound/operate/accounts/identity-management/robots', '28e'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/accounts/identity-management/teams',
                component: ComponentCreator('/upbound/operate/accounts/identity-management/teams', 'c93'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/accounts/identity-management/users',
                component: ComponentCreator('/upbound/operate/accounts/identity-management/users', '5dd'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/auto-upgrade',
                component: ComponentCreator('/upbound/operate/auto-upgrade', '6b1'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/cli/',
                component: ComponentCreator('/upbound/operate/cli/', '6f6'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/cli/configuration',
                component: ComponentCreator('/upbound/operate/cli/configuration', 'bb3'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/cli/contexts',
                component: ComponentCreator('/upbound/operate/cli/contexts', 'f29'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/control-planes',
                component: ComponentCreator('/upbound/operate/control-planes', '2cf'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/ctp-connector',
                component: ComponentCreator('/upbound/operate/ctp-connector', '34a'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/debugging-a-ctp',
                component: ComponentCreator('/upbound/operate/debugging-a-ctp', '6d9'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/groups',
                component: ComponentCreator('/upbound/operate/groups', '9bf'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/observability',
                component: ComponentCreator('/upbound/operate/observability', '998'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/secrets-management',
                component: ComponentCreator('/upbound/operate/secrets-management', 'c2f'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/upbound/operate/simulations',
                component: ComponentCreator('/upbound/operate/simulations', 'dcd'),
                exact: true,
                sidebar: "upboundSidebar"
              },
              {
                path: '/uxp/',
                component: ComponentCreator('/uxp/', 'd24'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/api/',
                component: ComponentCreator('/uxp/api/', '51d'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/composition/',
                component: ComponentCreator('/uxp/composition/', '930'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/composition/composite-resource-definitions',
                component: ComponentCreator('/uxp/composition/composite-resource-definitions', '70b'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/composition/composite-resources',
                component: ComponentCreator('/uxp/composition/composite-resources', '647'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/composition/composition-revisions',
                component: ComponentCreator('/uxp/composition/composition-revisions', 'd40'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/composition/compositions',
                component: ComponentCreator('/uxp/composition/compositions', '2fe'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/composition/environment-configs',
                component: ComponentCreator('/uxp/composition/environment-configs', '634'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/get-started/',
                component: ComponentCreator('/uxp/get-started/', '8c6'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/get-started/get-started-with-composition',
                component: ComponentCreator('/uxp/get-started/get-started-with-composition', 'e68'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/get-started/get-started-with-managed-resources',
                component: ComponentCreator('/uxp/get-started/get-started-with-managed-resources', '5f3'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/get-started/install',
                component: ComponentCreator('/uxp/get-started/install', 'd5b'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/guides/crossplane-with-argo-cd',
                component: ComponentCreator('/uxp/guides/crossplane-with-argo-cd', '861'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/guides/extensions-release-process',
                component: ComponentCreator('/uxp/guides/extensions-release-process', '5c5'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/guides/function-patch-and-transform',
                component: ComponentCreator('/uxp/guides/function-patch-and-transform', 'eca'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/guides/metrics',
                component: ComponentCreator('/uxp/guides/metrics', 'f1e'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/guides/pods',
                component: ComponentCreator('/uxp/guides/pods', '4d9'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/guides/self-signed-ca-certs',
                component: ComponentCreator('/uxp/guides/self-signed-ca-certs', '0d3'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/guides/troubleshoot-crossplane',
                component: ComponentCreator('/uxp/guides/troubleshoot-crossplane', 'e5e'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/guides/uninstall-crossplane',
                component: ComponentCreator('/uxp/guides/uninstall-crossplane', '59a'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/guides/upgrade-crossplane',
                component: ComponentCreator('/uxp/guides/upgrade-crossplane', '159'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/guides/write-a-composition-function-in-go',
                component: ComponentCreator('/uxp/guides/write-a-composition-function-in-go', '8b1'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/guides/write-a-composition-function-in-python',
                component: ComponentCreator('/uxp/guides/write-a-composition-function-in-python', 'e1d'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/managed-resources/',
                component: ComponentCreator('/uxp/managed-resources/', '44f'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/managed-resources/',
                component: ComponentCreator('/uxp/managed-resources/', 'fc2'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/managed-resources/usages',
                component: ComponentCreator('/uxp/managed-resources/usages', '05e'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/packages/configurations',
                component: ComponentCreator('/uxp/packages/configurations', '49c'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/packages/functions',
                component: ComponentCreator('/uxp/packages/functions', 'e03'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/packages/image-configs',
                component: ComponentCreator('/uxp/packages/image-configs', 'ecc'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/uxp/packages/providers',
                component: ComponentCreator('/uxp/packages/providers', 'd1c'),
                exact: true,
                sidebar: "uxpSidebar"
              },
              {
                path: '/',
                component: ComponentCreator('/', 'e9a'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
