// Temporary diagnostics (deleted after running).
const path = require('node:path');

const natives = [
  'lightningcss-win32-x64-msvc/lightningcss.win32-x64-msvc.node',
  '@rollup/rollup-win32-x64-msvc/rollup.win32-x64-msvc.node',
  '@tailwindcss/oxide-win32-x64-msvc/tailwindcss-oxide.win32-x64-msvc.node',
];

for (const rel of natives) {
  const abs = path.resolve('node_modules', rel);
  try {
    require(abs);
    console.log(`OK       ${rel}`);
  } catch (e) {
    console.log(`FAIL     ${rel}`);
    console.log(`         code=${e.code} msg=${String(e.message).split('\n')[0]}`);
  }
}

// Attribute decode helper for the folder
const fs = require('node:fs');
const a = fs.statSync('node_modules').mode;
console.log('\nnode_modules present:', fs.existsSync('node_modules'));
