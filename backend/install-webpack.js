const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const currentDir = process.cwd();

console.log('Installing webpack dependencies...');

try {
  // Install webpack dependencies
  execSync(
    'npm install --save-dev webpack webpack-cli webpack-node-externals ts-loader',
    {
      stdio: 'inherit',
    }
  );

  console.log('Webpack dependencies installed successfully!');

  // Check if webpack is installed
  const webpackPath = path.join(
    currentDir,
    'node_modules',
    'webpack',
    'bin',
    'webpack.js'
  );
  if (fs.existsSync(webpackPath)) {
    console.log('Webpack binary found at:', webpackPath);
  } else {
    console.error('Webpack binary not found. Installation may have failed.');
  }
} catch (error) {
  console.error('Error installing dependencies:', error.message);
  process.exit(1);
}
