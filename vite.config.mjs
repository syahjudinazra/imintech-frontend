import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(({ mode }) => {
  // Load .env
  const env = loadEnv(mode, process.cwd(), '')
  process.env = { ...process.env, ...env }

  return {
    plugins: [vue()],
    base: '/',
    css: {
      postcss: {
        plugins: [autoprefixer({})],
      },
    },
    resolve: {
      alias: [
        {
          find: /^~(.*)$/,
          replacement: '$1',
        },
        {
          find: '@/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, '/src'),
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.scss'],
    },
    server: {
      port: 3000,
      proxy: {
        // your proxy config
      },
      // Add headers for development
      headers: {
        'Content-Type': 'application/javascript',
      },
    },
    define: {
      'process.env': process.env,
    },
    optimizeDeps: {
      include: ['vue', 'vue-router'],
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/],
      },
      // Add these build configurations
      outDir: 'dist',
      assetsDir: 'assets',
      manifest: true,
      modulePreload: {
        polyfill: true,
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue', 'vue-router', 'vuex'],
            vendor: ['lodash', 'axios'],
          },
          // Add proper file naming
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
      // Add chunk size warning limit
      chunkSizeWarningLimit: 1000,
    },
    esbuild: {
      drop: ['console', 'debugger'],
    },
  }
})
