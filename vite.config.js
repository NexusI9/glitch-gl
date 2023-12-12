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
                index:'src/index.html'
            },
            output:{
                entryFileNames: 'scripts/[name].js',
                chunkFileNames: 'scripts/vendor/[name].js',
                manualChunks:{
                    'glitchgl': [path.resolve(__dirname, '/vendor/glitchgl/index.js')],
                    'three':['three']
                }
            }
        }
    },
    optimizeDeps: {
        include: ['three'], 
      },
    resolve: {
        alias: {
            '@styles': path.resolve(__dirname, './src/styles'),
            '@lib': path.resolve(__dirname, './src/lib'),
            '@public': path.resolve(__dirname, './public'),
        }
    },
    plugins: [glsl()]
}