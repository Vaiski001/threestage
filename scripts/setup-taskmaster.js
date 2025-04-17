import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

console.log('Setting up Task Master for existing project...');

// Ensure directories exist
const dirs = [
  '.cursor',
  '.cursor/tasks',
  '.cursor/rules',
  'scripts'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Check if MCP config exists
const mcpConfigPath = path.join('.cursor', 'claude-taskmaster-config.json');
if (!fs.existsSync(mcpConfigPath)) {
  console.log('Please create .cursor/claude-taskmaster-config.json with your Anthropic API key');
  console.log('See example in the Task Master documentation');
}

// Install dependencies if not already installed
try {
  console.log('Checking Task Master installation...');
  execSync('npm list -g task-master-ai', { stdio: 'pipe' });
  console.log('Task Master is already installed globally');
} catch (error) {
  console.log('Installing Task Master globally...');
  execSync('npm install -g task-master-ai', { stdio: 'inherit' });
}

console.log('\nTask Master setup complete!');
console.log('\nNext steps:');
console.log('1. Edit .cursor/claude-taskmaster-config.json to add your Anthropic API key');
console.log('2. Enable the MCP in your Cursor settings');
console.log('3. Use prompt: "Can you help me implement task 2?" to start working with tasks'); 