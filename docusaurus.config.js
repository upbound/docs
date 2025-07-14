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
    markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
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
      'docusaurus-pushfeedback', 
      {
        project: '0p5hvygqxb' 
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        path: 'docs', 
        routeBasePath: '/',
        sidebarPath: require.resolve('./src/sidebars/main.js'),
      },
    ],
        './scripts/tier-plugin.js',
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
            label: 'Learn',
            sidebarId: 'learnSidebar',
            position: 'left',
          },
          {
            type: 'docSidebar',
            label: 'Build',
            position: 'left',
            sidebarId: 'buildSidebar',
          },
          {
            type: 'docSidebar',
            label: 'Deploy',
            position: 'left',
            sidebarId: 'deploySidebar',
          },
          // {
          //   type: 'docSidebar',
          //   label: 'Operate',
          //   position: 'left',
          //   sidebarId: 'operateSidebar',
          // },

          {
            type: 'docSidebar',
            label: 'Reference',
            position: 'left',
            sidebarId: 'referenceSidebar',
          },
          {
            type: 'docSidebar',
            label: 'Solutions',
            position: 'left',
            sidebarId: 'solutionsSidebar',
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
        indexName: 'upbound-docs',
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
                to: '/get-started',
              },
            ],
          },
          {
            title: 'Build With Upbound',
            items: [
              {
                label: 'Control Planes',
                to: '/upbound',
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
