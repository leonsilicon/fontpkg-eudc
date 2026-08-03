# Academia Sinica CDP EUDC

## 📦 Package Info

| Property | Value |
|----------|-------|
| Package Name | `fontpkg-eudc` |
| Display Name | Academia Sinica CDP EUDC |
| Version | 1.0.0 |
| Total Font Size | 3.45 MB |
| Font File Count | 2 |

> **Note:** This package is published as `fontpkg-eudc` rather than under the
> `@fontpkg` scope, following the naming approach used by
> `fontpkg-last-resort`.

## 📁 Included Fonts

| File | Format | Size | Style |
|------|--------|------|-------|
| `cdpeudc.ttf` | TTF | 1.54 MB | Ming/Song |
| `cdpeudck.ttf` | TTF | 1.91 MB | Kai |

## 🏷️ Font Names

Both original binaries use the internal family and full name `EUDC`. The
included CSS exposes distinct external family names without altering the font
files:

| File | CSS `font-family` |
|------|-------------------|
| `cdpeudc.ttf` | `Academia Sinica CDP EUDC Ming` |
| `cdpeudck.ttf` | `Academia Sinica CDP EUDC Kai` |

## ℹ️ Font Information

| Property | Value |
|----------|-------|
| Coverage | U+E000–U+F848 (6,217 PUA code points) |
| Required Glyph | U+EF3A → glyph ID 3900 |
| U+EF3A Shape | `⿱士冖`, the component at the top of `壸` and `壹` |
| Upstream | Academia Sinica Chinese Document Processing Laboratory |
| License | Creative Commons Attribution-ShareAlike 2.5 Taiwan |

## Install

```sh
npm i fontpkg-eudc
```

## Use with CSS

Import the packaged stylesheet from JavaScript:

```js
import "fontpkg-eudc/index.css";
```

Then select either style:

```css
.cdp-component-ming {
  font-family: "Academia Sinica CDP EUDC Ming", sans-serif;
}

.cdp-component-kai {
  font-family: "Academia Sinica CDP EUDC Kai", serif;
}
```

```html
<span class="cdp-component-ming">&#xEF3A;</span>
```

Bundlers that understand package CSS will resolve the relative font URLs from
`index.css`. The `.ttf` files can also be imported or copied directly from the
installed package.

## About the fonts

Academia Sinica's CDP system uses Private Use Area characters for unencoded
Chinese components. U+EF3A is one such CDP assignment. It maps to a real,
non-`.notdef` outline in both included fonts.

The upstream files are named `cdpeudc.tte` and `cdpeudck.tte`. Inspection
confirmed that they are standard TrueType sfnt binaries. This package changes
only their filename extensions to `.ttf`; the bytes and SHA-256 digests remain
unchanged. Both fonts are included because upstream provides separate
Ming/Song and Kai renderings.

PUA code points do not have universal meanings. Use U+EF3A with these CDP fonts
or another font that explicitly follows the same CDP mapping.

## Verification

The package includes a dependency-free verifier that checks the expected file
digests, TrueType tables, U+EF3A cmap entry, glyph ID, and non-empty outline:

```sh
npm test
```

For an installed package, it can also be run directly:

```sh
node node_modules/fontpkg-eudc/scripts/verify-fonts.mjs
```

## Source & License

See [`SOURCE.md`](./SOURCE.md) for pinned source URLs, checksums, format
inspection, and the decision to include both styles.

The fonts are **not** licensed under the SIL Open Font License. Academia Sinica
offers the separately distributed fonts under GFDL 1.2 or CC BY-SA 2.5 Taiwan;
this package uses the CC BY-SA 2.5 Taiwan option. See [`LICENSE`](./LICENSE),
the exact upstream release statement in
[`UPSTREAM-LICENSE.md`](./UPSTREAM-LICENSE.md), and the upstream-provided legal
code copy in
[`LICENSE.CC-BY-SA-2.5-TW.pdf`](./LICENSE.CC-BY-SA-2.5-TW.pdf).
