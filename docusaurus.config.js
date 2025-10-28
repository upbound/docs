// @ts-check
import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: "Upbound Documentation",
    tagline: "Guide your internal cloud platform journey",
    favicon: "img/icons/favicon.ico",
    trailingSlash: true,
    url: "https://docs.upbound.io",
    baseUrl: "/",
    organizationName: "upbound",
    projectName: "docs",
    onBrokenLinks: "warn",
    clientModules: [require.resolve("./scripts/copymarkdown.js")],
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    markdown: {
        mermaid: true,
        hooks: {
            onBrokenMarkdownLinks: "warn",
        },
    },
    themes: ["@docusaurus/theme-mermaid"],
    presets: [
        [
            "classic",
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: false,
                blog: false,
                theme: {
                    customCss: "./src/css/custom.css",
                },
                gtag: {
                    trackingID: "G-J3WTQYFSSY",
                    anonymizeIP: true,
                },
            }),
        ],
    ],
    plugins: [
        [
            "docusaurus-pushfeedback",
            {
                project: "0p5hvygqxb",
            },
        ],
        [
            "@docusaurus/plugin-content-docs",
            {
                path: "docs",
                routeBasePath: "/",
                sidebarPath: require.resolve("./src/sidebars/main.js"),
            },
        ],
        "./scripts/plan-plugin.js",
    ],
    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            announcementBar: {
                id: "my_custom_banner",
                content:
                    '<a href="https://www.upbound.io/events/kubecon-cloudnativecon-north-america-atlanta-2025" target="_blank" rel="noopener noreferrer">🎉 Join us at KubeCon Atlanta!</a>',
                backgroundColor: "#9b5efc",
                textColor: "#fff",
                isCloseable: true,
            },
            head: [
                [
                    "meta",
                    {
                        property: "og:image",
                        content: "img/up-logo.png",
                    },
                ],
            ],
            image: "img/up-logo.png",
            navbar: {
                title: "",
                logo: {
                    alt: "Upbound Logo",
                    src: "img/logos/upbound-docs.svg",
                    srcDark: "img/logos/up-docs-white.svg",
                },
                items: [
                    {
                        type: "doc",
                        label: "Get Started",
                        position: "left",
                        docId: "getstarted/overview",
                    },
                    {
                        type: "dropdown",
                        label: "Guides",
                        position: "left",
                        to: "/guides/",
                        items: [
                            {
                                label: "Intelligent Control Planes",
                                to: "/guides/intelligent-control-planes/",
                            },
                            {
                                label: "Platform Solutions",
                                to: "/guides/solutions/general-idp/get-started/",
                            },
                            {
                                label: "Use Cases",
                                to: "/guides/usecases/",
                            },
                        ],
                    },
                    {
                        type: "dropdown",
                        label: "Manuals",
                        to: "/manuals/",
                        position: "left",
                        items: [
                            {
                                label: "UXP (Upbound Crossplane)",
                                to: "/manuals/uxp/overview",
                            },
                            {
                                label: "Spaces",
                                to: "/manuals/spaces/overview",
                            },
                            {
                                label: "CLI",
                                to: "/manuals/cli/overview",
                            },
                            {
                                label: "Console",
                                to: "/manuals/console/upbound-console/",
                            },
                            {
                                label: "Packages",
                                to: "/manuals/packages/overview",
                            },
                            {
                                label: "Marketplace",
                                to: "/manuals/marketplace/overview",
                            },
                            {
                                label: "Platform",
                                to: "/manuals/platform/overview",
                            },
                        ],
                    },
                    {
                        type: "doc",
                        label: "Reference",
                        position: "left",
                        docId: "reference/index",
                    },
                    {
                        type: "search",
                        position: "right",
                    },
                ],
            },
            algolia: {
                appId: "4OZX85VEXQ",
                apiKey: "7880f8f03cb89ce23f18d4359fb10e5e",
                indexName: "upbound-docs",
                contextualSearch: true,
                searchPagePath: "search",
                searchParameters: {},
            },
            footer: {
                style: "dark",
                copyright: `
    <div class="footer-content">
      <p class="footer-message">
        Join the community and start building your platform with Upbound Crossplane
      </p>
      <div class="footer-links">
        <a href="https://slack.crossplane.io">Community Slack</a>
        <a href="https://github.com/upbound">GitHub</a>
        <a href="https://marketplace.upbound.io">Marketplace</a>
        <a href="https://www.upbound.io/pricing">Pricing</a>
      </div>
      <p class="footer-copyright">
        Copyright © ${new Date().getFullYear()} Upbound. All rights reserved.
      </p>
    </div>
  `,
            },
            prism: {
                theme: prismThemes.github,
                darkTheme: prismThemes.dracula,
                additionalLanguages: ["bash", "yaml", "json", "go", "python"],
            },
            colorMode: {
                defaultMode: "light",
                disableSwitch: false,
                respectPrefersColorScheme: false,
            },
            docs: {
                sidebar: {
                    hideable: true,
                },
            },
        }),
};

export default config;
