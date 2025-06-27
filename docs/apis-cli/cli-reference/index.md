---
title: CLI Reference
---
import UpAlphaCtx from './yaml/up-alpha-ctx.md';
import UpAlphaMigrationExport from './yaml/up-alpha-migration-export.md';
import UpAlphaMigrationImport from './yaml/up-alpha-migration-import.md';
import UpAlphaMigrationPauseToggle from './yaml/up-alpha-migration-pause-toggle.md';
import UpAlphaMigration from './yaml/up-alpha-migration.md';
import UpAlphaSpaceBillingExport from './yaml/up-alpha-space-billing-export.md';
import UpAlphaSpaceBilling from './yaml/up-alpha-space-billing.md';
import UpAlphaSpaceConnectAttach from './yaml/up-alpha-space-connect.md';
import UpAlphaSpaceDestroy from './yaml/up-alpha-space-destroy.md';
import UpAlphaSpaceDisconnectDetach from './yaml/up-alpha-space-disconnect.md';
import UpAlphaSpaceInit from './yaml/up-alpha-space-init.md';
import UpAlphaSpaceList from './yaml/up-alpha-space-list.md';
import UpAlphaSpaceMirror from './yaml/up-alpha-space-mirror.md';
import UpAlphaSpaceUpgrade from './yaml/up-alpha-space-upgrade.md';
import UpAlphaSpace from './yaml/up-alpha-space.md';
import UpAlpha from './yaml/up-alpha.md';
import UpCompletion from './yaml/up-completion.md';
import UpCompositionGenerate from './yaml/up-composition-generate.md';
import UpCompositionRender from './yaml/up-composition-render.md';
import UpComposition from './yaml/up-composition.md';
import UpControlplaneCtpConfigurationInstall from './yaml/up-controlplane-configuration-install.md';
import UpControlplaneCtpConfiguration from './yaml/up-controlplane-configuration.md';
import UpControlplaneCtpConnect from './yaml/up-controlplane-connect.md';
import UpControlplaneCtpConnectorInstall from './yaml/up-controlplane-connector-install.md';
import UpControlplaneCtpConnectorUninstall from './yaml/up-controlplane-connector-uninstall.md';
import UpControlplaneCtpConnector from './yaml/up-controlplane-connector.md';
import UpControlplaneCtpCreate from './yaml/up-controlplane-create.md';
import UpControlplaneCtpDelete from './yaml/up-controlplane-delete.md';
import UpControlplaneCtpDisconnect from './yaml/up-controlplane-disconnect.md';
import UpControlplaneCtpFunctionInstall from './yaml/up-controlplane-function-install.md';
import UpControlplaneCtpFunction from './yaml/up-controlplane-function.md';
import UpControlplaneCtpGet from './yaml/up-controlplane-get.md';
import UpControlplaneCtpList from './yaml/up-controlplane-list.md';
import UpControlplaneCtpProviderInstall from './yaml/up-controlplane-provider-install.md';
import UpControlplaneCtpProvider from './yaml/up-controlplane-provider.md';
import UpControlplaneCtpPullSecretCreate from './yaml/up-controlplane-pull-secret-create.md';
import UpControlplaneCtpPullSecret from './yaml/up-controlplane-pull-secret.md';
import UpControlplaneCtpSimulate from './yaml/up-controlplane-simulate.md';
import UpControlplaneCtpSimulationSimCreate from './yaml/up-controlplane-simulation-create.md';
import UpControlplaneCtpSimulationSimDelete from './yaml/up-controlplane-simulation-delete.md';
import UpControlplaneCtpSimulationSimList from './yaml/up-controlplane-simulation-list.md';
import UpControlplaneCtpSimulationSim from './yaml/up-controlplane-simulation.md';
import UpControlplaneCtp from './yaml/up-controlplane.md';
import UpCtx from './yaml/up-ctx.md';
import UpDependencyDepAdd from './yaml/up-dependency-add.md';
import UpDependencyDepCleanCache from './yaml/up-dependency-clean-cache.md';
import UpDependencyDepUpdateCache from './yaml/up-dependency-update-cache.md';
import UpDependencyDep from './yaml/up-dependency.md';
import UpExampleGenerate from './yaml/up-example-generate.md';
import UpExample from './yaml/up-example.md';
import UpFunctionGenerate from './yaml/up-function-generate.md';
import UpFunction from './yaml/up-function.md';
import UpGroupCreate from './yaml/up-group-create.md';
import UpGroupDelete from './yaml/up-group-delete.md';
import UpGroupGet from './yaml/up-group-get.md';
import UpGroupList from './yaml/up-group-list.md';
import UpGroup from './yaml/up-group.md';
import UpHelp from './yaml/up-help.md';
import UpLicense from './yaml/up-license.md';
import UpLogin from './yaml/up-login.md';
import UpLogout from './yaml/up-logout.md';
import UpOrganizationOrgCreate from './yaml/up-organization-create.md';
import UpOrganizationOrgDelete from './yaml/up-organization-delete.md';
import UpOrganizationOrgGet from './yaml/up-organization-get.md';
import UpOrganizationOrgList from './yaml/up-organization-list.md';
import UpOrganizationOrgToken from './yaml/up-organization-token.md';
import UpOrganizationOrgUserInvite from './yaml/up-organization-user-invite.md';
import UpOrganizationOrgUserList from './yaml/up-organization-user-list.md';
import UpOrganizationOrgUserRemove from './yaml/up-organization-user-remove.md';
import UpOrganizationOrgUser from './yaml/up-organization-user.md';
import UpOrganizationOrg from './yaml/up-organization.md';
import UpProfileCreate from './yaml/up-profile-create.md';
import UpProfileCurrent from './yaml/up-profile-current.md';
import UpProfileDelete from './yaml/up-profile-delete.md';
import UpProfileList from './yaml/up-profile-list.md';
import UpProfileRename from './yaml/up-profile-rename.md';
import UpProfileSet from './yaml/up-profile-set.md';
import UpProfileUse from './yaml/up-profile-use.md';
import UpProfileView from './yaml/up-profile-view.md';
import UpProfile from './yaml/up-profile.md';
import UpProjectBuild from './yaml/up-project-build.md';
import UpProjectInit from './yaml/up-project-init.md';
import UpProjectMove from './yaml/up-project-move.md';
import UpProjectPush from './yaml/up-project-push.md';
import UpProjectRun from './yaml/up-project-run.md';
import UpProjectSimulate from './yaml/up-project-simulate.md';
import UpProjectSimulationComplete from './yaml/up-project-simulation-complete.md';
import UpProjectSimulationCreate from './yaml/up-project-simulation-create.md';
import UpProjectSimulationDelete from './yaml/up-project-simulation-delete.md';
import UpProjectSimulation from './yaml/up-project-simulation.md';
import UpProject from './yaml/up-project.md';
import UpRepositoryRepoCreate from './yaml/up-repository-create.md';
import UpRepositoryRepoDelete from './yaml/up-repository-delete.md';
import UpRepositoryRepoGet from './yaml/up-repository-get.md';
import UpRepositoryRepoList from './yaml/up-repository-list.md';
import UpRepositoryRepoPermissionGrant from './yaml/up-repository-permission-grant.md';
import UpRepositoryRepoPermissionList from './yaml/up-repository-permission-list.md';
import UpRepositoryRepoPermissionRevoke from './yaml/up-repository-permission-revoke.md';
import UpRepositoryRepoPermission from './yaml/up-repository-permission.md';
import UpRepositoryRepoUpdate from './yaml/up-repository-update.md';
import UpRepositoryRepo from './yaml/up-repository.md';
import UpRobotCreate from './yaml/up-robot-create.md';
import UpRobotDelete from './yaml/up-robot-delete.md';
import UpRobotGet from './yaml/up-robot-get.md';
import UpRobotList from './yaml/up-robot-list.md';
import UpRobotTeamJoin from './yaml/up-robot-team-join.md';
import UpRobotTeamLeave from './yaml/up-robot-team-leave.md';
import UpRobotTeamList from './yaml/up-robot-team-list.md';
import UpRobotTeam from './yaml/up-robot-team.md';
import UpRobotTokenCreate from './yaml/up-robot-token-create.md';
import UpRobotTokenDelete from './yaml/up-robot-token-delete.md';
import UpRobotTokenGet from './yaml/up-robot-token-get.md';
import UpRobotTokenList from './yaml/up-robot-token-list.md';
import UpRobotToken from './yaml/up-robot-token.md';
import UpRobot from './yaml/up-robot.md';
import UpSpaceBillingExport from './yaml/up-space-billing-export.md';
import UpSpaceBilling from './yaml/up-space-billing.md';
import UpSpaceConnectAttach from './yaml/up-space-connect.md';
import UpSpaceDestroy from './yaml/up-space-destroy.md';
import UpSpaceDisconnectDetach from './yaml/up-space-disconnect.md';
import UpSpaceInit from './yaml/up-space-init.md';
import UpSpaceList from './yaml/up-space-list.md';
import UpSpaceMirror from './yaml/up-space-mirror.md';
import UpSpaceUpgrade from './yaml/up-space-upgrade.md';
import UpSpace from './yaml/up-space.md';
import UpTeamCreate from './yaml/up-team-create.md';
import UpTeamDelete from './yaml/up-team-delete.md';
import UpTeamGet from './yaml/up-team-get.md';
import UpTeamList from './yaml/up-team-list.md';
import UpTeam from './yaml/up-team.md';
import UpTestGenerate from './yaml/up-test-generate.md';
import UpTestRun from './yaml/up-test-run.md';
import UpTest from './yaml/up-test.md';
import UpUxpInstall from './yaml/up-uxp-install.md';
import UpUxpUninstall from './yaml/up-uxp-uninstall.md';
import UpUxpUpgrade from './yaml/up-uxp-upgrade.md';
import UpUxp from './yaml/up-uxp.md';
import UpVersion from './yaml/up-version.md';
import UpXpkgAppend from './yaml/up-xpkg-append.md';
import UpXpkgBatch from './yaml/up-xpkg-batch.md';
import UpXpkgBuild from './yaml/up-xpkg-build.md';
import UpXpkgPush from './yaml/up-xpkg-push.md';
import UpXpkgXpExtract from './yaml/up-xpkg-xp-extract.md';
import UpXpkg from './yaml/up-xpkg.md';
import UpXplsServe from './yaml/up-xpls-serve.md';
import UpXpls from './yaml/up-xpls.md';
import UpXrdGenerate from './yaml/up-xrd-generate.md';
import UpXrd from './yaml/up-xrd.md';
import Up from './yaml/up.md';

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


