import React, { type ReactNode } from "react"
import clsx from "clsx"
import {
  useThemeConfig,
  ErrorCauseBoundary,
  ThemeClassNames,
} from "@docusaurus/theme-common"
import { useHideableNavbar } from "@docusaurus/theme-common/internal"
import type { Props as NavbarItemConfig } from "@theme/NavbarItem"
import NavbarItem from "@theme/NavbarItem"
import SearchBar from "@theme/SearchBar"
import NavbarColorModeToggle from "../ColorModeToggle"
import NavbarLogo from "../Logo"
import NavbarSearch from "../Search"

import {
  AccordionMenu,
  DrawerLink,
  faBars,
  faGithub,
  faSlack,
  MainDrawer,
  MainDrawerLinkSection,
  MainNavigation,
  MainNavigationButton,
  MainNavigationButtonLink,
  MainNavigationUser,
  NavigationMenuItem,
  NavigationMenuList,
  SubNavigation,
} from "@upbound/elements"
import {
  footerLinks,
  GlobalNav,
  OpenDrawerButton,
} from "@upbound/ux"
import { translate } from "@docusaurus/Translate"

import "./styles.module.css"
import SubNavbarItem from "../../SubNavbarItem"
import {
  useCurrentUser,
  useCurrentOrg,
  useOrganizations,
  useFeatureFlags,
} from "@site/src/hooks"
import { resolveDocUrl } from "@site/src/theme/utils/resolveDocUrl"
import { useConfig } from "@site/src/contexts/config"

function useNavbarItems() {
  // TODO temporary casting until ThemeConfig type is improved
  return useThemeConfig().navbar.items as NavbarItemConfig[]
}

const LoggedOutNavbarContent = (): ReactNode => {
  const {
    navbar: { hideOnScroll },
  } = useThemeConfig()
  const { baseDomain } = useConfig()
  const { navbarRef } = useHideableNavbar(hideOnScroll)

  const items = useNavbarItems()
  const regularItems = items.filter((item) => item.type !== "search")

  const searchBarItem = items.find((item) => item.type === "search")

  // Convert navbar items to drawer items
  const renderDrawerItems = (items: NavbarItemConfig[]) => {
    return items
      .map((item: NavbarItemConfig, index) => {
        const key = `drawer-${item.label || item.to || index}`

        // Handle dropdown items
        if (item.type === "dropdown" && item.items) {
          return (
            <AccordionMenu
              key={key}
              text={String(item.label || "")}
              items={[
                <NavigationMenuList
                  key={`${key}-list`}
                  className="flex w-full flex-col items-start justify-start space-x-0"
                >
                  {item.items.map(
                    (subItem: NavbarItemConfig, subIndex: number) => (
                      <NavigationMenuItem
                        className="w-full"
                        key={`${key}-item-${subIndex}`}
                      >
                        <DrawerLink
                          text={String(subItem.label || "")}
                          href={subItem.to || subItem.href || "#"}
                        />
                      </NavigationMenuItem>
                    )
                  )}
                </NavigationMenuList>,
              ]}
            />
          )
        }

        // Handle doc type items
        if (item.type === "doc" && item.docId) {
          return (
            <DrawerLink
              key={key}
              text={String(item.label || "")}
              href={resolveDocUrl(item.docId)}
            />
          )
        }

        // Handle regular links
        if (item.to || item.href) {
          return (
            <DrawerLink
              key={key}
              text={String(item.label || "")}
              href={item.to || item.href || "#"}
            />
          )
        }

        return null
      })
      .filter((item): item is React.ReactElement => item !== null)
  }

  const ACCOUNTS_URL = `https://accounts.${baseDomain}`

  const drawerItems = [
    ...renderDrawerItems(regularItems),
    <NavigationMenuItem key="sign-in">
      <MainNavigationButtonLink
        variant="secondary"
        href={`${ACCOUNTS_URL}/login`}
        className="w-full"
      >
        Sign In
      </MainNavigationButtonLink>
    </NavigationMenuItem>,
    <NavigationMenuItem key="drawer-sign-up-free-link">
      <MainNavigationButtonLink
        variant="primary"
        href={`${ACCOUNTS_URL}/register`}
        className="w-full"
      >
        Sign Up Free
      </MainNavigationButtonLink>
    </NavigationMenuItem>,
  ]

  return (
    <MainDrawer
      className="top-0"
      homeLink={"/"}
      navigationSections={[
        <MainDrawerLinkSection key="drawer-navigation" items={drawerItems} />,
      ]}
      footerLinks={footerLinks}
    >
      <MainNavigation
        ref={navbarRef}
        aria-label={translate({
          id: "theme.NavBar.navAriaLabel",
          message: "Main",
          description: "The ARIA label for the main navigation",
        })}
        className={clsx(
          "navbar",
          "sticky top-0 z-100",
          ThemeClassNames.layout.navbar.container
        )}
        left={[
          <NavbarLogo key="navbar-logo" />,
          <>
            {!!searchBarItem && (
              <NavbarSearch>
                <SearchBar />
              </NavbarSearch>
            )}
          </>,
        ]}
        right={[
          ...regularItems.map((item, i) => (
            <ErrorCauseBoundary
              key={i}
              onError={(error) => {
                const err = new Error(
                  `A theme navbar item failed to render.
    Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
    ${JSON.stringify(item, null, 2)}`
                )
                // @ts-ignore - Error cause is supported in modern environments
                err.cause = error
                return err
              }}
            >
              <NavbarItem {...item} className="hidden md:block" />
            </ErrorCauseBoundary>
          )),
          <div
            key="main-navigation-button-links"
            className="flex items-center gap-x-2"
          >
            <MainNavigationButtonLink
              className="hidden md:block"
              key="main-navigation-button-link-sign-in"
              href={`${ACCOUNTS_URL}/login`}
              variant="secondary"
            >
              Sign In
            </MainNavigationButtonLink>
            <MainNavigationButtonLink
              className="hidden md:block"
              key="main-navigation-button-link-sign-up-free"
              href={`${ACCOUNTS_URL}/register`}
              variant="primary"
            >
              Sign Up Free
            </MainNavigationButtonLink>
            <NavbarColorModeToggle />
          </div>,
          <OpenDrawerButton
            icon={faBars}
            key="open-drawer-button"
            className="block md:hidden"
          />,
        ]}
      ></MainNavigation>
    </MainDrawer>
  )
}

