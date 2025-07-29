import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['axios'], // Mark axios as external dependency
  treeshake: true,
  minify: false, // Keep readable for debugging
  target: 'node16', // Target modern Node.js
  outDir: 'dist',
  onSuccess: 'echo "Build completed successfully!"',
});