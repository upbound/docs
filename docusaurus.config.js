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
    onBrokenMarkdownLinks: "warn",
    clientModules: [require.resolve("./scripts/copymarkdown.js")],
    i18n: {
        defaultLocale: "en",
        locales: ["en"],
    },
    markdown: {
        mermaid: true,
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
            navbar: {
                title: "",
                logo: {
                    alt: "Upbound Logo",
                    src: "img/logos/upbound-docs.svg",
                    srcDark: "img/logos/up-docs-white.svg",
                },
                items: [
                    {
                        type: "dropdown",
                        label: "Get Started",
                        position: "left",
                        items: [
                            {
                                label: "Introduction",
                                to: "/getstarted/introduction",
                            },
                            {
                                label: "Builders Workshop",
                                to: "/getstarted/builders-workshop",
                            },
                            {
                                label: "Migrate to Upbound",
                                to: "/getstarted/migrate-to-upbound",
                            },
                        ],
                    },
                    {
                        type: "dropdown",
                        label: "Guides",
                        position: "left",
                        items: [
                            {
                                label: "Solutions",
                                to: "/guides/solutions/overview",
                            },
                            {
                                label: "Use Cases",
                                to: "/guides/usecases/overview",
                            },
                            {
                                label: "Intelligent Controllers",
                                to: "/guides/intelligent-controllers/overview",
                            },
                        ],
                    },
                    {
                        type: "dropdown",
                        label: "Manuals",
                        position: "left",
                        items: [
                            {
                                label: "UXP (Universal Crossplane)",
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
                                to: "/manuals/console/",
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
                        type: "dropdown",
                        label: "Reference",
                        position: "left",
                        items: [
                            {
                                label: "APIs",
                                to: "/reference/apis/",
                            },
                            {
                                label: "CLI",
                                to: "/reference/cli-reference/",
                            },

                            {
                                label: "Release Notes",
                                to: "/reference/release-notes",
                            },
                            {
                                label: "Usage",
                                to: "/reference/usage",
                            },
                        ],
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
                respectPrefersColorScheme: true,
            },
            docs: {
                sidebar: {
                    hideable: false,
                },
            },
        }),
};

export default config;
