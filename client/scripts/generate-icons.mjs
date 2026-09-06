// This script generates PNG icons for the PWA.
// Run with: node scripts/generate-icons.mjs
// Output goes to public/icon/

import { deflateSync, createDeflate } from "zlib";
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) {
    crc ^= b;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (~crc) >>> 0;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcVal = Buffer.alloc(4);
  crcVal.writeUInt32BE(crc32(crcInput));
  return Buffer.concat([len, typeBytes, data, crcVal]);
}

function createPNG(width, height, drawFn) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const raw = [];
  for (let y = 0; y < height; y++) {
    raw.push(0); // filter none
    for (let x = 0; x < width; x++) {
      const [r, g, b] = drawFn(x, y, width, height);
      raw.push(r & 0xff, g & 0xff, b & 0xff);
    }
  }

  const idat = deflateSync(Buffer.from(raw), { level: 6 });
  return Buffer.concat([
    sig,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", idat),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * Math.max(0, Math.min(1, t)));
}

function drawKisanIcon(x, y, w, h) {
  const cx = w / 2;

  // Background gradient: dark green top to slightly lighter bottom
  let R = lerp(0x0a, 0x1a, y / h);
  let G = lerp(0x1e, 0x3a, y / h);
  let B = lerp(0x0a, 0x1a, y / h);

  // Sun
  const sunX = cx, sunY = h * 0.28, sunR = w * 0.13;
  const dSun = Math.sqrt((x - sunX) ** 2 + (y - sunY) ** 2);

  // Sun rays
  if (dSun >= sunR * 0.95 && dSun < sunR * 2.0) {
    const ang = Math.atan2(y - sunY, x - sunX);
    if (Math.cos(ang * 8) > 0.65) {
      const fade = 1 - (dSun - sunR) / (sunR * 1.05);
      R = lerp(R, 0xf0, fade * 0.8);
      G = lerp(G, 0xb8, fade * 0.8);
      B = lerp(B, 0x20, fade * 0.8);
    }
  }

  // Sun fill
  if (dSun < sunR) {
    R = 0xf5; G = 0xd0; B = 0x40;
  }

  // Wheat head (ellipse)
  const headCX = cx, headCY = h * 0.38, headW = w * 0.09, headH = h * 0.15;
  if (((x - headCX) / headW) ** 2 + ((y - headCY) / headH) ** 2 < 1) {
    R = 0xe0; G = 0xaa; B = 0x30;
  }

  // Stem
  const stemW = w * 0.045;
  if (x > cx - stemW && x < cx + stemW && y > h * 0.42 && y < h * 0.82) {
    R = 0x45; G = 0xaa; B = 0x28;
  }

  // Left leaf
  const lx = cx - w * 0.12, ly = h * 0.57, lr = w * 0.095;
  if (Math.sqrt((x - lx) ** 2 + (y - ly) ** 2) < lr) {
    R = 0x38; G = 0x99; B = 0x1e;
  }

  // Right leaf
  const rx2 = cx + w * 0.12, ry = h * 0.62, rr = w * 0.095;
  if (Math.sqrt((x - rx2) ** 2 + (y - ry) ** 2) < rr) {
    R = 0x38; G = 0x99; B = 0x1e;
  }

  // Ground strip
  if (y > h * 0.82 && y < h * 0.88) {
    R = lerp(0x30, 0x48, (y - h * 0.82) / (h * 0.06));
    G = lerp(0x70, 0x88, (y - h * 0.82) / (h * 0.06));
    B = lerp(0x18, 0x20, (y - h * 0.82) / (h * 0.06));
  }

  return [R, G, B];
}

const outDir = join(rootDir, "public", "icon");
mkdirSync(outDir, { recursive: true });

console.log("Generating icons...");

const png192 = createPNG(192, 192, drawKisanIcon);
const png512 = createPNG(512, 512, drawKisanIcon);

writeFileSync(join(outDir, "icon-192.png"), png192);
writeFileSync(join(outDir, "icon-512.png"), png512);
writeFileSync(join(outDir, "icon-maskable-192.png"), png192);
writeFileSync(join(outDir, "icon-maskable-512.png"), png512);

console.log("Done!");
console.log("  icon-192.png:", png192.length, "bytes");
console.log("  icon-512.png:", png512.length, "bytes");
