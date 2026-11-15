import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import paths from './src/constants/paths.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      ...paths.reduce((acc, cur) => ({
        ...acc,
        [cur]: `/${cur == "src" ? cur : `src/${cur}`}`,
      }), "")
    }
  }
})
