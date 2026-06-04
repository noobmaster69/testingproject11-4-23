import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Unit Lab',
        short_name: 'UnitLab',
        description: 'Advanced unit conversion workspace',
        theme_color: '#0b3a42',
        background_color: '#0f1620',
        display: 'standalone',
        start_url: '/testingproject11-4-23/',
        icons: []
      }
    })
  ],
  base: command === 'build' ? '/testingproject11-4-23/' : '/',
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  }
}));
