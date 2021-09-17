import { terser } from "rollup-plugin-terser";

const pkg = require('./package.json')

export default {
  input: 'src/main.js',
  output: [
    {
      name: 'Jaxo',
      file: pkg.main,
      format: 'umd',
      sourcemap: false
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: false
    }
  ],
  plugins: [
    process.env.NODE_ENV === 'production' ? terser() : ''
  ]
};
