const { spawn } = require('child_process');
const path = require('path');

// Extract arguments passed to the script (like --port 3000)
const args = process.argv.slice(2);

// Resolve local next executable path
const isWindows = process.platform === 'win32';
const nextBin = path.resolve(__dirname, '..', 'node_modules', '.bin', isWindows ? 'next.cmd' : 'next');

// Spawn the next dev process with webpack enabled by default to prevent Turbopack path resolution issues on Windows
const child = spawn(nextBin, ['dev', '--webpack', ...args], {
  env: { ...process.env, FORCE_COLOR: '1' },
  shell: true,
  stdio: ['inherit', 'pipe', 'pipe'] // Inherit stdin, pipe stdout/stderr
});

let stdoutBuffer = '';
let stderrBuffer = '';

function processStream(data, isError = false) {
  let buffer = isError ? stderrBuffer : stdoutBuffer;
  buffer += data.toString();

  const lines = buffer.split('\n');
  buffer = lines.pop(); // Store last unfinished line back to buffer

  if (isError) {
    stderrBuffer = buffer;
  } else {
    stdoutBuffer = buffer;
  }

  for (const line of lines) {
    // Suppress Next.js slow filesystem warning lines
    if (line.includes('Slow filesystem detected') || line.includes('guides/local-development')) {
      continue;
    }
    // Write out clean lines
    if (isError) {
      process.stderr.write(line + '\n');
    } else {
      process.stdout.write(line + '\n');
    }
  }
}

child.stdout.on('data', (data) => {
  processStream(data, false);
});

child.stderr.on('data', (data) => {
  processStream(data, true);
});

child.on('close', (code) => {
  // Print any remaining buffered logs
  if (stdoutBuffer) {
    if (!stdoutBuffer.includes('Slow filesystem detected') && !stdoutBuffer.includes('guides/local-development')) {
      process.stdout.write(stdoutBuffer);
    }
  }
  if (stderrBuffer) {
    if (!stderrBuffer.includes('Slow filesystem detected') && !stderrBuffer.includes('guides/local-development')) {
      process.stderr.write(stderrBuffer);
    }
  }
  process.exit(code || 0);
});

// Forward standard termination signals to the child process
const signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
signals.forEach((sig) => {
  process.on(sig, () => {
    child.kill(sig);
  });
});
