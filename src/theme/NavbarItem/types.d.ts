/**
 * Type definitions for NavbarItem
 */

declare module "@theme/NavbarItem" {
  import type { ComponentProps, ReactNode } from "react"

  export type NavbarItemType =
    | "default"
    | "doc"
    | "docSidebar"
    | "docsVersion"
    | "docsVersionDropdown"
    | "dropdown"
    | "html"
    | "localeDropdown"
    | "search"
    | string

  export type Props = {
    type?: NavbarItemType
    label?: ReactNode
    to?: string
    href?: string
    docId?: string
    position?: "left" | "right"
    items?: Props[]
    className?: string
    [key: string]: any
  }

  export default function NavbarItem(props: Props): ReactNode
}
