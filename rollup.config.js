import ts2 from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import scss from 'rollup-plugin-scss';
import dts from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';
import pkg from './package.json';

export default [
  {
    input: './src/index.tsx',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        exports: 'named',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      scss({
        include: ['src/**/*.css', 'src/**/*.scss', 'src/**/*.sass'],
        output: 'dist/style.css',
        failOnError: true,
        outputStyle: 'compressed',
      }),
      ts2({ tsconfig: './tsconfig.json', useTsconfigDeclarationDir: true }),
      external(),
      terser(),
    ],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: pkg.types, format: 'esm' }],
    external: [/\.scss$/],
    plugins: [dts(), del({ hook: 'buildEnd', targets: 'dist/types' })],
  },
];
