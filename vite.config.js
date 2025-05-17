import path from 'path'
import {defineConfig} from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'lib/main.js'),
            name: 'js-spec',
            fileName: (format, entryName) => `${entryName}.${format}.js`
        }
    }
});