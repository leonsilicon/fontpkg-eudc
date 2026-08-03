# Source and provenance

## Upstream project

The fonts originate in Academia Sinica's Chinese Document Processing (CDP)
project and are part of the *Chinese Character Component Searching System of
Academia Sinica* / *Chinese Character Structure Database* (`漢字構形資料庫`).

Authoritative upstream references:

- [Project page](https://cdp.sinica.edu.tw/cdphanzi/)
- [Font and database update page](https://cdp.sinica.edu.tw/hanzi/cdphanzi.htm)
- [Upstream release and license statement](https://cdp.sinica.edu.tw/cdphanzi/declare.htm)
- [CDP technical report identifying both component fonts](https://cdp.sinica.edu.tw/service/documents/T090904.pdf)

The current upstream update page identifies `cdpeudck.tte` as the Kai-style
component EUDC font. The technical report identifies the pair:
`cdpeudc.tte` for the Ming/Song-style components and `cdpeudck.tte` for the
Kai-style components.

## Retrieved files

The original `.tte` files were retrieved from the `font/` directory of
[`caasi/cdphanzi`](https://github.com/caasi/cdphanzi), an archival mirror of
the Academia Sinica distribution, pinned to the commit that added the fonts:

[`6bded01519bede9189ef823adee455b3c73c4a31`](https://github.com/caasi/cdphanzi/commit/6bded01519bede9189ef823adee455b3c73c4a31)

Pinned source URLs:

- [`cdpeudc.tte`](https://raw.githubusercontent.com/caasi/cdphanzi/6bded01519bede9189ef823adee455b3c73c4a31/font/cdpeudc.tte)
- [`cdpeudck.tte`](https://raw.githubusercontent.com/caasi/cdphanzi/6bded01519bede9189ef823adee455b3c73c4a31/font/cdpeudck.tte)

The direct `.tte` link on Academia Sinica's legacy update page is currently
broken, and the legacy installer host no longer resolves. The official pages
remain the authority for the fonts' names, roles, and license; the pinned
archival mirror supplies the preserved binary files.

An older `eudc.tte` is still downloadable in Academia Sinica's
[`eudc.zip`](https://cdp.sinica.edu.tw/zip/font/eudc.zip). It was inspected but
was not used: although its cmap assigns U+EF3A, that glyph has no outline. The
later CDP files selected here both contain the required outline.

## Integrity and format

The packaged `.ttf` files are byte-for-byte identical to the retrieved `.tte`
files. No FontForge conversion, table rewrite, subsetting, hinting change, or
name-table change was performed.

| Packaged file | Original file | Style | Bytes | SHA-256 |
|---------------|---------------|-------|------:|---------|
| `cdpeudc.ttf` | `cdpeudc.tte` | Ming/Song | 1,542,002 | `7ada51fa65577661e9fd3687aea3ac3156ef855364a76242791728e6276e315a` |
| `cdpeudck.ttf` | `cdpeudck.tte` | Kai | 1,906,862 | `2e18a7df9874bb920becf0fa207c9ad1634604e48c72f94388d9d764914ca6b4` |

Both files begin with sfnt version `0x00010000` and contain standard TrueType
`cmap`, `glyf`, `head`, `loca`, and `maxp` tables. Each font contains 6,219
glyphs and a Microsoft Unicode BMP format 4 cmap covering 6,217 PUA code
points from U+E000 through U+F848. The `.tte` suffix is a Windows EUDC filename
convention, not a different font container.

## U+EF3A verification

In both fonts U+EF3A maps to glyph ID 3900, not glyph ID 0 (`.notdef`), and the
mapped glyph has a non-empty TrueType outline:

| File | Glyph ID | Contours | Bounds |
|------|---------:|---------:|--------|
| `cdpeudc.ttf` | 3900 | 6 | `(35, -12, 986, 713)` |
| `cdpeudck.ttf` | 3900 | 5 | `(133, 268, 935, 768)` |

The outlines render the component `⿱士冖`, used at the top of characters such
as `壸` and `壹`. The automated check is in
[`scripts/verify-fonts.mjs`](./scripts/verify-fonts.mjs).

## Why both fonts are included

Both are authentic CDP component fonts with the same PUA mapping but distinct
type styles. Including the pair preserves upstream's Ming/Song and Kai choices
and avoids silently substituting one visual style for the other. Their internal
family metadata is the same (`EUDC`), so `index.css` supplies distinct external
CSS family names without modifying either binary.

Private Use Area assignments are agreements, not universal character
semantics. U+EF3A has the CDP meaning documented here only when used with a
compatible CDP mapping.
