module.exports = {
    env: {
      browser: true,
      es2021: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
    ],
    overrides: [
      {
        env: {
          node: true,
        },
        files: ['.eslintrc.js', '.eslintrc.cjs'],
        parserOptions: {
          sourceType: 'script',
        },
      },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      tsconfigRootDir: __dirname,
      project: './tsconfig.json',
    },
    plugins: ['react', '@typescript-eslint'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    },
  };
  