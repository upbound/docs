import React, { type ReactNode } from "react"
import DropdownNavbarItemMobile from "@theme/NavbarItem/DropdownNavbarItem/Mobile"
import DropdownNavbarItemDesktop from "@theme/NavbarItem/DropdownNavbarItem/Desktop"
import type { Props } from "@theme/NavbarItem/DropdownNavbarItem"
import {
  faGift,
  faGiftRegular,
  MainNavigationMenuLinkWithBasicPopOver,
  MainNavigationMenuLinkWithPopoverLinks,
} from "@upbound/elements"
import NavbarItem from "@theme/NavbarItem"

export default function DropdownNavbarItem({
  mobile = false,
  items,
  className,
  ...props
}: Props): ReactNode {
  return (
    <MainNavigationMenuLinkWithPopoverLinks
      variant="text"
      href={props.to}
      className={className}
      aria-label="Claim your free credits today"
      popover={{
        links: (items ?? []).map((item) => ({
          label: item.label as string,
          href: item.to as string,
        })),
      }}
    >
      {props.label}
    </MainNavigationMenuLinkWithPopoverLinks>
  )
}
