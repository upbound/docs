/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { type ReactNode } from "react"
import { MainNavigationLogo } from "@upbound/elements"

export default function NavbarLogo(): ReactNode {
  return <MainNavigationLogo logoHref="/" subtext="Docs" />
}
