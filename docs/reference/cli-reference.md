---
title: CLI Reference
sidebar_position: 3
---

import UpAlphaCtx from '/cli/up_alpha_ctx.md';
import UpAlphaMigrationExport from '/cli/up_alpha_migration_export.md';
import UpAlphaMigrationImport from '/cli/up_alpha_migration_import.md';
import UpAlphaMigrationPauseToggle from '/cli/up_alpha_migration_pause-toggle.md';
import UpAlphaMigration from '/cli/up_alpha_migration.md';
import UpAlphaSpaceBillingExport from '/cli/up_alpha_space_billing_export.md';
import UpAlphaSpaceBilling from '/cli/up_alpha_space_billing.md';
import UpAlphaSpaceConnectAttach from '/cli/up_alpha_space_connect_(attach).md';
import UpAlphaSpaceDestroy from '/cli/up_alpha_space_destroy.md';
import UpAlphaSpaceDisconnectDetach from '/cli/up_alpha_space_disconnect_(detach).md';
import UpAlphaSpaceInit from '/cli/up_alpha_space_init.md';
import UpAlphaSpaceList from '/cli/up_alpha_space_list.md';
import UpAlphaSpaceMirror from '/cli/up_alpha_space_mirror.md';
import UpAlphaSpaceUpgrade from '/cli/up_alpha_space_upgrade.md';
import UpAlphaSpace from '/cli/up_alpha_space.md';
import UpAlpha from '/cli/up_alpha.md';
import UpCompletion from '/cli/up_completion.md';
import UpCompositionGenerate from '/cli/up_composition_generate.md';
import UpCompositionRender from '/cli/up_composition_render.md';
import UpComposition from '/cli/up_composition.md';
import UpControlplaneCtpConfigurationInstall from '/cli/up_controlplane_(ctp)_configuration_install.md';
import UpControlplaneCtpConfiguration from '/cli/up_controlplane_(ctp)_configuration.md';
import UpControlplaneCtpConnect from '/cli/up_controlplane_(ctp)_connect.md';
import UpControlplaneCtpConnectorInstall from '/cli/up_controlplane_(ctp)_connector_install.md';
import UpControlplaneCtpConnectorUninstall from '/cli/up_controlplane_(ctp)_connector_uninstall.md';
import UpControlplaneCtpConnector from '/cli/up_controlplane_(ctp)_connector.md';
import UpControlplaneCtpCreate from '/cli/up_controlplane_(ctp)_create.md';
import UpControlplaneCtpDelete from '/cli/up_controlplane_(ctp)_delete.md';
import UpControlplaneCtpDisconnect from '/cli/up_controlplane_(ctp)_disconnect.md';
import UpControlplaneCtpFunctionInstall from '/cli/up_controlplane_(ctp)_function_install.md';
import UpControlplaneCtpFunction from '/cli/up_controlplane_(ctp)_function.md';
import UpControlplaneCtpGet from '/cli/up_controlplane_(ctp)_get.md';
import UpControlplaneCtpList from '/cli/up_controlplane_(ctp)_list.md';
import UpControlplaneCtpProviderInstall from '/cli/up_controlplane_(ctp)_provider_install.md';
import UpControlplaneCtpProvider from '/cli/up_controlplane_(ctp)_provider.md';
import UpControlplaneCtpPullSecretCreate from '/cli/up_controlplane_(ctp)_pull-secret_create.md';
import UpControlplaneCtpPullSecret from '/cli/up_controlplane_(ctp)_pull-secret.md';
import UpControlplaneCtpSimulate from '/cli/up_controlplane_(ctp)_simulate.md';
import UpControlplaneCtpSimulationSimCreate from '/cli/up_controlplane_(ctp)_simulation_(sim)_create.md';
import UpControlplaneCtpSimulationSimDelete from '/cli/up_controlplane_(ctp)_simulation_(sim)_delete.md';
import UpControlplaneCtpSimulationSimList from '/cli/up_controlplane_(ctp)_simulation_(sim)_list.md';
import UpControlplaneCtpSimulationSim from '/cli/up_controlplane_(ctp)_simulation_(sim).md';
import UpControlplaneCtp from '/cli/up_controlplane_(ctp).md';
import UpCtx from '/cli/up_ctx.md';
import UpDependencyDepAdd from '/cli/up_dependency_(dep)_add.md';
import UpDependencyDepCleanCache from '/cli/up_dependency_(dep)_clean-cache.md';
import UpDependencyDepUpdateCache from '/cli/up_dependency_(dep)_update-cache.md';
import UpDependencyDep from '/cli/up_dependency_(dep).md';
import UpExampleGenerate from '/cli/up_example_generate.md';
import UpExample from '/cli/up_example.md';
import UpFunctionGenerate from '/cli/up_function_generate.md';
import UpFunction from '/cli/up_function.md';
import UpGroupCreate from '/cli/up_group_create.md';
import UpGroupDelete from '/cli/up_group_delete.md';
import UpGroupGet from '/cli/up_group_get.md';
import UpGroupList from '/cli/up_group_list.md';
import UpGroup from '/cli/up_group.md';
import UpHelp from '/cli/up_help.md';
import UpLicense from '/cli/up_license.md';
import UpLogin from '/cli/up_login.md';
import UpLogout from '/cli/up_logout.md';
import UpOrganizationOrgCreate from '/cli/up_organization_(org)_create.md';
import UpOrganizationOrgDelete from '/cli/up_organization_(org)_delete.md';
import UpOrganizationOrgGet from '/cli/up_organization_(org)_get.md';
import UpOrganizationOrgList from '/cli/up_organization_(org)_list.md';
import UpOrganizationOrgToken from '/cli/up_organization_(org)_token.md';
import UpOrganizationOrgUserInvite from '/cli/up_organization_(org)_user_invite.md';
import UpOrganizationOrgUserList from '/cli/up_organization_(org)_user_list.md';
import UpOrganizationOrgUserRemove from '/cli/up_organization_(org)_user_remove.md';
import UpOrganizationOrgUser from '/cli/up_organization_(org)_user.md';
import UpOrganizationOrg from '/cli/up_organization_(org).md';
import UpProfileCreate from '/cli/up_profile_create.md';
import UpProfileCurrent from '/cli/up_profile_current.md';
import UpProfileDelete from '/cli/up_profile_delete.md';
import UpProfileList from '/cli/up_profile_list.md';
import UpProfileRename from '/cli/up_profile_rename.md';
import UpProfileSet from '/cli/up_profile_set.md';
import UpProfileUse from '/cli/up_profile_use.md';
import UpProfileView from '/cli/up_profile_view.md';
import UpProfile from '/cli/up_profile.md';
import UpProjectBuild from '/cli/up_project_build.md';
import UpProjectInit from '/cli/up_project_init.md';
import UpProjectMove from '/cli/up_project_move.md';
import UpProjectPush from '/cli/up_project_push.md';
import UpProjectRun from '/cli/up_project_run.md';
import UpProjectSimulate from '/cli/up_project_simulate.md';
import UpProjectSimulationComplete from '/cli/up_project_simulation_complete.md';
import UpProjectSimulationCreate from '/cli/up_project_simulation_create.md';
import UpProjectSimulationDelete from '/cli/up_project_simulation_delete.md';
import UpProjectSimulation from '/cli/up_project_simulation.md';
import UpProject from '/cli/up_project.md';
import UpRepositoryRepoCreate from '/cli/up_repository_(repo)_create.md';
import UpRepositoryRepoDelete from '/cli/up_repository_(repo)_delete.md';
import UpRepositoryRepoGet from '/cli/up_repository_(repo)_get.md';
import UpRepositoryRepoList from '/cli/up_repository_(repo)_list.md';
import UpRepositoryRepoPermissionGrant from '/cli/up_repository_(repo)_permission_grant.md';
import UpRepositoryRepoPermissionList from '/cli/up_repository_(repo)_permission_list.md';
import UpRepositoryRepoPermissionRevoke from '/cli/up_repository_(repo)_permission_revoke.md';
import UpRepositoryRepoPermission from '/cli/up_repository_(repo)_permission.md';
import UpRepositoryRepoUpdate from '/cli/up_repository_(repo)_update.md';
import UpRepositoryRepo from '/cli/up_repository_(repo).md';
import UpRobotCreate from '/cli/up_robot_create.md';
import UpRobotDelete from '/cli/up_robot_delete.md';
import UpRobotGet from '/cli/up_robot_get.md';
import UpRobotList from '/cli/up_robot_list.md';
import UpRobotTeamJoin from '/cli/up_robot_team_join.md';
import UpRobotTeamLeave from '/cli/up_robot_team_leave.md';
import UpRobotTeamList from '/cli/up_robot_team_list.md';
import UpRobotTeam from '/cli/up_robot_team.md';
import UpRobotTokenCreate from '/cli/up_robot_token_create.md';
import UpRobotTokenDelete from '/cli/up_robot_token_delete.md';
import UpRobotTokenGet from '/cli/up_robot_token_get.md';
import UpRobotTokenList from '/cli/up_robot_token_list.md';
import UpRobotToken from '/cli/up_robot_token.md';
import UpRobot from '/cli/up_robot.md';
import UpSpaceBillingExport from '/cli/up_space_billing_export.md';
import UpSpaceBilling from '/cli/up_space_billing.md';
import UpSpaceConnectAttach from '/cli/up_space_connect_(attach).md';
import UpSpaceDestroy from '/cli/up_space_destroy.md';
import UpSpaceDisconnectDetach from '/cli/up_space_disconnect_(detach).md';
import UpSpaceInit from '/cli/up_space_init.md';
import UpSpaceList from '/cli/up_space_list.md';
import UpSpaceMirror from '/cli/up_space_mirror.md';
import UpSpaceUpgrade from '/cli/up_space_upgrade.md';
import UpSpace from '/cli/up_space.md';
import UpTeamCreate from '/cli/up_team_create.md';
import UpTeamDelete from '/cli/up_team_delete.md';
import UpTeamGet from '/cli/up_team_get.md';
import UpTeamList from '/cli/up_team_list.md';
import UpTeam from '/cli/up_team.md';
import UpTestGenerate from '/cli/up_test_generate.md';
import UpTestRun from '/cli/up_test_run.md';
import UpTest from '/cli/up_test.md';
import UpUxpInstall from '/cli/up_uxp_install.md';
import UpUxpUninstall from '/cli/up_uxp_uninstall.md';
import UpUxpUpgrade from '/cli/up_uxp_upgrade.md';
import UpUxp from '/cli/up_uxp.md';
import UpVersion from '/cli/up_version.md';
import UpXpkgAppend from '/cli/up_xpkg_append.md';
import UpXpkgBatch from '/cli/up_xpkg_batch.md';
import UpXpkgBuild from '/cli/up_xpkg_build.md';
import UpXpkgPush from '/cli/up_xpkg_push.md';
import UpXpkgXpExtract from '/cli/up_xpkg_xp-extract.md';
import UpXpkg from '/cli/up_xpkg.md';
import UpXplsServe from '/cli/up_xpls_serve.md';
import UpXpls from '/cli/up_xpls.md';
import UpXrdGenerate from '/cli/up_xrd_generate.md';
import UpXrd from '/cli/up_xrd.md';
import Up from '/cli/up.md';

