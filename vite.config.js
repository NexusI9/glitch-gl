// vite.config.js
import glsl from 'vite-plugin-glsl';
import path from 'path';

export default {
    root: 'src',
    publicDir: '../public',
    base: './',
    build: {
        minify: false,
        minifySyntax: false,
        outDir: '../dist',
        emptyOutDir: true,
        //remove hash
        rollupOptions: {
            input:{
                index:'src/index.js',
                'lib/glitchgl':'src/lib/glitchgl.js'
            },
            output:{
                entryFileNames: '[name].js'
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@styles': path.resolve(__dirname, './src/styles'),
            '@lib': path.resolve(__dirname, './src/lib'),
        }
    },
    plugins: [glsl()]
}