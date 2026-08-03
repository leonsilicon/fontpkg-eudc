import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const codePoint = 0xef3a;

const expectedFonts = [
  {
    file: "cdpeudc.ttf",
    sha256: "7ada51fa65577661e9fd3687aea3ac3156ef855364a76242791728e6276e315a",
    glyphId: 3900,
    contours: 6,
  },
  {
    file: "cdpeudck.ttf",
    sha256: "2e18a7df9874bb920becf0fa207c9ad1634604e48c72f94388d9d764914ca6b4",
    glyphId: 3900,
    contours: 5,
  },
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readTables(buffer, file) {
  assert(buffer.length >= 12, `${file}: truncated sfnt header`);
  assert(
    buffer.readUInt32BE(0) === 0x00010000,
    `${file}: expected TrueType sfnt version 0x00010000`,
  );

  const numTables = buffer.readUInt16BE(4);
  assert(buffer.length >= 12 + numTables * 16, `${file}: truncated table directory`);

  const tables = new Map();
  for (let index = 0; index < numTables; index += 1) {
    const record = 12 + index * 16;
    const tag = buffer.toString("ascii", record, record + 4);
    const offset = buffer.readUInt32BE(record + 8);
    const length = buffer.readUInt32BE(record + 12);
    assert(offset + length <= buffer.length, `${file}: ${tag} table exceeds file bounds`);
    tables.set(tag, { offset, length });
  }

  for (const tag of ["cmap", "glyf", "head", "loca", "maxp"]) {
    assert(tables.has(tag), `${file}: missing ${tag} table`);
  }

  return tables;
}

function mapFormat4(buffer, subtable, target) {
  const segCount = buffer.readUInt16BE(subtable + 6) / 2;
  const endCodes = subtable + 14;
  const startCodes = endCodes + segCount * 2 + 2;
  const idDeltas = startCodes + segCount * 2;
  const idRangeOffsets = idDeltas + segCount * 2;

  for (let segment = 0; segment < segCount; segment += 1) {
    const end = buffer.readUInt16BE(endCodes + segment * 2);
    const start = buffer.readUInt16BE(startCodes + segment * 2);
    if (target < start || target > end) {
      continue;
    }

    const delta = buffer.readInt16BE(idDeltas + segment * 2);
    const rangeOffsetPosition = idRangeOffsets + segment * 2;
    const rangeOffset = buffer.readUInt16BE(rangeOffsetPosition);
    if (rangeOffset === 0) {
      return (target + delta) & 0xffff;
    }

    const glyphPosition =
      rangeOffsetPosition + rangeOffset + (target - start) * 2;
    assert(glyphPosition + 2 <= buffer.length, "cmap glyph index exceeds file bounds");
    const glyph = buffer.readUInt16BE(glyphPosition);
    return glyph === 0 ? 0 : (glyph + delta) & 0xffff;
  }

  return 0;
}

function mapCodePoint(buffer, cmap, target, file) {
  const cmapStart = cmap.offset;
  const subtableCount = buffer.readUInt16BE(cmapStart + 2);

  for (let index = 0; index < subtableCount; index += 1) {
    const record = cmapStart + 4 + index * 8;
    const subtable = cmapStart + buffer.readUInt32BE(record + 4);
    assert(subtable + 2 <= cmapStart + cmap.length, `${file}: cmap subtable exceeds bounds`);
    if (buffer.readUInt16BE(subtable) === 4) {
      return mapFormat4(buffer, subtable, target);
    }
  }

  throw new Error(`${file}: no supported format 4 cmap subtable`);
}

function inspectGlyph(buffer, tables, glyphId, file) {
  const maxp = tables.get("maxp");
  const numGlyphs = buffer.readUInt16BE(maxp.offset + 4);
  assert(glyphId > 0, `${file}: U+EF3A maps to .notdef`);
  assert(glyphId < numGlyphs, `${file}: glyph ID ${glyphId} exceeds maxp count`);

  const head = tables.get("head");
  const loca = tables.get("loca");
  const glyf = tables.get("glyf");
  const indexToLocFormat = buffer.readInt16BE(head.offset + 50);
  assert(
    indexToLocFormat === 0 || indexToLocFormat === 1,
    `${file}: unsupported indexToLocFormat ${indexToLocFormat}`,
  );

  const entrySize = indexToLocFormat === 0 ? 2 : 4;
  const locaPosition = loca.offset + glyphId * entrySize;
  assert(locaPosition + entrySize * 2 <= loca.offset + loca.length, `${file}: loca entry exceeds bounds`);

  const readLocation = (position) =>
    indexToLocFormat === 0
      ? buffer.readUInt16BE(position) * 2
      : buffer.readUInt32BE(position);

  const start = readLocation(locaPosition);
  const end = readLocation(locaPosition + entrySize);
  assert(end > start, `${file}: U+EF3A has an empty glyph outline`);
  assert(glyf.offset + end <= glyf.offset + glyf.length, `${file}: glyph data exceeds glyf table`);

  return {
    contours: buffer.readInt16BE(glyf.offset + start),
    outlineBytes: end - start,
    numGlyphs,
  };
}

for (const expected of expectedFonts) {
  const buffer = await readFile(path.join(root, expected.file));
  const digest = createHash("sha256").update(buffer).digest("hex");
  assert(digest === expected.sha256, `${expected.file}: unexpected SHA-256 ${digest}`);

  const tables = readTables(buffer, expected.file);
  const glyphId = mapCodePoint(buffer, tables.get("cmap"), codePoint, expected.file);
  assert(
    glyphId === expected.glyphId,
    `${expected.file}: U+EF3A mapped to glyph ${glyphId}, expected ${expected.glyphId}`,
  );

  const glyph = inspectGlyph(buffer, tables, glyphId, expected.file);
  assert(
    glyph.contours === expected.contours,
    `${expected.file}: glyph ${glyphId} has ${glyph.contours} contours, expected ${expected.contours}`,
  );

  console.log(
    `${expected.file}: OK (sha256=${digest}, U+EF3A=gid${glyphId}, contours=${glyph.contours}, outlineBytes=${glyph.outlineBytes}, glyphs=${glyph.numGlyphs})`,
  );
}
