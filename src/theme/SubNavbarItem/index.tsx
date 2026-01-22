/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { type ReactNode } from "react"
import type { Props } from "@theme/NavbarItem"
import {
  NavigationMenuLink,
  NavigationMenuLinkWithPopoverLinks,
} from "@upbound/elements"
import clsx from "clsx"
import { normalizeComponentType } from "../NavbarItem"

function SubNavDropdownNavbarItem({
  mobile = false,
  items,
  className,
  ...props
}: Props): ReactNode {
  return (
    <NavigationMenuLinkWithPopoverLinks
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
    </NavigationMenuLinkWithPopoverLinks>
  )
}

function DefaultSubNavbarItem({
  mobile = false,
  className,
  isDropdownItem,
  ...props
}: Props): ReactNode {
  return (
    <NavigationMenuLink
      className={clsx(className, {
        dropdown__link: isDropdownItem,
      })}
      rel="noopener noreferrer"
      href={props.to}
    >
      {props.label}
    </NavigationMenuLink>
  )
}

export default function SubNavbarItem({ type, ...props }: Props): ReactNode {
  const componentType = normalizeComponentType(type, props)

  if (componentType === "dropdown") {
    return <SubNavDropdownNavbarItem {...props} />
  }

  return <DefaultSubNavbarItem {...props} />
}
