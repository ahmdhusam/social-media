module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prettier/prettier': 'error',
    'no-console': 'warn',
    'no-magic-numbers': 'warn',
    'no-param-reassign': 'warn',
    'no-return-await': 'error',
    'prefer-destructuring': 'error',
    yoda: 'error',
    'use-isnan': 'error',
    'valid-typeof': 'error',
    'no-empty': 'error',
    'prefer-object-has-own': 'error',
    'lines-between-class-members': 'warn',
    'spaced-comment': 'warn',
    'capitalized-comments': 'warn',
    'multiline-comment-style': 'warn',
    'no-inline-comments': 'warn'
  }
};
