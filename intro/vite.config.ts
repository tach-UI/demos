import { defineConfig } from 'vite'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true
    })
  ],
  resolve: {
    // No aliases needed - use npm packages directly
  },
  define: {
    // Define globals for browser compatibility
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify('production'),
    // Strip validation system in production
    __DEV__: false,
    __VALIDATION__: false,
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        format: 'es',
        manualChunks: (id) => {
          // Bundle tachui core and symbols together
          if (id.includes('@tachui/core') || id.includes('@tachui/symbols')) {
            return 'tachui'
          }
          // Keep lucide bundled since @tachui/symbols depends on it
          if (id.includes('lucide')) {
            return 'tachui'
          }
        }
      },
      external: (id) => {
        // Don't bundle Node.js built-ins
        return ['path', 'fs', 'crypto', 'util'].includes(id)
      },
      treeshake: {
        // Aggressive tree shaking but preserve @tachui/symbols side effects
        moduleSideEffects: (id) => {
          // Preserve side effects for @tachui/symbols to ensure icon registration
          if (id?.includes('@tachui/symbols')) return true
          return false
        },
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
        unknownGlobalSideEffects: false
      }
    },
    // Generate stats for bundle analysis
    reportCompressedSize: true,
    // Enable minification
    minify: 'esbuild',
    // Source maps for debugging
    sourcemap: false // Set to true if you need debugging
  },
  server: {
    port: 3002,
    host: '0.0.0.0'
  },
  preview: {
    port: 3002,
    host: '0.0.0.0'
  },
  optimizeDeps: {
    include: ['@tachui/core', '@tachui/symbols'],
    exclude: []
  }
})