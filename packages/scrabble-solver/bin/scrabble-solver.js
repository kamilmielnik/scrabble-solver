#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const waitOn = require('wait-on');

const PORT = 3333;
const APP_URL = `http://localhost:${PORT}`;

const server = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start', '-p', String(PORT)], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
});

process.on('SIGINT', forwardSignal);
process.on('SIGTERM', forwardSignal);
server.on('exit', exitWithServer);

openBrowser().catch(reportBrowserFailure);

function forwardSignal(signal) {
  server.kill(signal);
}

function exitWithServer(code) {
  process.exit(code ?? 1);
}

async function openBrowser() {
  const { default: open } = await import('open');

  await waitOn({ resources: [APP_URL] });
  await open(APP_URL);
}

function reportBrowserFailure(error) {
  console.error(`Cannot open the browser: ${error.message}`);
  console.log(`Open ${APP_URL} in your browser`);
}
