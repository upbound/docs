/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { type ReactNode } from "react"

import type { Props } from "@theme/Navbar/Layout"

import { MainDrawerProvider } from "@upbound/elements"

export default function NavbarLayout({ children }: Props): ReactNode {
  return <MainDrawerProvider>{children}</MainDrawerProvider>
}
