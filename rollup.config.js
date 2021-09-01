import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/main.js',
  output: [
    {
      name: 'Jaxo',
      file: 'build/index.js',
      format: 'umd'
    },
    {
      file: 'build/index.esm.js',
      format: 'esm'
    }
  ],
  plugins: [terser()]
};
