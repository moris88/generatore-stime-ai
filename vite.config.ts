import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	plugins: [
		dts({
			entryRoot: 'src',
			outDir: 'dist',
			exclude: ['vite.config.ts'],
		}),
	],
	build: {
		target: 'node22', // Target Node.js 22 environment
		ssr: true, // Enable SSR mode
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'stimecli',
			fileName: (_format) => `index.js`, // Output as index.js regardless of format
			formats: ['cjs'], // Specify CommonJS format for Node.js CLI
		},
		minify: true, // Ensure minification
		outDir: 'dist', // Output to the dist directory
		emptyOutDir: true, // Clear the dist directory before building
		rollupOptions: {
			// Externalize dependencies that should not be bundled
			external: ['inquirer', 'dotenv', '@google/generative-ai', 'fs/promises'],
			output: {
				// Ensure that external dependencies are not included in the bundle
				// and are properly imported as CommonJS modules.
				manualChunks: undefined,
				inlineDynamicImports: true,
			},
		},
	},
});
