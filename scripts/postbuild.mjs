import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('dist/index.js');
const shebang = '#!/usr/bin/env node\n';

const content = fs.readFileSync(file, 'utf8');

if (!content.startsWith(shebang)) {
	fs.writeFileSync(file, shebang + content);
}

fs.chmodSync(file, 0o755);
