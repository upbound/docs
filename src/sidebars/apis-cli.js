// src/sidebars/apis-cli.js
module.exports = {
  apisCliSidebar: [
    'index',
    {
      type: 'category',
      label: 'APIs',
      collapsed: false, 
      items: [
        'query-api/index',
        'spaces-api/index', 
        'testing-api/index',
      ],
    },
    {
      type: 'category',
      label: 'Spaces API - Previous Versions',
      collapsed: true,
        items: [
            'spaces-api/v1_9',
            'spaces-api/v1_10',
            'spaces-api/v1_11',
            'spaces-api/v1_12'
        ],
    },
    {
      type: 'doc',
      id: 'cli-reference/index',
      label: 'Up CLI Reference',
    },
  ],
};
