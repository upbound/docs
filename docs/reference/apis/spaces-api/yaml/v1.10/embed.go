// Copyright 2024 Upbound Inc.
// All rights reserved

package crds

import (
	"embed"
)

//go:embed *.yaml
var Manifests embed.FS
