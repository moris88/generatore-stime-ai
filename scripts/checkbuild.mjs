import { execSync } from 'node:child_process';
import fs from 'node:fs';

const file = 'dist/index.js';

if (!fs.existsSync(file)) {
	console.log('⚠️  Build non trovata. Eseguo pnpm build...\n');
}

try {
	console.log('🚀 Eseguo il build del progetto...\n');
	execSync('pnpm build', { stdio: 'inherit' });
} catch (err) {
	console.error(err);
	console.error('\n❌ Build fallita.');
	process.exit(1);
}
