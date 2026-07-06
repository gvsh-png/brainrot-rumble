#!/usr/bin/env node
// Copies static web assets into www/ for Capacitor Android packaging.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'www');

const COPY_FILES = ['index.html', 'styles.css', 'manifest.webmanifest', 'br-debug.js', 'privacy.html'];
const COPY_DIRS = ['js', 'icons'];

function rmrf(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) rmrf(p);
    else fs.unlinkSync(p);
  }
  fs.rmdirSync(dir);
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else copyFile(s, d);
  }
}

rmrf(OUT);
fs.mkdirSync(OUT, { recursive: true });

for (const f of COPY_FILES) {
  const src = path.join(ROOT, f);
  if (fs.existsSync(src)) copyFile(src, path.join(OUT, f));
}

for (const d of COPY_DIRS) {
  const src = path.join(ROOT, d);
  if (fs.existsSync(src)) copyDir(src, path.join(OUT, d));
}

console.log('[prepare-www] wrote', OUT);
