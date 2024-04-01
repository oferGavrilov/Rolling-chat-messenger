import {defineConfig} from 'tsup'

export default defineConfig({
    entry: ['./src'],
    splitting: false,
    sourcemap: true,
    clean: true,
    format: ['esm'],
    outDir: 'build'
})
