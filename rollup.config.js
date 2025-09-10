import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),

    resolve({ extensions }),

    commonjs(),

    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      exclude: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    }),

    babel({
      babelHelpers: 'bundled',
      extensions,
      exclude: /node_modules/,
      presets: ['@babel/preset-env', '@babel/preset-react'],
    }),

    postcss({
      plugins: [autoprefixer()],
      extensions: ['.css', '.scss'],
      minimize: true,
      inject: true,
      use: {
        sass: {
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    }),

    terser(),

    replace({
      preventAssignment: true,
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    }),
  ],
  external: ['react', 'react-dom'],
};