## up
<Up />


## up alpha
<UpAlpha />

### up alpha ctx
<UpAlphaCtx />

### up alpha migration
<UpAlphaMigration />

#### up alpha migration export
<UpAlphaMigrationExport />

#### up alpha migration import
<UpAlphaMigrationImport />

#### up alpha migration pause-toggle
<UpAlphaMigrationPauseToggle />

### up alpha space
<UpAlphaSpace />

#### up alpha space billing
<UpAlphaSpaceBilling />

##### up alpha space billing export
<UpAlphaSpaceBillingExport />

#### up alpha space connect (attach)
<UpAlphaSpaceConnectAttach />

#### up alpha space destroy
<UpAlphaSpaceDestroy />

#### up alpha space disconnect (detach)
<UpAlphaSpaceDisconnectDetach />

#### up alpha space init
<UpAlphaSpaceInit />

#### up alpha space list
<UpAlphaSpaceList />

#### up alpha space mirror
<UpAlphaSpaceMirror />

#### up alpha space upgrade
<UpAlphaSpaceUpgrade />

## up completion
<UpCompletion />

## up composition
<UpComposition />

### up composition generate
<UpCompositionGenerate />

### up composition render
<UpCompositionRender />

## up controlplane (ctp)
<UpControlplaneCtp />

