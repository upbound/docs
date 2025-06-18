// src/sidebars/reference.js
module.exports = {
  referenceSidebar: [
    'index',
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'query-api/index',
        'spaces-api/index',
        'testing-api/index',
      ],
    },
    {
      type: 'category',
      label: 'Providers',
      items: [
        {
          type: 'link',
          label: 'Provider Documentation',
          href: '/providers', 
        },
      ],
    },
      {
        type: 'category',
        label: 'Upbound Marketplace',
          items: [
              'upbound-marketplace/index',
              'upbound-marketplace/authentication',
              'upbound-marketplace/dmca',

              'upbound-marketplace/packages',
          ],
      },

    {
      type: 'category',
      label: 'Release Notes',
      items: [
        'rel-notes/up-cli',
        'rel-notes/mcp-connector',
        'rel-notes/spaces',
      ],
    },
    'cli-reference',
    'licenses',
    'lifecycle',
    'ipaddresses',
    'vscode-extensions',
  ],
};
