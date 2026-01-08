import { cpSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const repoRoot = resolve(process.cwd());
const source = resolve(repoRoot, 'llms.txt');
const target = resolve(repoRoot, 'docs-site/static/llms.txt');

try {
    mkdirSync(dirname(target), { recursive: true });
    cpSync(source, target);
    console.log(`Synced llms.txt to ${target}`);
} catch (error) {
    console.error('Failed to sync llms.txt into docs-site/static:', error);
    process.exitCode = 1;
}
