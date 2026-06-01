const js = require('@eslint/js');
const vue = require('eslint-plugin-vue');

const browserGlobals = {
  Autodesk: 'readonly',
  DataTransfer: 'readonly',
  File: 'readonly',
  FormData: 'readonly',
  URL: 'readonly',
  clearInterval: 'readonly',
  clearTimeout: 'readonly',
  console: 'readonly',
  document: 'readonly',
  fetch: 'readonly',
  localStorage: 'readonly',
  setInterval: 'readonly',
  setTimeout: 'readonly',
  window: 'readonly',
  alert: 'readonly',
};

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**', 'src/js/**'],
  },
  js.configs.recommended,
  ...vue.configs['flat/essential'],
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: browserGlobals,
    },
    rules: {
      'no-useless-assignment': 'off',
      'no-unsafe-finally': 'off',
      'no-unused-vars': ['error', {args: 'none'}],
      'vue/multi-word-component-names': 'off',
      'vue/no-reserved-component-names': 'off',
    },
  },
  {
    files: ['eslint.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
  },
];