### up controlplane (ctp) configuration
<UpControlplaneCtpConfiguration />

#### up controlplane (ctp) configuration install
<UpControlplaneCtpConfigurationInstall />

### up controlplane (ctp) connect
<UpControlplaneCtpConnect />

### up controlplane (ctp) connector
<UpControlplaneCtpConnector />

#### up controlplane (ctp) connector install
<UpControlplaneCtpConnectorInstall />

#### up controlplane (ctp) connector uninstall
<UpControlplaneCtpConnectorUninstall />

### up controlplane (ctp) create
<UpControlplaneCtpCreate />

### up controlplane (ctp) delete
<UpControlplaneCtpDelete />

### up controlplane (ctp) disconnect
<UpControlplaneCtpDisconnect />

### up controlplane (ctp) function
<UpControlplaneCtpFunction />

#### up controlplane (ctp) function install
<UpControlplaneCtpFunctionInstall />

### up controlplane (ctp) get
<UpControlplaneCtpGet />

### up controlplane (ctp) list
<UpControlplaneCtpList />

### up controlplane (ctp) provider
<UpControlplaneCtpProvider />

#### up controlplane (ctp) provider install
<UpControlplaneCtpProviderInstall />

### up controlplane (ctp) pull-secret
<UpControlplaneCtpPullSecret />

