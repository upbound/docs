import React, { type ReactNode } from "react"
import type { Props } from "@theme/NavbarItem/DefaultNavbarItem"
import { MainNavigationMenuLink } from "@upbound/elements"
import clsx from "clsx"

export default function DefaultNavbarItem({
  className,
  isDropdownItem,
  ...props
}: Props): ReactNode {
  return (
    <MainNavigationMenuLink
      className={clsx(className, {
        dropdown__link: isDropdownItem,
      })}
      href={props.to}
    >
      {props.label}
    </MainNavigationMenuLink>
  )
}
