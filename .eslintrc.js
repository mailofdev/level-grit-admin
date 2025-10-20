module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'prettier'
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'react/prop-types': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'no-debugger': 'warn',
    'no-alert': 'warn',
    'no-duplicate-imports': 'error',
    'no-unused-expressions': 'warn',
    'react/jsx-no-bind': 'warn',
    'react/jsx-key': 'error'
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
