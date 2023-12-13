---
title: Styling Content
weight: 30
description: "Add style and visuals to the docs"
---

The following is a list of Upbound documentation customizations that expand
traditional Markdown. Most of these are custom 
[Hugo Shortcodes](https://gohugo.io/templates/shortcode-templates/).

## Markdown
Upbound documentation uses Hugo to render Markdown to
HTML. Hugo supports [Commonmark](https://commonmark.org/) and 
[GitHub Flavored Markdown](https://github.github.com/gfm/) (`GFM`) through the
[Goldmark](https://github.com/yuin/goldmark/) parser.

{{< hint "note" >}}
Commonmark and `GFM` are extensions to the 
[standard Markdown](https://www.markdownguide.org/) language.
{{< /hint >}}

The docs support standard Markdown for images, links and tables. Use the
custom shortcodes provides a better user experience.

* [Images]({{< ref "#images">}})
* [Links]({{< ref "contribute/create-content#links">}})
* [Tables]({{< ref "#tables" >}})

## Hide long outputs
Some outputs may be verbose or relevant for
a small audience. Use the `expand` shortcode to hide blocks of text by default.

{{<expand "A large XRD" >}}
```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xpostgresqlinstances.database.example.org
spec:
  group: database.example.org
  names:
    kind: XPostgreSQLInstance
    plural: xpostgresqlinstances
  claimNames:
    kind: PostgreSQLInstance
    plural: postgresqlinstances
  versions:
  - name: v1alpha1
    served: true
    referenceable: true
    schema:
      openAPIV3Schema:
        type: object
        properties:
          spec:
            type: object
            properties:
              parameters:
                type: object
                properties:
                  storageGB:
                    type: integer
                required:
                - storageGB
            required:
            - parameters
```
{{< /expand >}}

The `expand` shortcode can have a title, the default is "Expand."
````yaml
{{</* expand "A large XRD" */>}}
```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: CompositeResourceDefinition
metadata:
  name: xpostgresqlinstances.database.example.org
```
{{</* /expand */>}}
````

{{< hint "important">}}
The `expand` shortcode requires opening and closing tags. Unclosed tags causes
Hugo to fail.
{{< /hint >}}

## Hints and alert boxes
Hint and alert boxes provide call-outs to important information to the reader.
Upbound docs support four different hint box styles.

{{< hint "note" >}}
Notes are useful for calling out optional information.
{{< /hint >}}

{{< hint "tip" >}}
Use tips to provide context or a best practice.
{{< /hint >}}

{{< hint "important" >}}
Important hints are for drawing extra attention to something. 
{{< /hint >}}

{{< hint "warning" >}}
Use warning boxes to alert users of things that may cause outages, lose data or
are irreversible changes.
{{< /hint >}}


Create a hint by using a shortcode in your markdown file:
```html
{{</* hint "note" */>}}
Your box content. This hint box is a note.
{{</* /hint */>}}
```

Use `note`, `tip`, `important`, or `warning` as the `hint` value.

{{< hint "important">}}
The `hint` shortcode requires opening and closing tags. Unclosed tags causes
Hugo to fail.
{{< /hint >}}

## Images

Save images in the `/images` directory of the section using the image. 

For example, save images related to contributing to the docs in `/content/contribute/images`.

The docs support standard 
[Markdown image syntax](https://www.markdownguide.org/basic-syntax/#images-1) 
but using the `img` shortcode is strongly recommended.

Images using the shortcode are automatically converted to `webp` image format,
compressed and use responsive image sizing. 

{{<hint "note">}}
The `img` shortcode doesn't support .SVG files.
{{< /hint >}}

The shortcode supports the following options:
* `src` - **Required**. The location of the image file, relative to `/content`.
* `alt` - **Required**. The image [alt text](https://accessibility.psu.edu/images/imageshtml/) for screen readers. 
* `align` - Optional. Change the image alignment on the page with `align=center` or `align=right`. By default images align left.
* `size` - Optional. Resizes the image. Useful for large images that need downscaling.
* `quality` - Optional. A value between 1 and 100. Change the image quality to
  increase image quality or decrease image file size. The default is `quality=75`.
* `lightbox` - Optional. Set to `false` to turn off the full-sized image pop.


### Resize images

The `size` can be one of:
* `xtiny` - Resizes the image to 150px.
* `tiny` - Resizes the image to 300px.
* `small` - Resizes the image to 600px.
* `medium` - Resizes the image to 800px.
* `large` - Resizes the image to 1200px.

By default the image isn't resized.

An example of using the `img` shortcode:
```html
{{</* img src="/concepts/images/WithUpbound.png" alt="Control planes with Upbound"  */>}}
```


Which generates this responsive image (change your browser size to see it change):

{{<img src="/concepts/images/WithUpbound.png" alt="Control planes with Upbound" background-color="white" >}}


Generate a smaller image with a `size` smaller than the original. 

For example,
```html
{{</* img src="/concepts/images/WithUpbound.png" size="xtiny" alt="Control planes with Upbound"  */>}}
```

Generates this image
{{< img src="/concepts/images/WithUpbound.png" alt="Control planes with Upbound" size="xtiny" >}}

## Tables
The docs support 
[extended markdown tables](https://www.markdownguide.org/extended-syntax/#tables)
but the styling isn't optimized.

| Title | A Column | Another Column |
| ---- | ---- | ---- | 
| Content | more content | even more content | 
| A Row | more of the row | another column in the row | 
<br />

Wrap a markdown table in the `{{</* table */>}}` shortcode to provide styling.

{{< hint "important" >}}
The `table` shortcode requires a closing `/table` tag.
{{< /hint >}}

```markdown
{{</* table */>}}
| Title | A Column | Another Column |
| ---- | ---- | ---- | 
| Content | more content | even more content | 
| A Row | more of the row | another column in the row | 
{{</* /table */>}}
```

{{< table >}}
| Title | A Column | Another Column |
| ---- | ---- | ---- | 
| Content | more content | even more content | 
| A Row | more of the row | another column in the row | 
{{< /table >}}

[Bootstrap](https://getbootstrap.com/docs/5.2/content/tables/) provides styling
for the `table` shortcode. The docs support all Bootstrap table classes passed
to the shortcode. 

### Striped tables
To create a table with 
[striped rows](https://getbootstrap.com/docs/5.2/content/tables/#striped-rows):

```markdown
{{</* table "table table-striped" */>}}
| Title | A Column | Another Column |
| ---- | ---- | ---- | 
| Content | more content | even more content | 
| A Row | more of the row | another column in the row | 
{{</* /table */>}}
```

{{< table "table table-striped">}}
| Title | A Column | Another Column |
| ---- | ---- | ---- | 
| Content | more content | even more content | 
| A Row | more of the row | another column in the row | 
{{< /table >}}

### Compact tables
For more compact tables use `table table-sm`
```markdown
{{</* table "table table-sm" */>}}
| Title | A Column | Another Column |
| ---- | ---- | ---- | 
| Content | more content | even more content | 
| A Row | more of the row | another column in the row | 
{{</* /table */>}}
```

{{< table "table table-sm">}}
| Title | A Column | Another Column |
| ---- | ---- | ---- | 
| Content | more content | even more content | 
| A Row | more of the row | another column in the row | 
{{< /table >}}

## Tabs
Use tabs to present information about a single topic with multiple exclusive
options. For example, creating a resource via command-line or GUI. 

To create a tab set, first create a `tabs` shortcode and use multiple `tab`
shortcodes inside for each tab.

```html
{{</* tabs */>}}

{{</* tab "First tab title" */>}}
An example tab. Place anything inside a tab.
{{</* /tab */>}}

{{</* tab "Second tab title" */>}}
A second example tab. 
{{</* /tab */>}}

{{</* /tabs */>}}
```

This code block renders the following tabs
{{< tabs >}}

{{< tab "First tab title" >}}
An example tab. Place anything inside a tab.
{{< /tab >}}

{{< tab "Second tab title" >}}
A second example tab. 
{{< /tab >}}

{{< /tabs >}}

Both `tab` and `tabs` require opening and closing tags. Unclosed tags causes
Hugo to fail.
