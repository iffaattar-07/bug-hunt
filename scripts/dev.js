#!/usr/bin/env node
const net = require('net');
const { spawn } = require('child_process');

const PORT = Number(process.env.PORT || 3000);

function isBusy(port) {
  return new Promise((resolve) => {
    let settled = false;
    const done = (busy) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(busy);
    };
    const socket = net.connect({ port, host: '127.0.0.1' });
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
    setTimeout(() => done(false), 1500);
  });
}

(async () => {
  if (await isBusy(PORT)) {
    console.error('\n  A dev server is already running on http://localhost:' + PORT + '.');
    console.error('  Open that tab instead of starting a second server.\n');
    console.error('  Two `next dev` instances share the same .next directory, which');
    console.error('  404s the JS chunks and leaves every button on the page dead.\n');
    console.error('  If the page is stuck, run `npm run clean` and restart `npm run dev`.\n');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const child = spawn('next', args.length ? args : ['dev'], {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  child.on('exit', (code, signal) => process.exit(signal ? 1 : code ?? 0));
})();
