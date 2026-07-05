#!/usr/bin/env node
// Generates simple launcher icons (solid arcade green + orange BR monogram blocks).
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT = path.join(__dirname, '..', 'icons');
const SIZES = [192, 512];

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

function makePng(size) {
  const w = size, h = size;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    const row = y * (w * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < w; x++) {
      const i = row + 1 + x * 4;
      const nx = x / w, ny = y / h;
      const border = nx < 0.08 || ny < 0.08 || nx > 0.92 || ny > 0.92;
      const block = nx > 0.22 && nx < 0.78 && ny > 0.28 && ny < 0.72;
      const left = nx < 0.5;
      let r, g, b;
      if (border) { r = 58; g = 45; b = 34; }
      else if (block) { r = left ? 232 : 74; g = left ? 85 : 163; b = left ? 45 : 223; }
      else { r = 111; g = 174; b = 61; }
      raw[i] = r; raw[i + 1] = g; raw[i + 2] = b; raw[i + 3] = 255;
    }
  }
  const compressed = zlib.deflateSync(raw);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

fs.mkdirSync(OUT, { recursive: true });
for (const s of SIZES) {
  const file = path.join(OUT, `icon-${s}.png`);
  fs.writeFileSync(file, makePng(s));
  console.log('[icons] wrote', file);
}
