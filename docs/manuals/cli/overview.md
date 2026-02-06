---
title: CLI Overview
sidebar_label: Overview
sidebar_position: 1
description: Install Crossplane, interact with the Upbound Marketplace and Managed
  Control Planes with the Upbound Up CLI.
hide_title: true
---
<!--vale gitlab.HeadingContent = NO -->
# Overview
<!--vale gitlab.HeadingContent = YES-->

The Upbound `up` command-line enables interaction with Upbound control planes. It also simplifies common workflows with Upbound Crossplane (UXP) and building Crossplane packages for the Upbound Marketplace or any OCI-compliant registry.

<!-- vale Google.Headings = NO -->
## Install the Up command-line
<!-- vale Google.Headings = YES -->
Install the `up` command-line via shell, Homebrew or Linux package.

<Tabs>
<TabItem value = "Shell">
Install the latest version of the `up` command-line via shell script by downloading the install script from [Upbound][upbound].

:::tip
Shell install is the preferred method for installing the `up` command-line.
:::

The shell install script automatically determines the operating system and platform architecture an installs the correct binary.

```shell
curl -sL "https://cli.upbound.io" | sh
```

:::note
Install a specific version of `up` by providing the version.

For example, to install version `v0.44.3` use the following command:

```shell
curl -sL "https://cli.upbound.io" | VERSION=v0.44.3 sh
```

Find the full list of versions in the <a href="https://cli.upbound.io/stable?prefix=stable/">Up command-line repository</a>.
:::

</TabItem>

<TabItem value="Windows" label="Windows">
Upbound provides a Windows executable.

```shell
curl.exe -sLo up.exe "https://cli.upbound.io/stable/v0.44.3/bin/windows_amd64/up.exe"
```

Find the full list of Windows versions in the [Up command-line
repository][win-versions].


</TabItem>

<TabItem value="Homebrew" label="Homebrew">
[Homebrew][homebrew] is a package manager for Linux and Mac OS.

Install the `up` command-line with a Homebrew `tap` using the command:

```shell
brew install upbound/tap/up
```
</TabItem>
<TabItem value="LinuxPackages" label="LinuxPackages">

Upbound provides both `.deb` and `.rpm` packages for Linux platforms.

Downloading packages requires both the [version][version] and CPU architecture (`linux_amd64`, `linux_arm`, `linux_arm64`).

### Debian package install
```shell
curl -sLo up.deb "https://cli.upbound.io/stable/v0.44.3/deb/up_0.44.3_linux_${ARCH}.deb"
```
<br />

<!-- vale Microsoft.HeadingAcronyms = NO -->
### RPM package install
<!-- vale Microsoft.HeadingAcronyms = YES -->
```shell
curl -sLo up.rpm "https://cli.upbound.io/stable/v0.44.3/rpm/linux_${ARCH}/up.rpm"
```
</TabItem>
</Tabs>

## Install docker-credential-up

Install the `docker-credential-up` credential helper with the same methods supported for `up`.

<Tabs>
<TabItem value ="Shell">

```shell
curl -sL "https://cli.upbound.io" | BIN=docker-credential-up sh
```

</TabItem>

<TabItem value="Homebrew" label="Homebrew">
```shell
brew install upbound/tap/docker-credential-up
```
</TabItem>
<TabItem value="LinuxPackages" label="LinuxPackages">

### Debian package install
```shell
curl -sLo up.deb "https://cli.upbound.io/stable/current/rpm/docker-credential-up_0.44.3_linux_${ARCH}.rpm"
```

<!-- vale Microsoft.HeadingAcronyms = NO -->
### RPM package install
<!-- vale Microsoft.HeadingAcronyms = YES -->
```shell

curl -sLo up.rpm "https://cli.upbound.io/stable/current/rpm/docker-credential-up_0.44.3_linux_${ARCH}.rpm"
```
</TabItem>
</Tabs>

[win-versions]: https://cli.upbound.io/_?prefix=stable/current/bin/windows_amd64/
[upbound]: https://cli.upbound.io
[homebrew]: https://brew.sh/
[version]: https://github.com/upbound/up/releases
