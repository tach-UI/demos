import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    // Keep linked workspace packages resolved through local node_modules.
    preserveSymlinks: true,
    alias: [
      // Force a single registry singleton across linked package symlink paths.
      {
        find: '@tachui/registry',
        replacement: resolve(__dirname, '../../packages/registry/src/index.ts')
      }
    ]
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
          // Bundle tachui core optimally
          if (id.includes('@tachui/core')) {
            return 'tachui'
          }
        }
      },
      treeshake: {
        // Aggressive tree shaking but preserve side effects carefully
        moduleSideEffects: (id) => {
          // Preserve side effects for asset registration
          if (id?.includes('assets')) return true
          return false
        },
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
        unknownGlobalSideEffects: false
      },
      external: (id) => {
        // Don't bundle Node.js built-ins
        return ['path', 'fs', 'crypto', 'util'].includes(id)
      }
    },
    // Generate stats for bundle analysis
    reportCompressedSize: true
  },
  server: {
    port: 3001,
    host: '0.0.0.0'
  },
  preview: {
    port: 3001,
    host: '0.0.0.0'
  },
  optimizeDeps: {
    // Linked local tachUI packages contain ESM/CJS interop that esbuild prebundle
    // can mis-resolve in dev mode. Let Vite load them directly instead.
    include: [],
    exclude: [
      '@tachui/core',
      '@tachui/data',
      '@tachui/modifiers',
      '@tachui/primitives',
      '@tachui/flow-control'
    ]
  }
})
