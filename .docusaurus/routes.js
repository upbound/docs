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
    component: ComponentCreator('/apis-cli', '7c8'),
    routes: [
      {
        path: '/apis-cli',
        component: ComponentCreator('/apis-cli', 'f0c'),
        routes: [
          {
            path: '/apis-cli',
            component: ComponentCreator('/apis-cli', '42e'),
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
                path: '/apis-cli/cli-reference/yaml/up_alpha',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha', '1a7'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_alpha_ctx',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha_ctx', '1a8'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_alpha_migration',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha_migration', '77d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_alpha_migration_export',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha_migration_export', '1e4'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_alpha_migration_import',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha_migration_import', 'ddc'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_alpha_migration_pause-toggle',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha_migration_pause-toggle', 'ffd'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_alpha_space',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha_space', 'b4d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_alpha_space_billing',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha_space_billing', '18e'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_alpha_space_billing_export',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha_space_billing_export', '2d5'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_alpha_space_connect_(attach)',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha_space_connect_(attach)', '882'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_alpha_space_destroy',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha_space_destroy', 'c80'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_alpha_space_disconnect_(detach)',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha_space_disconnect_(detach)', '651'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_alpha_space_init',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha_space_init', '1e1'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_alpha_space_list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha_space_list', '34a'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_alpha_space_mirror',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha_space_mirror', 'ff0'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_alpha_space_upgrade',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_alpha_space_upgrade', 'dc1'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_completion',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_completion', '063'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_composition',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_composition', '77f'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_composition_generate',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_composition_generate', 'd65'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_composition_render',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_composition_render', 'c77'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)', '578'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_configuration',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_configuration', '01f'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_configuration_install',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_configuration_install', '83d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_connect',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_connect', '6fc'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_connector',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_connector', '6d7'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_connector_install',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_connector_install', '4dd'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_connector_uninstall',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_connector_uninstall', '19c'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_create', 'b73'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_delete', '87b'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_disconnect',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_disconnect', 'bdd'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_function',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_function', '093'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_function_install',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_function_install', 'fc6'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_get',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_get', '317'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_list', 'ee5'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_provider',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_provider', '49f'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_provider_install',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_provider_install', 'b71'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_pull-secret',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_pull-secret', '44d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_pull-secret_create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_pull-secret_create', 'bdc'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_simulate',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_simulate', '059'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)', '3ee'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)_create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)_create', 'c09'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)_delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)_delete', 'f4d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)_list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_controlplane_(ctp)_simulation_(sim)_list', '0d2'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_ctx',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_ctx', '066'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_dependency_(dep)',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_dependency_(dep)', 'ff5'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_dependency_(dep)_add',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_dependency_(dep)_add', '9ac'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_dependency_(dep)_clean-cache',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_dependency_(dep)_clean-cache', 'b47'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_dependency_(dep)_update-cache',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_dependency_(dep)_update-cache', 'c60'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_example',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_example', 'c00'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_example_generate',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_example_generate', '47c'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_function',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_function', 'ba3'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_function_generate',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_function_generate', 'b82'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_group',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_group', '104'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_group_create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_group_create', '20c'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_group_delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_group_delete', 'aaa'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_group_get',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_group_get', '5b4'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_group_list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_group_list', '4ab'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_help',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_help', '94e'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_license',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_license', 'aa0'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_login',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_login', '2d2'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_logout',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_logout', '5a7'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_organization_(org)',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_organization_(org)', '904'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_organization_(org)_create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_organization_(org)_create', '68c'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_organization_(org)_delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_organization_(org)_delete', 'c7c'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_organization_(org)_get',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_organization_(org)_get', '70a'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_organization_(org)_list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_organization_(org)_list', '40f'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_organization_(org)_token',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_organization_(org)_token', '513'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_organization_(org)_user',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_organization_(org)_user', '192'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_organization_(org)_user_invite',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_organization_(org)_user_invite', '276'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_organization_(org)_user_list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_organization_(org)_user_list', 'f71'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_organization_(org)_user_remove',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_organization_(org)_user_remove', 'cc0'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_profile',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_profile', '785'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_profile_create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_profile_create', 'b9e'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_profile_current',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_profile_current', '50b'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_profile_delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_profile_delete', '919'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_profile_list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_profile_list', 'a60'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_profile_rename',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_profile_rename', '11f'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_profile_set',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_profile_set', '207'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_profile_use',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_profile_use', 'fe9'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_profile_view',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_profile_view', 'd5b'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_project',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_project', '066'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_project_build',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_project_build', '8d4'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_project_init',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_project_init', 'ee0'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_project_move',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_project_move', 'e48'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_project_push',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_project_push', '844'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_project_run',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_project_run', 'a61'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_project_simulate',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_project_simulate', 'ac6'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_project_simulation',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_project_simulation', '902'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_project_simulation_complete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_project_simulation_complete', '152'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_project_simulation_create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_project_simulation_create', 'af7'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_project_simulation_delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_project_simulation_delete', '7e3'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_repository_(repo)',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_repository_(repo)', 'a8b'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_repository_(repo)_create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_repository_(repo)_create', '14b'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_repository_(repo)_delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_repository_(repo)_delete', '1f6'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_repository_(repo)_get',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_repository_(repo)_get', '6c1'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_repository_(repo)_list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_repository_(repo)_list', '9c5'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_repository_(repo)_permission',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_repository_(repo)_permission', '845'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_repository_(repo)_permission_grant',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_repository_(repo)_permission_grant', '8df'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_repository_(repo)_permission_list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_repository_(repo)_permission_list', 'b82'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_repository_(repo)_permission_revoke',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_repository_(repo)_permission_revoke', '1cc'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_repository_(repo)_update',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_repository_(repo)_update', 'f97'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_robot',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_robot', '0e9'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_robot_create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_robot_create', 'bac'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_robot_delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_robot_delete', '35f'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_robot_get',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_robot_get', '5ab'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_robot_list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_robot_list', '520'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_robot_team',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_robot_team', 'f31'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_robot_team_join',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_robot_team_join', '707'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_robot_team_leave',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_robot_team_leave', 'ce1'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_robot_team_list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_robot_team_list', '47d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_robot_token',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_robot_token', '784'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_robot_token_create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_robot_token_create', '52a'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_robot_token_delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_robot_token_delete', 'a19'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_robot_token_get',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_robot_token_get', '7ee'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_robot_token_list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_robot_token_list', '589'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_space',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_space', 'a11'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_space_billing',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_space_billing', '0aa'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_space_billing_export',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_space_billing_export', '85b'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_space_connect_(attach)',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_space_connect_(attach)', 'fa0'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_space_destroy',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_space_destroy', '706'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_space_disconnect_(detach)',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_space_disconnect_(detach)', '604'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_space_init',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_space_init', '5ba'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_space_list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_space_list', 'ff6'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_space_mirror',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_space_mirror', '80e'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_space_upgrade',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_space_upgrade', '301'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_team',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_team', 'ca8'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_team_create',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_team_create', '08c'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_team_delete',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_team_delete', '3b6'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_team_get',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_team_get', '165'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_team_list',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_team_list', '6b1'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_test',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_test', 'e61'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_test_generate',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_test_generate', '7fa'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_test_run',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_test_run', '9bb'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_uxp',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_uxp', 'ead'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_uxp_install',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_uxp_install', '86a'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_uxp_uninstall',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_uxp_uninstall', 'd87'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_uxp_upgrade',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_uxp_upgrade', 'b70'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_version',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_version', 'dcc'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_xpkg',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_xpkg', 'a00'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_xpkg_append',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_xpkg_append', '679'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_xpkg_batch',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_xpkg_batch', '7c0'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_xpkg_build',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_xpkg_build', 'e75'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_xpkg_push',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_xpkg_push', '71d'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_xpkg_xp-extract',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_xpkg_xp-extract', 'd8c'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_xpls',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_xpls', '22c'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_xpls_serve',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_xpls_serve', 'e3c'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_xrd',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_xrd', 'de4'),
                exact: true
              },
              {
                path: '/apis-cli/cli-reference/yaml/up_xrd_generate',
                component: ComponentCreator('/apis-cli/cli-reference/yaml/up_xrd_generate', '6a9'),
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
    path: '/solutions',
    component: ComponentCreator('/solutions', 'e33'),
    routes: [
      {
        path: '/solutions',
        component: ComponentCreator('/solutions', '736'),
        routes: [
          {
            path: '/solutions',
            component: ComponentCreator('/solutions', '300'),
            routes: [
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
