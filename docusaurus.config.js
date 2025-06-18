// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Upbound Documentation',
  tagline: 'Guide your internal cloud platform journey',
  favicon: 'img/icons/favicon.ico',
  url: 'https://docs.upbound.io',
  baseUrl: '/',
  organizationName: 'upbound',
  projectName: 'docs',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false, 
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'learn',
        path: 'docs/learn',
        routeBasePath: '/', 
        sidebarPath: require.resolve('./src/sidebars/learn.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'build',
        path: 'docs/build',
        routeBasePath: 'build',
        sidebarPath: require.resolve('./src/sidebars/build.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'deploy',
        path: 'docs/deploy',
        routeBasePath: 'deploy',
        sidebarPath: require.resolve('./src/sidebars/deploy.js')
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'operate',
        path: 'docs/operate',
        routeBasePath: 'operate',
        sidebarPath: require.resolve('./src/sidebars/operate.js')
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'connect',
        path: 'docs/connect',
        routeBasePath: 'connect',
        sidebarPath: require.resolve('./src/sidebars/connect.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'providers',
        path: 'docs/providers',
        routeBasePath: 'providers',
        sidebarPath: require.resolve('./src/sidebars/providers.js')
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'apis-cli',
        path: 'docs/apis-cli',
        routeBasePath: 'apis-cli',
        sidebarPath: require.resolve('./src/sidebars/apis-cli.js')
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'release-notes',
        path: 'docs/release-notes',
        routeBasePath: 'release-notes',
        sidebarPath: require.resolve('./src/sidebars/release-notes.js')
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'marketplace',
        path: 'docs/upbound-marketplace',
        routeBasePath: 'upbound-marketplace',
        sidebarPath: require.resolve('./src/sidebars/marketplace.js')
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'usage',
        path: 'docs/usage',
        routeBasePath: 'usage',
        sidebarPath: require.resolve('./src/sidebars/usage.js')
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'crossplane-learn',
        path: 'docs/crossplane/learn',
        routeBasePath: 'crossplane/learn',
        sidebarPath: require.resolve('./src/sidebars/crossplane-learn.js')
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'crossplane-api-ref',
        path: 'docs/crossplane/api-ref',
        routeBasePath: 'crossplane/api-ref',
        sidebarPath: require.resolve('./src/sidebars/crossplane-api-ref.js')
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'solutions',
        path: 'docs/solutions',
        routeBasePath: 'solutions',
        sidebarPath: require.resolve('./src/sidebars/solutions.js')
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: '',
        logo: {
          alt: 'Upbound Logo',
          src: 'img/logos/upbound-docs.svg',
          srcDark: 'img/logos/up-docs-white.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'learnSidebar',
            position: 'left',
            label: 'Learn',
            docsPluginId: 'learn',
          },
          {
            type: 'docSidebar',
            sidebarId: 'buildSidebar',
            position: 'left',
            label: 'Build',
            docsPluginId: 'build',
          },
          {
            type: 'docSidebar',
            sidebarId: 'deploySidebar',
            position: 'left',
            label: 'Deploy',
            docsPluginId: 'deploy',
          },
          {
            type: 'docSidebar',
            sidebarId: 'operateSidebar',
            position: 'left',
            label: 'Operate',
            docsPluginId: 'operate',
          },
          {
            type: 'docSidebar',
            sidebarId: 'connectSidebar',
            position: 'left',
            label: 'Connect',
            docsPluginId: 'connect',
          },
          {
            type: 'dropdown',
            label: 'Reference',
            position: 'left',
            items: [
              {
                type: 'docSidebar',
                sidebarId: 'apisCliSidebar',
                label: 'APIs & CLIs',
                docsPluginId: 'apis-cli',
              },
              {
                type: 'docSidebar',
                sidebarId: 'marketplaceSidebar',
                label: 'Upbound Marketplace',
                docsPluginId: 'marketplace',
              },
              {
                type: 'docSidebar',
                sidebarId: 'releaseNotesSidebar',
                label: 'Release Notes',
                docsPluginId: 'release-notes',
              },
              {
                type: 'docSidebar',
                sidebarId: 'providersSidebar',
                label: 'Providers',
                docsPluginId: 'providers',
              },
              {
                type: 'docSidebar',
                sidebarId: 'usageSidebar',
                label: 'Usage',
                docsPluginId: 'usage',
              },
            ],
          },
          {
            type: 'docSidebar',
            sidebarId: 'solutionsSidebar',
            position: 'left',
            label: 'Solutions',
            docsPluginId: 'solutions'
          },
          {
            type: 'search',
            position: 'right',
          },
        ],
      },
      algolia: {
        appId: '4OZX85VEXQ',
        apiKey: '7880f8f03cb89ce23f18d4359fb10e5e',
        indexName: 'upbound',
        contextualSearch: true,
        searchPagePath: 'search',
        searchParameters: {},
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Use Upbound',
            items: [
              {
                label: 'Get Started',
                to: '/',
              },
            ],
          },
          {
            title: 'Build With Upbound',
            items: [
              {
                label: 'Control Planes',
                to: '/build',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Slack',
                href: 'https://slack.crossplane.io',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/upbound',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/upbound_io',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                href: 'https://blog.upbound.io',
              },
              {
                label: 'Support',
                href: 'https://upbound.zendesk.com/',
              },
              {
                label: 'Crossplane Docs',
                href: 'https://docs.crossplane.io',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Upbound. All rights reserved.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'yaml', 'json', 'go', 'python'],
      },
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
    }),
};

export default config;
