const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define paths
const paymentGatewayDir = __dirname;
const reactAppDir = path.join(__dirname, '..', 'kaari-web');

// Check if the React app directory exists
if (!fs.existsSync(reactAppDir)) {
  console.error(`React app directory not found at ${reactAppDir}`);
  process.exit(1);
}

// Function to start a process with colored output
function startProcess(name, command, args, cwd, color) {
  const colorCodes = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m'
  };

  console.log(`${colorCodes[color]}[${name}] Starting: ${command} ${args.join(' ')}${colorCodes.reset}`);
  
  const proc = spawn(command, args, {
    cwd,
    shell: true,
    stdio: 'pipe',
    env: { ...process.env, FORCE_COLOR: true }
  });

  proc.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${colorCodes[color]}[${name}] ${line}${colorCodes.reset}`);
      }
    }
  });

  proc.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${colorCodes.red}[${name} ERROR] ${line}${colorCodes.reset}`);
      }
    }
  });

  proc.on('close', (code) => {
    console.log(`${colorCodes[color]}[${name}] Process exited with code ${code}${colorCodes.reset}`);
  });

  return proc;
}

// Start payment gateway server
const paymentGatewayServer = startProcess(
  'Payment Gateway',
  'npm',
  ['run', 'dev'],
  paymentGatewayDir,
  'cyan'
);

// Start React app
const reactApp = startProcess(
  'React App',
  'npm',
  ['start'],
  reactAppDir,
  'green'
);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down all processes...');
  paymentGatewayServer.kill();
  reactApp.kill();
  process.exit(0);
});

console.log('\nRunning both servers. Press Ctrl+C to stop all processes.\n'); 