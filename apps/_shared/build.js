const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const dirRoot = path.join(__dirname, '../');
const dirs = fs.readdirSync(dirRoot, { withFileTypes: true }).filter(dir => dir.isDirectory && !/^_/.test(dir.name));

const modeIdx = process.argv.indexOf('--mode');
const mode = (modeIdx && process.argv[modeIdx+1]) || 'production';

dirs.forEach(dir => {
  const absPath = path.join(dirRoot, dir.name);
  const pkg = require(path.join(absPath, 'package.json'));
  const buildCommand = mode === 'development' && pkg.scripts && pkg.scripts['build-dev'] ? 'build-dev' : 'build';
  const command = `npm run ${buildCommand}`;

  execSync(command, { cwd: absPath, stdio: [process.stdin, process.stdout, process.stderr] });
});
