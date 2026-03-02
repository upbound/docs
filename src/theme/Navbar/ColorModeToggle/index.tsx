/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { type ReactNode } from "react"
import { useColorMode, useThemeConfig } from "@docusaurus/theme-common"
import type { Props } from "@theme/Navbar/ColorModeToggle"
import { faMoonReg, faSunBright, MainNavigationButton } from "@upbound/elements"

export default function NavbarColorModeToggle({ className }: Props): ReactNode {
  const { disableSwitch } = useThemeConfig().colorMode
  const { colorModeChoice, setColorMode } = useColorMode()

  if (disableSwitch) {
    return null
  }

  return (
    <MainNavigationButton
      aria-label="Toggle color mode"
      onClick={() =>
        setColorMode(colorModeChoice === "dark" ? "light" : "dark")
      }
      icon={colorModeChoice === "dark" ? faMoonReg : faSunBright}
      className={className}
    ></MainNavigationButton>
  )
}
