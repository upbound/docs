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
    component: ComponentCreator('/', '958'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '540'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '364'),
            routes: [
              {
                path: '/reference/',
                component: ComponentCreator('/reference/', '96b'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/apis/',
                component: ComponentCreator('/reference/apis/', 'dfc'),
                exact: true
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
                component: ComponentCreator('/reference/apis/spaces-api/yaml/v1.13/', '176'),
                exact: true
              },
              {
                path: '/reference/apis/testing-api/',
                component: ComponentCreator('/reference/apis/testing-api/', '7b7'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/cli/cli-reference/',
                component: ComponentCreator('/reference/cli/cli-reference/', '301'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/cli/cli-reference/yaml/up',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up', '919'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha', 'ec6'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha_ctx',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha_ctx', '8be'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha_migration',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha_migration', 'd3c'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha_migration_export',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha_migration_export', 'f7c'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha_migration_import',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha_migration_import', '5c2'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha_migration_pause-toggle',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha_migration_pause-toggle', 'a09'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha_space',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha_space', '4d2'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha_space_billing',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha_space_billing', '0c4'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha_space_billing_export',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha_space_billing_export', '21b'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha_space_connect_(attach)',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha_space_connect_(attach)', '6de'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha_space_destroy',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha_space_destroy', '6dc'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha_space_disconnect_(detach)',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha_space_disconnect_(detach)', '5c3'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha_space_init',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha_space_init', '8ab'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha_space_list',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha_space_list', '887'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha_space_mirror',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha_space_mirror', 'f31'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_alpha_space_upgrade',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_alpha_space_upgrade', '516'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_completion',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_completion', '997'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_composition',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_composition', '836'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_composition_generate',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_composition_generate', 'cef'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_composition_render',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_composition_render', '8ac'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)', 'dd2'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_configuration',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_configuration', '57b'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_configuration_install',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_configuration_install', '142'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_connect',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_connect', '99a'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_connector',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_connector', 'fa3'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_connector_install',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_connector_install', '3de'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_connector_uninstall',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_connector_uninstall', '8c3'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_create',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_create', 'fa0'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_delete',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_delete', '773'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_disconnect',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_disconnect', 'be2'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_function',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_function', '082'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_function_install',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_function_install', '892'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_get',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_get', 'a30'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_list',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_list', '6c0'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_provider',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_provider', '376'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_provider_install',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_provider_install', 'b56'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_pull-secret',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_pull-secret', 'bba'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_pull-secret_create',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_pull-secret_create', 'a03'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_simulate',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_simulate', 'd06'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)', 'de1'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)_create',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)_create', 'f09'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)_delete',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)_delete', '950'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)_list',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)_list', '1e9'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_ctx',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_ctx', '898'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_dependency_(dep)',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_dependency_(dep)', '602'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_dependency_(dep)_add',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_dependency_(dep)_add', '6ee'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_dependency_(dep)_clean-cache',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_dependency_(dep)_clean-cache', '977'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_dependency_(dep)_update-cache',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_dependency_(dep)_update-cache', '90a'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_example',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_example', '64f'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_example_generate',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_example_generate', '0c3'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_function',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_function', '475'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_function_generate',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_function_generate', '53d'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_group',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_group', '0b3'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_group_create',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_group_create', '6d6'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_group_delete',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_group_delete', '0bd'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_group_get',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_group_get', '0b5'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_group_list',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_group_list', 'f4a'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_help',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_help', 'c36'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_license',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_license', 'e3c'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_login',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_login', 'aa8'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_logout',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_logout', 'b84'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_organization_(org)',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_organization_(org)', '0d9'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_organization_(org)_create',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_organization_(org)_create', '99e'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_organization_(org)_delete',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_organization_(org)_delete', '46a'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_organization_(org)_get',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_organization_(org)_get', 'bf4'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_organization_(org)_list',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_organization_(org)_list', 'b53'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_organization_(org)_token',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_organization_(org)_token', '836'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_organization_(org)_user',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_organization_(org)_user', '640'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_organization_(org)_user_invite',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_organization_(org)_user_invite', '174'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_organization_(org)_user_list',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_organization_(org)_user_list', 'cec'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_organization_(org)_user_remove',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_organization_(org)_user_remove', '473'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_profile',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_profile', '5e8'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_profile_create',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_profile_create', '2fe'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_profile_current',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_profile_current', 'e90'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_profile_delete',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_profile_delete', 'f4d'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_profile_list',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_profile_list', 'e14'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_profile_rename',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_profile_rename', 'fc9'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_profile_set',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_profile_set', 'd6e'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_profile_use',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_profile_use', '18f'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_profile_view',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_profile_view', 'f1f'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_project',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_project', '804'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_project_build',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_project_build', '97e'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_project_init',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_project_init', '5b6'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_project_move',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_project_move', '739'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_project_push',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_project_push', '462'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_project_run',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_project_run', '806'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_project_simulate',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_project_simulate', '5a0'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_project_simulation',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_project_simulation', 'e92'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_project_simulation_complete',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_project_simulation_complete', '14f'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_project_simulation_create',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_project_simulation_create', 'e45'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_project_simulation_delete',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_project_simulation_delete', '8ea'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_repository_(repo)',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_repository_(repo)', 'c3c'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_repository_(repo)_create',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_repository_(repo)_create', '161'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_repository_(repo)_delete',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_repository_(repo)_delete', 'abb'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_repository_(repo)_get',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_repository_(repo)_get', '2b1'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_repository_(repo)_list',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_repository_(repo)_list', 'f00'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_repository_(repo)_permission',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_repository_(repo)_permission', '97c'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_repository_(repo)_permission_grant',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_repository_(repo)_permission_grant', '8f6'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_repository_(repo)_permission_list',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_repository_(repo)_permission_list', '7bd'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_repository_(repo)_permission_revoke',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_repository_(repo)_permission_revoke', '221'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_repository_(repo)_update',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_repository_(repo)_update', '416'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_robot',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_robot', '546'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_robot_create',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_robot_create', 'ddb'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_robot_delete',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_robot_delete', '957'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_robot_get',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_robot_get', '611'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_robot_list',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_robot_list', '2f4'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_robot_team',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_robot_team', 'a2b'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_robot_team_join',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_robot_team_join', '3ea'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_robot_team_leave',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_robot_team_leave', '6dd'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_robot_team_list',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_robot_team_list', '9f7'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_robot_token',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_robot_token', '1b7'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_robot_token_create',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_robot_token_create', '903'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_robot_token_delete',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_robot_token_delete', 'e60'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_robot_token_get',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_robot_token_get', 'b14'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_robot_token_list',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_robot_token_list', 'a1f'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_space',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_space', '24d'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_space_billing',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_space_billing', 'd29'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_space_billing_export',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_space_billing_export', 'ac7'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_space_connect_(attach)',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_space_connect_(attach)', '3e2'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_space_destroy',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_space_destroy', '087'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_space_disconnect_(detach)',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_space_disconnect_(detach)', '6e1'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_space_init',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_space_init', '879'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_space_list',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_space_list', '2b0'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_space_mirror',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_space_mirror', '585'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_space_upgrade',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_space_upgrade', 'fe3'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_team',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_team', 'f87'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_team_create',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_team_create', 'b79'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_team_delete',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_team_delete', '5ff'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_team_get',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_team_get', '00d'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_team_list',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_team_list', '38d'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_test',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_test', '11f'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_test_generate',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_test_generate', 'acf'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_test_run',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_test_run', '9e4'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_uxp',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_uxp', 'b7c'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_uxp_install',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_uxp_install', 'e3e'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_uxp_uninstall',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_uxp_uninstall', '5f2'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_uxp_upgrade',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_uxp_upgrade', '0b7'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_version',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_version', 'f99'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_xpkg',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_xpkg', '9bf'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_xpkg_append',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_xpkg_append', '75a'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_xpkg_batch',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_xpkg_batch', '212'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_xpkg_build',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_xpkg_build', '423'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_xpkg_push',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_xpkg_push', 'c3c'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_xpkg_xp-extract',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_xpkg_xp-extract', '22a'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_xpls',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_xpls', '265'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_xpls_serve',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_xpls_serve', '35e'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_xrd',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_xrd', 'b07'),
                exact: true
              },
              {
                path: '/reference/cli/cli-reference/yaml/up_xrd_generate',
                component: ComponentCreator('/reference/cli/cli-reference/yaml/up_xrd_generate', 'd1e'),
                exact: true
              },
              {
                path: '/reference/crossplane-vs-upbound',
                component: ComponentCreator('/reference/crossplane-vs-upbound', '049'),
                exact: true
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
                component: ComponentCreator('/reference/providers/faq', '212'),
                exact: true
              },
              {
                path: '/reference/providers/migration',
                component: ComponentCreator('/reference/providers/migration', '819'),
                exact: true
              },
              {
                path: '/reference/providers/monolithic',
                component: ComponentCreator('/reference/providers/monolithic', 'c5c'),
                exact: true
              },
              {
                path: '/reference/providers/policies',
                component: ComponentCreator('/reference/providers/policies', 'ecf'),
                exact: true
              },
              {
                path: '/reference/providers/provider-aws/',
                component: ComponentCreator('/reference/providers/provider-aws/', 'a71'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-aws/authentication',
                component: ComponentCreator('/reference/providers/provider-aws/authentication', '068'),
                exact: true
              },
              {
                path: '/reference/providers/provider-azure/',
                component: ComponentCreator('/reference/providers/provider-azure/', '26b'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-azure/authentication',
                component: ComponentCreator('/reference/providers/provider-azure/authentication', '21a'),
                exact: true
              },
              {
                path: '/reference/providers/provider-azuread/',
                component: ComponentCreator('/reference/providers/provider-azuread/', '27d'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-families',
                component: ComponentCreator('/reference/providers/provider-families', 'c20'),
                exact: true
              },
              {
                path: '/reference/providers/provider-gcp/',
                component: ComponentCreator('/reference/providers/provider-gcp/', '54c'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-gcp/authentication',
                component: ComponentCreator('/reference/providers/provider-gcp/authentication', '4d8'),
                exact: true
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
                component: ComponentCreator('/reference/providers/provider-kubernetes/authentication', '022'),
                exact: true
              },
              {
                path: '/reference/providers/provider-terraform/',
                component: ComponentCreator('/reference/providers/provider-terraform/', '78e'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/providers/provider-terraform/migrate-hcl',
                component: ComponentCreator('/reference/providers/provider-terraform/migrate-hcl', '000'),
                exact: true
              },
              {
                path: '/reference/providers/provider-terraform/migrate-provider-tf',
                component: ComponentCreator('/reference/providers/provider-terraform/migrate-provider-tf', '2cb'),
                exact: true
              },
              {
                path: '/reference/providers/pull-secrets',
                component: ComponentCreator('/reference/providers/pull-secrets', 'bc9'),
                exact: true
              },
              {
                path: '/reference/providers/signature-verification',
                component: ComponentCreator('/reference/providers/signature-verification', 'a58'),
                exact: true
              },
              {
                path: '/reference/release-notes/',
                component: ComponentCreator('/reference/release-notes/', '708'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/release-notes/rel-notes/mcp-connector',
                component: ComponentCreator('/reference/release-notes/rel-notes/mcp-connector', 'a88'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/release-notes/rel-notes/spaces',
                component: ComponentCreator('/reference/release-notes/rel-notes/spaces', '3b0'),
                exact: true,
                sidebar: "referenceSidebar"
              },
              {
                path: '/reference/release-notes/rel-notes/up-cli',
                component: ComponentCreator('/reference/release-notes/rel-notes/up-cli', 'c10'),
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
                path: '/shared/crossplane/',
                component: ComponentCreator('/shared/crossplane/', 'ee5'),
                exact: true
              },
              {
                path: '/shared/crossplane/api/',
                component: ComponentCreator('/shared/crossplane/api/', '790'),
                exact: true
              },
              {
                path: '/shared/crossplane/composition/',
                component: ComponentCreator('/shared/crossplane/composition/', '286'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/composition/composite-resource-definitions',
                component: ComponentCreator('/shared/crossplane/composition/composite-resource-definitions', '401'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/composition/composite-resources',
                component: ComponentCreator('/shared/crossplane/composition/composite-resources', 'a25'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/composition/composition-revisions',
                component: ComponentCreator('/shared/crossplane/composition/composition-revisions', 'b5e'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/composition/compositions',
                component: ComponentCreator('/shared/crossplane/composition/compositions', '5e6'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/composition/environment-configs',
                component: ComponentCreator('/shared/crossplane/composition/environment-configs', '694'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/get-started/',
                component: ComponentCreator('/shared/crossplane/get-started/', 'c83'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/get-started/get-started-with-composition',
                component: ComponentCreator('/shared/crossplane/get-started/get-started-with-composition', '313'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/get-started/get-started-with-managed-resources',
                component: ComponentCreator('/shared/crossplane/get-started/get-started-with-managed-resources', 'd5a'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/get-started/install',
                component: ComponentCreator('/shared/crossplane/get-started/install', 'f31'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/guides/',
                component: ComponentCreator('/shared/crossplane/guides/', '35a'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/guides/crossplane-with-argo-cd',
                component: ComponentCreator('/shared/crossplane/guides/crossplane-with-argo-cd', '2c3'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/guides/extensions-release-process',
                component: ComponentCreator('/shared/crossplane/guides/extensions-release-process', '05d'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/guides/function-patch-and-transform',
                component: ComponentCreator('/shared/crossplane/guides/function-patch-and-transform', '810'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/guides/metrics',
                component: ComponentCreator('/shared/crossplane/guides/metrics', '550'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/guides/pods',
                component: ComponentCreator('/shared/crossplane/guides/pods', '311'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/guides/self-signed-ca-certs',
                component: ComponentCreator('/shared/crossplane/guides/self-signed-ca-certs', '8a6'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/guides/troubleshoot-crossplane',
                component: ComponentCreator('/shared/crossplane/guides/troubleshoot-crossplane', '0ba'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/guides/uninstall-crossplane',
                component: ComponentCreator('/shared/crossplane/guides/uninstall-crossplane', '41c'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/guides/upgrade-crossplane',
                component: ComponentCreator('/shared/crossplane/guides/upgrade-crossplane', 'ffd'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/guides/write-a-composition-function-in-go',
                component: ComponentCreator('/shared/crossplane/guides/write-a-composition-function-in-go', '99d'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/guides/write-a-composition-function-in-python',
                component: ComponentCreator('/shared/crossplane/guides/write-a-composition-function-in-python', '619'),
                exact: true,
                sidebar: "crossplaneSidebar"
              },
              {
                path: '/shared/crossplane/managed-resources/',
                component: ComponentCreator('/shared/crossplane/managed-resources/', 'aa2'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/crossplane/managed-resources/',
                component: ComponentCreator('/shared/crossplane/managed-resources/', 'fea'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/crossplane/managed-resources/usages',
                component: ComponentCreator('/shared/crossplane/managed-resources/usages', '05d'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/crossplane/packages/',
                component: ComponentCreator('/shared/crossplane/packages/', '979'),
                exact: true
              },
              {
                path: '/shared/crossplane/packages/configurations',
                component: ComponentCreator('/shared/crossplane/packages/configurations', '9c2'),
                exact: true
              },
              {
                path: '/shared/crossplane/packages/functions',
                component: ComponentCreator('/shared/crossplane/packages/functions', 'cda'),
                exact: true
              },
              {
                path: '/shared/crossplane/packages/image-configs',
                component: ComponentCreator('/shared/crossplane/packages/image-configs', 'fe9'),
                exact: true
              },
              {
                path: '/shared/crossplane/packages/providers',
                component: ComponentCreator('/shared/crossplane/packages/providers', '187'),
                exact: true
              },
              {
                path: '/shared/crossplane/whats-crossplane/',
                component: ComponentCreator('/shared/crossplane/whats-crossplane/', 'ece'),
                exact: true
              },
              {
                path: '/shared/fundamentals/builders-workshop/create-configuration',
                component: ComponentCreator('/shared/fundamentals/builders-workshop/create-configuration', '59e'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/builders-workshop/deployment',
                component: ComponentCreator('/shared/fundamentals/builders-workshop/deployment', '24f'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/builders-workshop/project-foundations',
                component: ComponentCreator('/shared/fundamentals/builders-workshop/project-foundations', '87c'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/builders-workshop/testing',
                component: ComponentCreator('/shared/fundamentals/builders-workshop/testing', 'a3e'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/consumer-portal-get-started',
                component: ComponentCreator('/shared/fundamentals/consumer-portal-get-started', '410'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/',
                component: ComponentCreator('/shared/fundamentals/control-planes/', '500'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/', '31f'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/adding-dependencies',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/adding-dependencies', '72d'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/', '41b'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/go-templating/',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/go-templating/', 'acd'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/go-templating/inputs-outputs',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/go-templating/inputs-outputs', '086'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/go-templating/schemas',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/go-templating/schemas', '035'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/go/',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/go/', '544'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/go/inputs-outputs',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/go/inputs-outputs', 'efb'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/go/models',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/go/models', '0b1'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/', '437'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/conditionals',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/conditionals', '07a'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/inputs-outputs',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/inputs-outputs', '50b'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/loops',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/loops', 'e74'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/read-pipeline-state',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/read-pipeline-state', '22d'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/resource-data-extraction',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/resource-data-extraction', '4e7'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/resource-schemas',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/resource-schemas', 'f95'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/variables',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/variables', 'b59'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/write-status-to-composite',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/kcl/write-status-to-composite', '86c'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/python/',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/python/', '4fb'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/python/inputs-outputs',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/python/inputs-outputs', 'e0b'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/python/models',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-compositions/python/models', '9e5'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/authoring-xrds',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/authoring-xrds', '31d'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/building-pushing',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/building-pushing', '5c5'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/simulations',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/simulations', '702'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/control-plane-projects/testing',
                component: ComponentCreator('/shared/fundamentals/control-planes/control-plane-projects/testing', '42d'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/controllers',
                component: ComponentCreator('/shared/fundamentals/control-planes/controllers', '32d'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/migrating-to-mcps',
                component: ComponentCreator('/shared/fundamentals/control-planes/migrating-to-mcps', '6ee'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/provider-authentication',
                component: ComponentCreator('/shared/fundamentals/control-planes/provider-authentication', '0d3'),
                exact: true
              },
              {
                path: '/shared/fundamentals/control-planes/repositories/',
                component: ComponentCreator('/shared/fundamentals/control-planes/repositories/', '759'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/control-planes/repositories/management',
                component: ComponentCreator('/shared/fundamentals/control-planes/repositories/management', '12b'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/control-planes/repositories/publish-packages',
                component: ComponentCreator('/shared/fundamentals/control-planes/repositories/publish-packages', '6ef'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/control-planes/repositories/store-configurations',
                component: ComponentCreator('/shared/fundamentals/control-planes/repositories/store-configurations', 'ca6'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/core-concepts/claims',
                component: ComponentCreator('/shared/fundamentals/core-concepts/claims', '0be'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/core-concepts/compositions',
                component: ComponentCreator('/shared/fundamentals/core-concepts/compositions', 'd0b'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/core-concepts/control-planes',
                component: ComponentCreator('/shared/fundamentals/core-concepts/control-planes', '0af'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/core-concepts/functions',
                component: ComponentCreator('/shared/fundamentals/core-concepts/functions', '8f2'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/core-concepts/managed-control-planes',
                component: ComponentCreator('/shared/fundamentals/core-concepts/managed-control-planes', '650'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/core-concepts/projects',
                component: ComponentCreator('/shared/fundamentals/core-concepts/projects', 'e09'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/core-concepts/providers',
                component: ComponentCreator('/shared/fundamentals/core-concepts/providers', '2e2'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/core-concepts/xrds',
                component: ComponentCreator('/shared/fundamentals/core-concepts/xrds', '28b'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/shared/fundamentals/get-started',
                component: ComponentCreator('/shared/fundamentals/get-started', '269'),
                exact: true,
                sidebar: "fundamentalsSidebar"
              },
              {
                path: '/solutions/idp-starter-kit',
                component: ComponentCreator('/solutions/idp-starter-kit', '381'),
                exact: true,
                sidebar: "solutionsSidebar"
              },
              {
                path: '/solutions/upbound-platform-ref',
                component: ComponentCreator('/solutions/upbound-platform-ref', 'e95'),
                exact: true
              },
              {
                path: '/upbound/',
                component: ComponentCreator('/upbound/', 'f85'),
                exact: true
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
                path: '/upbound/deploy/',
                component: ComponentCreator('/upbound/deploy/', 'd6a'),
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
