// Temporary diagnostics (deleted after running).
function t(label, fn) {
  try {
    const r = fn();
    console.log(`OK   ${label}: ${typeof r === 'string' ? r : 'loaded'}`);
  } catch (e) {
    console.log(`FAIL ${label}: ${e.code || ''} ${e.message.split('\n')[0]}`);
  }
}

t('require.resolve(lightningcss-win32-x64-msvc)', () =>
  require.resolve('lightningcss-win32-x64-msvc'),
);
t('require(lightningcss-win32-x64-msvc)', () => require('lightningcss-win32-x64-msvc'));
t('require(lightningcss)', () => require('lightningcss'));
t('require(tailwindcss)', () => require('tailwindcss'));
t('require(@tailwindcss/vite)', () => require('@tailwindcss/vite'));
t('require(vite)', () => require('vite'));
t('require(esbuild)', () => require('esbuild'));

console.log('\nplatform:', process.platform, process.arch);
console.log('node:', process.version);
