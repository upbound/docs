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
    path: '/apis-cli',
    component: ComponentCreator('/apis-cli', '70b'),
    routes: [
      {
        path: '/apis-cli',
        component: ComponentCreator('/apis-cli', '7e4'),
        routes: [
          {
            path: '/apis-cli',
            component: ComponentCreator('/apis-cli', 'c5a'),
            routes: [
              {
                path: '/apis-cli/',
                component: ComponentCreator('/apis-cli/', '7e1'),
                exact: true,
                sidebar: "apisCliSidebar"
              },
              {
                path: '/apis-cli/cli-reference/',
                component: ComponentCreator('/apis-cli/cli-reference/', '13a'),
                exact: true,
                sidebar: "apisCliSidebar"
              },
              {
                path: '/apis-cli/cli-reference/yaml/up',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up', '2eb'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha', '9a7'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha-ctx',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha-ctx', '246'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha-migration',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha-migration', 'd95'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha-migration-export',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha-migration-export', '50e'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha-migration-import',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha-migration-import', 'b88'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha-migration-pause-toggle',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha-migration-pause-toggle', '3c7'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha-space',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha-space', 'c6d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha-space-billing',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha-space-billing', '0d6'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha-space-billing-export',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha-space-billing-export', '3e3'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha-space-connect',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha-space-connect', '7cf'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha-space-destroy',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha-space-destroy', 'c49'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha-space-disconnect',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha-space-disconnect', 'fa4'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha-space-init',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha-space-init', 'b86'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha-space-list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha-space-list', 'c4a'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha-space-mirror',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha-space-mirror', 'a3c'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-alpha-space-upgrade',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-alpha-space-upgrade', 'aec'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-completion',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-completion', '99d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-composition',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-composition', '394'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-composition-generate',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-composition-generate', '39d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-composition-render',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-composition-render', 'b76'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane', '4cb'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-configuration',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-configuration', '293'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-configuration-install',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-configuration-install', 'aff'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-connect',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-connect', '1db'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-connector',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-connector', '30d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-connector-install',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-connector-install', 'e64'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-connector-uninstall',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-connector-uninstall', '391'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-create', '26a'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-delete', 'e15'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-disconnect',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-disconnect', '5c1'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-function',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-function', '6f7'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-function-install',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-function-install', '0bd'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-get',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-get', 'a2f'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-list', '8c7'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-provider',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-provider', 'e2d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-provider-install',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-provider-install', 'ac7'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-pull-secret',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-pull-secret', 'eaa'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-pull-secret-create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-pull-secret-create', 'a01'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-simulate',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-simulate', '49b'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-simulation',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-simulation', 'a92'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-simulation-create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-simulation-create', '41d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-simulation-delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-simulation-delete', '0a5'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-controlplane-simulation-list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-controlplane-simulation-list', 'f5f'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-ctx',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-ctx', 'f5e'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-dependency',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-dependency', '30c'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-dependency-add',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-dependency-add', 'c02'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-dependency-clean-cache',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-dependency-clean-cache', '876'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-dependency-update-cache',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-dependency-update-cache', '5c4'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-example',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-example', '3ac'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-example-generate',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-example-generate', 'e5f'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-function',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-function', 'a6e'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-function-generate',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-function-generate', '6eb'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-group',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-group', 'bf0'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-group-create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-group-create', '290'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-group-delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-group-delete', '57b'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-group-get',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-group-get', '753'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-group-list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-group-list', '6b2'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-help',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-help', '5a1'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-license',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-license', '462'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-login',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-login', '643'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-logout',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-logout', '21b'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-organization',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-organization', '7b8'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-organization-create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-organization-create', 'b61'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-organization-delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-organization-delete', '726'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-organization-get',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-organization-get', '86f'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-organization-list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-organization-list', '638'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-organization-token',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-organization-token', '4b9'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-organization-user',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-organization-user', 'b43'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-organization-user-invite',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-organization-user-invite', 'ab7'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-organization-user-list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-organization-user-list', 'd1f'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-organization-user-remove',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-organization-user-remove', '19d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-profile',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-profile', 'bd9'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-profile-create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-profile-create', '07d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-profile-current',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-profile-current', '54b'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-profile-delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-profile-delete', '93d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-profile-list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-profile-list', '3ac'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-profile-rename',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-profile-rename', '64a'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-profile-set',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-profile-set', '338'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-profile-use',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-profile-use', 'cdd'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-profile-view',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-profile-view', '0c9'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-project',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-project', '05a'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-project-build',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-project-build', '217'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-project-init',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-project-init', 'fcd'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-project-move',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-project-move', '43b'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-project-push',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-project-push', 'ed3'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-project-run',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-project-run', '97c'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-project-simulate',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-project-simulate', 'c9f'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-project-simulation',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-project-simulation', '19f'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-project-simulation-complete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-project-simulation-complete', '244'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-project-simulation-create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-project-simulation-create', '110'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-project-simulation-delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-project-simulation-delete', '1f3'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-repository',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-repository', 'afc'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-repository-create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-repository-create', '135'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-repository-delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-repository-delete', '2eb'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-repository-get',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-repository-get', '980'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-repository-list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-repository-list', '406'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-repository-permission',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-repository-permission', '629'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-repository-permission-grant',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-repository-permission-grant', '97a'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-repository-permission-list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-repository-permission-list', '86d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-repository-permission-revoke',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-repository-permission-revoke', 'e74'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-repository-update',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-repository-update', 'c6e'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-robot',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-robot', '30a'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-robot-create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-robot-create', 'f71'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-robot-delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-robot-delete', '9c4'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-robot-get',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-robot-get', '9a8'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-robot-list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-robot-list', '537'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-robot-team',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-robot-team', '572'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-robot-team-join',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-robot-team-join', '0bb'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-robot-team-leave',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-robot-team-leave', '673'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-robot-team-list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-robot-team-list', 'cd9'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-robot-token',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-robot-token', 'fda'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-robot-token-create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-robot-token-create', '2db'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-robot-token-delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-robot-token-delete', 'ac8'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-robot-token-get',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-robot-token-get', '3b2'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-robot-token-list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-robot-token-list', '7a8'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-space',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-space', '5c9'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-space-billing',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-space-billing', '13b'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-space-billing-export',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-space-billing-export', '115'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-space-connect',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-space-connect', 'b07'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-space-destroy',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-space-destroy', '2a2'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-space-disconnect',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-space-disconnect', '919'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-space-init',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-space-init', '8cf'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-space-list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-space-list', '494'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-space-mirror',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-space-mirror', 'f40'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-space-upgrade',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-space-upgrade', 'd4d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-team',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-team', '0f9'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-team-create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-team-create', 'f0f'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-team-delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-team-delete', '64b'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-team-get',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-team-get', 'da6'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-team-list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-team-list', '45a'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-test',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-test', '70b'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-test-generate',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-test-generate', '6c4'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-test-run',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-test-run', '398'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-token',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-token', '9fb'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-token-create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-token-create', '589'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-token-delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-token-delete', '218'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-token-get',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-token-get', 'c36'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-token-list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-token-list', 'c9d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-uxp',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-uxp', '3a2'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-uxp-install',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-uxp-install', '254'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-uxp-uninstall',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-uxp-uninstall', '363'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-uxp-upgrade',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-uxp-upgrade', 'acb'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-version',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-version', '9af'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-xpkg',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-xpkg', '33a'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-xpkg-append',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-xpkg-append', 'f83'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-xpkg-batch',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-xpkg-batch', '270'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-xpkg-build',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-xpkg-build', 'aab'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-xpkg-push',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-xpkg-push', 'c81'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-xpkg-xp-extract',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-xpkg-xp-extract', '0ec'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-xpls',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-xpls', '4a0'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-xpls-serve',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-xpls-serve', 'd9c'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-xrd',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-xrd', 'e47'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up-xrd-generate',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up-xrd-generate', '645'),
                exact: true
              },
              {
                path: '/apis-cli/query-api/',
                component: ComponentCreator('/apis-cli/query-api/', 'c33'),
                exact: true,
                sidebar: "apisCliSidebar"
              },
              {
                path: '/apis-cli/spaces-api/',
                component: ComponentCreator('/apis-cli/spaces-api/', '16e'),
                exact: true,
                sidebar: "apisCliSidebar"
              },
              {
                path: '/apis-cli/spaces-api/v1_10',
                component: ComponentCreator('/apis-cli/spaces-api/v1_10', '285'),
                exact: true,
                sidebar: "apisCliSidebar"
              },
              {
                path: '/apis-cli/spaces-api/v1_11',
                component: ComponentCreator('/apis-cli/spaces-api/v1_11', '841'),
                exact: true,
                sidebar: "apisCliSidebar"
              },
              {
                path: '/apis-cli/spaces-api/v1_12',
                component: ComponentCreator('/apis-cli/spaces-api/v1_12', '954'),
                exact: true,
                sidebar: "apisCliSidebar"
              },
              {
                path: '/apis-cli/spaces-api/v1_9',
                component: ComponentCreator('/apis-cli/spaces-api/v1_9', '651'),
                exact: true,
                sidebar: "apisCliSidebar"
              },
              {
                path: '/apis-cli/spaces-api/yaml/v1.13/',
                component: ComponentCreator('/apis-cli/spaces-api/yaml/v1.13/', '7ae'),
                exact: true
              },
              {
                path: '/apis-cli/testing-api/',
                component: ComponentCreator('/apis-cli/testing-api/', '7e6'),
                exact: true,
                sidebar: "apisCliSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/build',
    component: ComponentCreator('/build', '457'),
    routes: [
      {
        path: '/build',
        component: ComponentCreator('/build', '219'),
        routes: [
          {
            path: '/build',
            component: ComponentCreator('/build', '599'),
            routes: [
              {
                path: '/build/',
                component: ComponentCreator('/build/', '7bc'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/',
                component: ComponentCreator('/build/control-plane-projects/', 'f62'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/adding-dependencies',
                component: ComponentCreator('/build/control-plane-projects/adding-dependencies', '9ba'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/', 'd8a'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/go-templating/',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/go-templating/', '609'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/go-templating/inputs-outputs',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/go-templating/inputs-outputs', 'bac'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/go-templating/schemas',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/go-templating/schemas', '5dc'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/go/',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/go/', '1a2'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/go/inputs-outputs',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/go/inputs-outputs', '8f3'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/go/models',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/go/models', '2c0'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/kcl/',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/kcl/', '71f'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/kcl/conditionals',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/kcl/conditionals', '402'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/kcl/inputs-outputs',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/kcl/inputs-outputs', '26d'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/kcl/loops',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/kcl/loops', '1ae'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/kcl/read-pipeline-state',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/kcl/read-pipeline-state', '8c7'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/kcl/resource-data-extraction',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/kcl/resource-data-extraction', '9d6'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/kcl/resource-schemas',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/kcl/resource-schemas', 'd1b'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/kcl/variables',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/kcl/variables', '310'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/kcl/write-status-to-composite',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/kcl/write-status-to-composite', 'b23'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/python/',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/python/', '8cd'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/python/inputs-outputs',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/python/inputs-outputs', '960'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-compositions/python/models',
                component: ComponentCreator('/build/control-plane-projects/authoring-compositions/python/models', '34b'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/authoring-xrds',
                component: ComponentCreator('/build/control-plane-projects/authoring-xrds', 'b1f'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/building-pushing',
                component: ComponentCreator('/build/control-plane-projects/building-pushing', '600'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/simulations',
                component: ComponentCreator('/build/control-plane-projects/simulations', '927'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/control-plane-projects/testing',
                component: ComponentCreator('/build/control-plane-projects/testing', '1ad'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/controllers',
                component: ComponentCreator('/build/controllers', 'bb0'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/migrating-to-mcps',
                component: ComponentCreator('/build/migrating-to-mcps', '0b3'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/provider-authentication',
                component: ComponentCreator('/build/provider-authentication', '8a7'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/repositories/',
                component: ComponentCreator('/build/repositories/', '39d'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/repositories/management',
                component: ComponentCreator('/build/repositories/management', '332'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/repositories/publish-packages',
                component: ComponentCreator('/build/repositories/publish-packages', 'b7b'),
                exact: true,
                sidebar: "buildSidebar"
              },
              {
                path: '/build/repositories/store-configurations',
                component: ComponentCreator('/build/repositories/store-configurations', '6ac'),
                exact: true,
                sidebar: "buildSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/connect',
    component: ComponentCreator('/connect', '7c3'),
    routes: [
      {
        path: '/connect',
        component: ComponentCreator('/connect', '715'),
        routes: [
          {
            path: '/connect',
            component: ComponentCreator('/connect', 'ea1'),
            routes: [
              {
                path: '/connect/declarative-ctps',
                component: ComponentCreator('/connect/declarative-ctps', '574'),
                exact: true,
                sidebar: "connectSidebar"
              },
              {
                path: '/connect/git-integration',
                component: ComponentCreator('/connect/git-integration', 'ef9'),
                exact: true,
                sidebar: "connectSidebar"
              },
              {
                path: '/connect/gitops',
                component: ComponentCreator('/connect/gitops', '960'),
                exact: true,
                sidebar: "connectSidebar"
              },
              {
                path: '/connect/mcp-connector-guide',
                component: ComponentCreator('/connect/mcp-connector-guide', 'd50'),
                exact: true,
                sidebar: "connectSidebar"
              },
              {
                path: '/connect/oidc',
                component: ComponentCreator('/connect/oidc', 'c22'),
                exact: true,
                sidebar: "connectSidebar"
              },
              {
                path: '/connect/query-api',
                component: ComponentCreator('/connect/query-api', '88e'),
                exact: true,
                sidebar: "connectSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/crossplane/api-ref',
    component: ComponentCreator('/crossplane/api-ref', '6db'),
    routes: [
      {
        path: '/crossplane/api-ref',
        component: ComponentCreator('/crossplane/api-ref', '25a'),
        routes: [
          {
            path: '/crossplane/api-ref',
            component: ComponentCreator('/crossplane/api-ref', 'dcf'),
            routes: [
              {
                path: '/crossplane/api-ref/',
                component: ComponentCreator('/crossplane/api-ref/', '252'),
                exact: true,
                sidebar: "apiRefSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/crossplane/learn',
    component: ComponentCreator('/crossplane/learn', '5c5'),
    routes: [
      {
        path: '/crossplane/learn',
        component: ComponentCreator('/crossplane/learn', '11e'),
        routes: [
          {
            path: '/crossplane/learn',
            component: ComponentCreator('/crossplane/learn', 'c20'),
            routes: [
              {
                path: '/crossplane/learn/get-started-compositions',
                component: ComponentCreator('/crossplane/learn/get-started-compositions', '1cd'),
                exact: true,
                sidebar: "crossplaneLearnSidebar"
              },
              {
                path: '/crossplane/learn/get-started-mr',
                component: ComponentCreator('/crossplane/learn/get-started-mr', '072'),
                exact: true,
                sidebar: "crossplaneLearnSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/deploy',
    component: ComponentCreator('/deploy', '449'),
    routes: [
      {
        path: '/deploy',
        component: ComponentCreator('/deploy', '3ba'),
        routes: [
          {
            path: '/deploy',
            component: ComponentCreator('/deploy', '0c1'),
            routes: [
              {
                path: '/deploy/',
                component: ComponentCreator('/deploy/', '15e'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/backup-and-restore',
                component: ComponentCreator('/deploy/backup-and-restore', '088'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/control-plane-topologies',
                component: ComponentCreator('/deploy/control-plane-topologies', '32d'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/dedicated-spaces/',
                component: ComponentCreator('/deploy/dedicated-spaces/', 'f1b'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/dedicated-spaces/aws',
                component: ComponentCreator('/deploy/dedicated-spaces/aws', 'faf'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/dedicated-spaces/gcp',
                component: ComponentCreator('/deploy/dedicated-spaces/gcp', '7f8'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/query-api',
                component: ComponentCreator('/deploy/query-api', 'abc'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/',
                component: ComponentCreator('/deploy/self-hosted-spaces/', 'd85'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/attach-detach',
                component: ComponentCreator('/deploy/self-hosted-spaces/attach-detach', 'ee2'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/aws/',
                component: ComponentCreator('/deploy/self-hosted-spaces/aws/', '51e'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/aws/workload-id-backup-restore',
                component: ComponentCreator('/deploy/self-hosted-spaces/aws/workload-id-backup-restore', '913'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/azure/',
                component: ComponentCreator('/deploy/self-hosted-spaces/azure/', 'aaf'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/billing',
                component: ComponentCreator('/deploy/self-hosted-spaces/billing', 'f16'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/deployment',
                component: ComponentCreator('/deploy/self-hosted-spaces/deployment', '66a'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/dr',
                component: ComponentCreator('/deploy/self-hosted-spaces/dr', 'c9e'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/gcp/',
                component: ComponentCreator('/deploy/self-hosted-spaces/gcp/', '3b4'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/helm-reference',
                component: ComponentCreator('/deploy/self-hosted-spaces/helm-reference', 'd77'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/proxies-config',
                component: ComponentCreator('/deploy/self-hosted-spaces/proxies-config', '45b'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/scaling-resources',
                component: ComponentCreator('/deploy/self-hosted-spaces/scaling-resources', '1ae'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/self-hosted-qs',
                component: ComponentCreator('/deploy/self-hosted-spaces/self-hosted-qs', '203'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/space-observability',
                component: ComponentCreator('/deploy/self-hosted-spaces/space-observability', '563'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/spaces-management',
                component: ComponentCreator('/deploy/self-hosted-spaces/spaces-management', '4ef'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/troubleshooting',
                component: ComponentCreator('/deploy/self-hosted-spaces/troubleshooting', 'd8d'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/self-hosted-spaces/use-argo',
                component: ComponentCreator('/deploy/self-hosted-spaces/use-argo', '003'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/spaces/',
                component: ComponentCreator('/deploy/spaces/', '541'),
                exact: true,
                sidebar: "deploySidebar"
              },
              {
                path: '/deploy/spaces/console',
                component: ComponentCreator('/deploy/spaces/console', '06a'),
                exact: true,
                sidebar: "deploySidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/operate',
    component: ComponentCreator('/operate', 'c06'),
    routes: [
      {
        path: '/operate',
        component: ComponentCreator('/operate', '371'),
        routes: [
          {
            path: '/operate',
            component: ComponentCreator('/operate', '07f'),
            routes: [
              {
                path: '/operate/accounts/',
                component: ComponentCreator('/operate/accounts/', 'd25'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/accounts/authentication/enable-sso',
                component: ComponentCreator('/operate/accounts/authentication/enable-sso', 'b92'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/accounts/authentication/oidc-configuration',
                component: ComponentCreator('/operate/accounts/authentication/oidc-configuration', 'dcf'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/accounts/authorization/hub-rbac',
                component: ComponentCreator('/operate/accounts/authorization/hub-rbac', 'b29'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/accounts/authorization/k8s-rbac',
                component: ComponentCreator('/operate/accounts/authorization/k8s-rbac', '5ed'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/accounts/authorization/upbound-rbac',
                component: ComponentCreator('/operate/accounts/authorization/upbound-rbac', '4c6'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/accounts/identity-management/organizations',
                component: ComponentCreator('/operate/accounts/identity-management/organizations', 'cd1'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/accounts/identity-management/robots',
                component: ComponentCreator('/operate/accounts/identity-management/robots', '0ee'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/accounts/identity-management/teams',
                component: ComponentCreator('/operate/accounts/identity-management/teams', '72c'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/accounts/identity-management/users',
                component: ComponentCreator('/operate/accounts/identity-management/users', '40e'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/auto-upgrade',
                component: ComponentCreator('/operate/auto-upgrade', 'c6f'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/cli/',
                component: ComponentCreator('/operate/cli/', '807'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/cli/configuration',
                component: ComponentCreator('/operate/cli/configuration', '4cd'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/cli/contexts',
                component: ComponentCreator('/operate/cli/contexts', '6fd'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/control-planes',
                component: ComponentCreator('/operate/control-planes', '0ea'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/ctp-connector',
                component: ComponentCreator('/operate/ctp-connector', 'c98'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/debugging-a-ctp',
                component: ComponentCreator('/operate/debugging-a-ctp', '2f5'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/groups',
                component: ComponentCreator('/operate/groups', '083'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/observability',
                component: ComponentCreator('/operate/observability', 'f0f'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/secrets-management',
                component: ComponentCreator('/operate/secrets-management', '7ec'),
                exact: true,
                sidebar: "operateSidebar"
              },
              {
                path: '/operate/simulations',
                component: ComponentCreator('/operate/simulations', 'cd1'),
                exact: true,
                sidebar: "operateSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/providers',
    component: ComponentCreator('/providers', '784'),
    routes: [
      {
        path: '/providers',
        component: ComponentCreator('/providers', '12b'),
        routes: [
          {
            path: '/providers',
            component: ComponentCreator('/providers', 'b4d'),
            routes: [
              {
                path: '/providers/',
                component: ComponentCreator('/providers/', '2df'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/faq',
                component: ComponentCreator('/providers/faq', '52c'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/migration',
                component: ComponentCreator('/providers/migration', '431'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/monolithic',
                component: ComponentCreator('/providers/monolithic', 'cc5'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/policies',
                component: ComponentCreator('/providers/policies', '5cc'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/provider-aws/',
                component: ComponentCreator('/providers/provider-aws/', '6a0'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/provider-aws/authentication',
                component: ComponentCreator('/providers/provider-aws/authentication', '9fe'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/provider-azure/',
                component: ComponentCreator('/providers/provider-azure/', '550'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/provider-azure/authentication',
                component: ComponentCreator('/providers/provider-azure/authentication', '9bb'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/provider-azuread/',
                component: ComponentCreator('/providers/provider-azuread/', '9fc'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/provider-families',
                component: ComponentCreator('/providers/provider-families', '957'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/provider-gcp/',
                component: ComponentCreator('/providers/provider-gcp/', '73d'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/provider-gcp/authentication',
                component: ComponentCreator('/providers/provider-gcp/authentication', '786'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/provider-helm/',
                component: ComponentCreator('/providers/provider-helm/', 'd4d'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/provider-kubernetes/',
                component: ComponentCreator('/providers/provider-kubernetes/', '1a0'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/provider-kubernetes/authentication',
                component: ComponentCreator('/providers/provider-kubernetes/authentication', 'e2c'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/provider-terraform/',
                component: ComponentCreator('/providers/provider-terraform/', '476'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/provider-terraform/migrate-hcl',
                component: ComponentCreator('/providers/provider-terraform/migrate-hcl', '553'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/provider-terraform/migrate-provider-tf',
                component: ComponentCreator('/providers/provider-terraform/migrate-provider-tf', 'a17'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/pull-secrets',
                component: ComponentCreator('/providers/pull-secrets', '3d2'),
                exact: true,
                sidebar: "providersSidebar"
              },
              {
                path: '/providers/signature-verification',
                component: ComponentCreator('/providers/signature-verification', 'ef1'),
                exact: true,
                sidebar: "providersSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/release-notes',
    component: ComponentCreator('/release-notes', 'a5f'),
    routes: [
      {
        path: '/release-notes',
        component: ComponentCreator('/release-notes', 'd4b'),
        routes: [
          {
            path: '/release-notes',
            component: ComponentCreator('/release-notes', 'b23'),
            routes: [
              {
                path: '/release-notes/',
                component: ComponentCreator('/release-notes/', 'd5b'),
                exact: true,
                sidebar: "releaseNotesSidebar"
              },
              {
                path: '/release-notes/rel-notes/mcp-connector',
                component: ComponentCreator('/release-notes/rel-notes/mcp-connector', '3aa'),
                exact: true,
                sidebar: "releaseNotesSidebar"
              },
              {
                path: '/release-notes/rel-notes/spaces',
                component: ComponentCreator('/release-notes/rel-notes/spaces', '720'),
                exact: true,
                sidebar: "releaseNotesSidebar"
              },
              {
                path: '/release-notes/rel-notes/up-cli',
                component: ComponentCreator('/release-notes/rel-notes/up-cli', '676'),
                exact: true,
                sidebar: "releaseNotesSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/upbound-marketplace',
    component: ComponentCreator('/upbound-marketplace', '6a5'),
    routes: [
      {
        path: '/upbound-marketplace',
        component: ComponentCreator('/upbound-marketplace', 'ec4'),
        routes: [
          {
            path: '/upbound-marketplace',
            component: ComponentCreator('/upbound-marketplace', '496'),
            routes: [
              {
                path: '/upbound-marketplace/',
                component: ComponentCreator('/upbound-marketplace/', '53a'),
                exact: true,
                sidebar: "marketplaceSidebar"
              },
              {
                path: '/upbound-marketplace/authentication',
                component: ComponentCreator('/upbound-marketplace/authentication', '763'),
                exact: true,
                sidebar: "marketplaceSidebar"
              },
              {
                path: '/upbound-marketplace/dmca',
                component: ComponentCreator('/upbound-marketplace/dmca', '7eb'),
                exact: true,
                sidebar: "marketplaceSidebar"
              },
              {
                path: '/upbound-marketplace/packages',
                component: ComponentCreator('/upbound-marketplace/packages', 'cfc'),
                exact: true,
                sidebar: "marketplaceSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/usage',
    component: ComponentCreator('/usage', '1e1'),
    routes: [
      {
        path: '/usage',
        component: ComponentCreator('/usage', '6d5'),
        routes: [
          {
            path: '/usage',
            component: ComponentCreator('/usage', '2f4'),
            routes: [
              {
                path: '/usage/',
                component: ComponentCreator('/usage/', '569'),
                exact: true,
                sidebar: "usageSidebar"
              },
              {
                path: '/usage/ipaddresses',
                component: ComponentCreator('/usage/ipaddresses', '537'),
                exact: true,
                sidebar: "usageSidebar"
              },
              {
                path: '/usage/licenses',
                component: ComponentCreator('/usage/licenses', '2f2'),
                exact: true,
                sidebar: "usageSidebar"
              },
              {
                path: '/usage/lifecycle',
                component: ComponentCreator('/usage/lifecycle', 'cc3'),
                exact: true,
                sidebar: "usageSidebar"
              },
              {
                path: '/usage/support',
                component: ComponentCreator('/usage/support', 'b1c'),
                exact: true,
                sidebar: "usageSidebar"
              },
              {
                path: '/usage/vscode-extensions',
                component: ComponentCreator('/usage/vscode-extensions', 'cfc'),
                exact: true,
                sidebar: "usageSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e4e'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '40a'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', 'dae'),
            routes: [
              {
                path: '/builders-workshop/create-configuration',
                component: ComponentCreator('/builders-workshop/create-configuration', '22d'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/builders-workshop/deployment',
                component: ComponentCreator('/builders-workshop/deployment', '7e4'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/builders-workshop/project-foundations',
                component: ComponentCreator('/builders-workshop/project-foundations', '6c1'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/builders-workshop/testing',
                component: ComponentCreator('/builders-workshop/testing', 'f87'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/consumer-portal-get-started',
                component: ComponentCreator('/consumer-portal-get-started', 'cad'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/core-concepts/claims',
                component: ComponentCreator('/core-concepts/claims', 'c7d'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/core-concepts/compositions',
                component: ComponentCreator('/core-concepts/compositions', 'd25'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/core-concepts/control-planes',
                component: ComponentCreator('/core-concepts/control-planes', '822'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/core-concepts/functions',
                component: ComponentCreator('/core-concepts/functions', 'e68'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/core-concepts/managed-control-planes',
                component: ComponentCreator('/core-concepts/managed-control-planes', '33a'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/core-concepts/projects',
                component: ComponentCreator('/core-concepts/projects', 'cfa'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/core-concepts/providers',
                component: ComponentCreator('/core-concepts/providers', 'ff0'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/core-concepts/xrds',
                component: ComponentCreator('/core-concepts/xrds', '769'),
                exact: true,
                sidebar: "learnSidebar"
              },
              {
                path: '/',
                component: ComponentCreator('/', '865'),
                exact: true,
                sidebar: "learnSidebar"
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