const LoggedInNavbarContent = (): ReactNode => {
  const {
    navbar: { hideOnScroll },
  } = useThemeConfig()
  const { navbarRef } = useHideableNavbar(hideOnScroll)
  const items = useNavbarItems()
  const regularItems = items.filter((item) => item.type !== "search")
  const searchBarItem = items.find((item) => item.type === "search")

  // Get session data
  const { currentUser } = useCurrentUser()
  const { currentOrg, setCurrentOrg } = useCurrentOrg()
  const { organizations } = useOrganizations()
  const featureFlags = useFeatureFlags()

  const currentOrgId = currentOrg?.id || ""
  const orgName = currentOrg?.name || ""

  // Get base domain from Docusaurus config
  const { baseDomain } = useConfig()

  const ACCOUNTS_URL = `https://accounts.${baseDomain}`
  const CONSOLE_URL = `https://console.${baseDomain}`
  const MARKETPLACE_URL = `https://marketplace.${baseDomain}`
  const PORTAL_URL = `https://portal.${baseDomain}`

  // Format organizations for the MainNavigationUser component
  const formattedOrgs = organizations.map((org) => ({
    id: org.id,
    name: org.name, // Using org.name to match Console app behavior
  }))

  const userButton = (
    <MainNavigationUser
      key="main-navigation-user-button"
      name={
        currentUser?.name ||
        `${currentUser?.firstName || ""} ${
          currentUser?.lastName || ""
        }`.trim() ||
        currentUser?.email ||
        "User"
      }
      organizations={formattedOrgs}
      currentOrganizationId={currentOrgId}
      onOrganizationClick={(organization) => {
        // Find the actual org object and set it as current
        const selectedOrg = organizations.find(
          (org) => org.id === organization.id
        )
        if (selectedOrg) {
          setCurrentOrg(selectedOrg)
        }
      }}
      onDefaultMenuItemClick={(menuItem) => {
        switch (menuItem) {
          case "createOrganization":
            window.location.href = `${ACCOUNTS_URL}/createOrg`
            break
          case "myAccount":
            window.location.href = `${ACCOUNTS_URL}/settings`
            break
          case "signOut":
            window.location.href = `${ACCOUNTS_URL}/logout`
            break
          default:
            break
        }
      }}
    />
  )

  return (
    <div
      ref={navbarRef}
      className={clsx(
        "navbar",
        "navbar--logged-in",
        "sticky top-0 z-100",
        ThemeClassNames.layout.navbar.container
      )}
      aria-label={translate({
        id: "theme.NavBar.navAriaLabel",
        message: "Main",
        description: "The ARIA label for the main navigation",
      })}
    >
      <GlobalNav
        context={{
          featureFlags: {
            frontendBillingAndMeteringEnabled:
              featureFlags.frontendBillingAndMeteringEnabled,
            frontendLicenseManagementEnabled:
              featureFlags.frontendLicenseManagementEnabled,
          },
          accounts: {
            appUrl: ACCOUNTS_URL,
          },
          currentOrganization: {
            id: currentOrgId,
            name: orgName,
            isAdmin: currentOrg?.role === "owner",
            tier: currentOrg?.tier || "free",
          },
          url: {
            home: { value: "/" },
            spaces: { value: `${CONSOLE_URL}/${orgName}/spaces` },
            marketplace: { value: `${MARKETPLACE_URL}/providers` },
            repositories: { value: `${CONSOLE_URL}/${orgName}/repositories` },
            consumerPortal: { value: `${PORTAL_URL}/${orgName}` },
            general: { value: `${ACCOUNTS_URL}/${orgName}/settings` },
            billing: { value: `${ACCOUNTS_URL}/${orgName}/billing` },
            licenses: { value: `${ACCOUNTS_URL}/${orgName}/licenses` },
            users: { value: `${ACCOUNTS_URL}/${orgName}/members` },
            teams: { value: `${ACCOUNTS_URL}/${orgName}/teams` },
            robots: { value: `${ACCOUNTS_URL}/${orgName}/robots` },
            ssoProvider: { value: `${ACCOUNTS_URL}/${orgName}/sso` },
            usage: { value: `${ACCOUNTS_URL}/${orgName}/usage` },
          },
        }}
        navigationProps={{
          left: [
            <OpenDrawerButton key="open-drawer-button" />,
            <NavbarLogo key="main-navigation-logo" />,
          ],
          right: [
            userButton,
          ].filter((item): item is React.ReactElement => item !== null),
          bottom: (
            <SubNavigation
              key="sub-navigation"
              search={
                <div className="flex items-center gap-2">
                  {!!searchBarItem && (
                    <NavbarSearch key="navbar-search">
                      <SearchBar />
                    </NavbarSearch>
                  )}
                  <MainNavigationButton
                    aria-label="GitHub"
                    onClick={() =>
                      window.open("https://github.com/upbound", "_blank")
                    }
                    icon={faGithub}
                  />
                  <MainNavigationButton
                    aria-label="Slack"
                    onClick={() =>
                      window.open("https://slack.crossplane.io", "_blank")
                    }
                    icon={faSlack}
                  />
                  <NavbarColorModeToggle key="color-mode-toggle" />
                </div>
              }
              links={regularItems.map((item, i) => (
                <ErrorCauseBoundary
                  key={i}
                  onError={(error) => {
                    const err = new Error(
                      `A theme navbar item failed to render.
Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
${JSON.stringify(item, null, 2)}`
                    )
                    // @ts-ignore - Error cause is supported in modern environments
                    err.cause = error
                    return err
                  }}
                >
                  <SubNavbarItem {...item} />
                </ErrorCauseBoundary>
              ))}
            />
          ),
        }}
      >
        <div>{/* Page content will be rendered here */}</div>
      </GlobalNav>
    </div>
  )
}

export default function NavbarContent(): ReactNode {
  const { isAuthenticated, isLoading } = useCurrentUser()

  // Show logged out navbar while loading or if not authenticated
  if (isLoading || !isAuthenticated) {
    return <LoggedOutNavbarContent />
  }

  return <LoggedInNavbarContent />
}