#### up controlplane (ctp) pull-secret create
<UpControlplaneCtpPullSecretCreate />

### up controlplane (ctp) simulate
<UpControlplaneCtpSimulate />

### up controlplane (ctp) simulation (sim)
<UpControlplaneCtpSimulationSim />

#### up controlplane (ctp) simulation (sim) create
<UpControlplaneCtpSimulationSimCreate />

#### up controlplane (ctp) simulation (sim) delete
<UpControlplaneCtpSimulationSimDelete />

#### up controlplane (ctp) simulation (sim) list
<UpControlplaneCtpSimulationSimList />

## up ctx
<UpCtx />

## up dependency (dep)
<UpDependencyDep />

### up dependency (dep) add
<UpDependencyDepAdd />

### up dependency (dep) clean-cache
<UpDependencyDepCleanCache />

### up dependency (dep) update-cache
<UpDependencyDepUpdateCache />

## up example
<UpExample />

### up example generate
<UpExampleGenerate />

## up function
<UpFunction />

### up function generate
<UpFunctionGenerate />

## up group
<UpGroup />

### up group create
<UpGroupCreate />

### up group delete
<UpGroupDelete />

### up group get
<UpGroupGet />

### up group list
<UpGroupList />

## up help
<UpHelp />

## up license
<UpLicense />

## up login
<UpLogin />

## up logout
<UpLogout />

## up organization (org)
<UpOrganizationOrg />

### up organization (org) create
<UpOrganizationOrgCreate />

### up organization (org) delete
<UpOrganizationOrgDelete />

### up organization (org) get
<UpOrganizationOrgGet />

### up organization (org) list
<UpOrganizationOrgList />

### up organization (org) token
<UpOrganizationOrgToken />

### up organization (org) user
<UpOrganizationOrgUser />

