import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'stimecli',
      fileName: (format) => `index.js`, // Output as index.js regardless of format
      formats: ['cjs'] // Specify CommonJS format for Node.js CLI
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
      },
    },
  },
});
