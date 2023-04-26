import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            include: '**/*.tsx',
        }),
        svgr(),
    ],
    build: {
        target: 'es2020',
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'es2020',
            define: {
                global: 'globalThis',
            },
        },
    },
    resolve: {
        alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
    },
})
