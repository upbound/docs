---
title: "Creating Content"
weight: 10
description: "How to clone, edit and create Upbound docs" 
---

The Upbound documentation lives in the Upbound
[docs GitHub repository](https://github.com/upbound/docs).

## Local development
Clone the documentation and use [Hugo](https://gohugo.io/) to 
build the Crossplane documentation site locally for development and testing. 

### Clone the docs repository
Clone the [Upbound docs repository](https://github.com/upbound/docs) with

```command
git clone https://github.com/upbound/docs.git
```

### Download Hugo
Download [Hugo](https://github.com/gohugoio/hugo/releases/tag/v0.111.3), the
static site generator Upbound docs uses.

{{< hint "important" >}}
Download the `hugo_extended` version. The standard Hugo package doesn't support
the Crossplane docs CSS.
{{< /hint >}}

Extract and run Hugo with `hugo server`.

Hugo builds the website and launch a local web server on
<a href="http://localhost:1313" data-proofer-ignore>http://localhost:1313</a>.

Any changes made are instantly reflected on the local web server. You
don't need to restart Hugo.

## Adding new content

### New sections

To create a new section create a new directory inside `/content`. Create an 
`_index.md` file to act as the main page for that section.

For example, the file `/content/contribute/_index.md` is the page at 
http://localhost:1313/contribute

{{<hint "note" >}}
All new pages require [front matter](#front-matter).
{{</hint >}}

### New pages

Create a new `.md` file under an existing directory inside `/content` to add a 
page to an existing section. The filename is the URL of the new page.

For example, a the file `/content/contribute/create-content.md` is the page at 
http://localhost:1313/contribute/create-content

{{<hint "note" >}}
All new pages require [front matter](#front-matter).
{{</hint >}}

## Front matter
Each page contains YAML metadata called 
[front matter](https://gohugo.io/content-management/front-matter/). Each page 
requires front matter to render.

```yaml
---
title: "A New Page"
weight: 610
description: "This is a page that describes stuff"
---
```

`title` defines the name of the page.
`weight` determines the ordering of the page in the table of contents. Lower
weight pages come before higher weights in the table of contents. 
`description` is a brief description of the page. The `description` is for docs 
search and external search engines. 

### Adding icons to sections

New sections require an icon for the navigation menu. Upbound docs use 
[Font Awesome icons](https://fontawesome.com/icons). 

Add the new `.svg` icon to `themes/upbound/layouts/partials/icons`

To allow dynamic icon resizing edit the .svg file and add  
`width="{{ .width | default "16px" }}"`  
and  
`height="{{ .width | default "16px" }}"`  
value inside the `<svg>` tag.

For example, 

```html
<svg xmlns="http://www.w3.org/2000/svg" width="{{ .width | default "16px" }}" height="{{ .height | default "16px" }}" class="{{ .class | default "" }}" viewBox="0 0 576 512">
```

{{<hint "note" >}}
Don't change the default `viewBox` values in the SVG file. 
{{< /hint >}}

## Headings
Use standard markdown for headings (`#`). The top level heading, a single hash
(`#`) is for the page title. All content headings should be two hashes (`##`) or
more.

## Hiding pages
To hide a page from the left-hand navigation use `tocHidden: true` in the front
matter of the page. The docs website skips pages with `tocHidden:true` when
building the menu.

For example, 
```yaml
---
title: "A New Page"
weight: 610
description: "This is a page that describes stuff"
tocHidden: true
---
```

## Links
The docs support standard 
[Markdown links](https://www.markdownguide.org/basic-syntax/#links) 
but Upbound prefers link shortcodes for links between docs pages. Using 
shortcodes prevents incorrect link creation and notifies which links to change 
after moving a page.

### Between docs pages
For links between pages use a standard Markdown link in the form:

`[Link text](link)`

Use the 
[Hugo ref shortcode](https://gohugo.io/content-management/shortcodes/#ref-and-relref)
with the path of the file relative to `/content` for the link location.

For example, to link to the `contribute` release index page use
```markdown
[Docs contributing guide]({{</* ref "contribute/_index.md" */>}})
```

<!-- This link in the comments matches the example link to ensure the example 
link is valid --> 
<!-- [Docs contributing guide]({{<ref "contribute/_index.md" >}}) -->

The `ref` value is of the markdown file, including `.md` extension.

If the `ref` value points to a page that doesn't exist, Hugo fails to start. 

### Linking to external sites
When linking to any page outside of
`upbound.io` use standard 
[markdown link syntax](https://www.markdownguide.org/basic-syntax/#links) 
without using the `ref` shortcode.

For example, 
```markdown
[Go to Crossplane](http://crossplane.io)
```