#### up organization (org) user invite
<UpOrganizationOrgUserInvite />

#### up organization (org) user list
<UpOrganizationOrgUserList />

#### up organization (org) user remove
<UpOrganizationOrgUserRemove />

## up profile
<UpProfile />

### up profile create
<UpProfileCreate />

### up profile current
<UpProfileCurrent />

### up profile delete
<UpProfileDelete />

### up profile list
<UpProfileList />

### up profile rename
<UpProfileRename />

### up profile set
<UpProfileSet />

### up profile use
<UpProfileUse />

### up profile view
<UpProfileView />

## up project
<UpProject />

### up project build
<UpProjectBuild />

### up project init
<UpProjectInit />

### up project move
<UpProjectMove />

### up project push
<UpProjectPush />

### up project run
<UpProjectRun />

### up project simulate
<UpProjectSimulate />

### up project simulation
<UpProjectSimulation />

#### up project simulation complete
<UpProjectSimulationComplete />

#### up project simulation create
<UpProjectSimulationCreate />

#### up project simulation delete
<UpProjectSimulationDelete />

## up repository (repo)
<UpRepositoryRepo />

### up repository (repo) create
<UpRepositoryRepoCreate />

### up repository (repo) delete
<UpRepositoryRepoDelete />

### up repository (repo) get
<UpRepositoryRepoGet />

### up repository (repo) list
<UpRepositoryRepoList />

### up repository (repo) permission
<UpRepositoryRepoPermission />

#### up repository (repo) permission grant
<UpRepositoryRepoPermissionGrant />

#### up repository (repo) permission list
<UpRepositoryRepoPermissionList />

#### up repository (repo) permission revoke
<UpRepositoryRepoPermissionRevoke />

### up repository (repo) update
<UpRepositoryRepoUpdate />

## up robot
<UpRobot />

### up robot create
<UpRobotCreate />

### up robot delete
<UpRobotDelete />

### up robot get
<UpRobotGet />

### up robot list
<UpRobotList />

### up robot team
<UpRobotTeam />

#### up robot team join
<UpRobotTeamJoin />

#### up robot team leave
<UpRobotTeamLeave />

#### up robot team list
<UpRobotTeamList />

### up robot token
<UpRobotToken />

#### up robot token create
<UpRobotTokenCreate />

#### up robot token delete
<UpRobotTokenDelete />

#### up robot token get
<UpRobotTokenGet />

#### up robot token list
<UpRobotTokenList />

## up space
<UpSpace />

### up space billing
<UpSpaceBilling />

#### up space billing export
<UpSpaceBillingExport />

### up space connect (attach)
<UpSpaceConnectAttach />

### up space destroy
<UpSpaceDestroy />

### up space disconnect (detach)
<UpSpaceDisconnectDetach />

### up space init
<UpSpaceInit />

### up space list
<UpSpaceList />

### up space mirror
<UpSpaceMirror />

### up space upgrade
<UpSpaceUpgrade />

## up team
<UpTeam />

### up team create
<UpTeamCreate />

### up team delete
<UpTeamDelete />

### up team get
<UpTeamGet />

### up team list
<UpTeamList />

## up test
<UpTest />

### up test generate
<UpTestGenerate />

### up test run
<UpTestRun />

## up uxp
<UpUxp />

### up uxp install
<UpUxpInstall />

### up uxp uninstall
<UpUxpUninstall />

### up uxp upgrade
<UpUxpUpgrade />

## up version
<UpVersion />

## up xpkg
<UpXpkg />

### up xpkg append
<UpXpkgAppend />

### up xpkg batch
<UpXpkgBatch />

### up xpkg build
<UpXpkgBuild />

### up xpkg push
<UpXpkgPush />

### up xpkg xp-extract
<UpXpkgXpExtract />

## up xpls
<UpXpls />

### up xpls serve
<UpXplsServe />

## up xrd
<UpXrd />

### up xrd generate
<UpXrdGenerate />


