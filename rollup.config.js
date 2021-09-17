import { terser } from "rollup-plugin-terser";

const pkg = require('./package.json')
const banner = `/*! Jaxo - v${pkg.version} | Copyright 2021 - Haikel Fazzani */\n`;

export default {
  input: 'src/main.js',
  output: [
    {
      name: 'Jaxo',
      file: pkg.main,
      format: 'umd',
      sourcemap: !process.env.NODE_ENV.includes('production'),
      banner
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: !process.env.NODE_ENV.includes('production')
    }
  ],
  plugins: [
    process.env.NODE_ENV.includes('production') ? terser() : ''
  ]
};
