module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  overrides: [
    {
      // V1 files must only import from V1 (or version-agnostic shared code).
      files: ['src/**/v1/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: [
                  'src/**/v2/**',
                  '**/v2/**',
                  'src/**/v3/**',
                  '**/v3/**',
                  'src/commons/!(v1)/**',
                  'src/applications/!(v1)/**',
                ],
                message:
                  'V1 files must only import from src/commons/v1/** and src/applications/v1/** (or version-agnostic shared modules).',
              },
            ],
          },
        ],
      },
    },
    {
      // V2 files must only import from V2 (or version-agnostic shared code).
      files: ['src/**/v2/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: [
                  'src/**/v1/**',
                  '**/v1/**',
                  'src/**/v3/**',
                  '**/v3/**',
                  'src/commons/!(v2)/**',
                  'src/applications/!(v2)/**',
                ],
                message:
                  'V2 files must only import from src/commons/v2/** and src/applications/v2/** (or version-agnostic shared modules).',
              },
            ],
          },
        ],
      },
    },
    {
      // V3 files must only import from V3 (or version-agnostic shared code).
      files: ['src/**/v3/**/*.ts'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: [
                  'src/**/v1/**',
                  '**/v1/**',
                  'src/**/v2/**',
                  '**/v2/**',
                  'src/commons/!(v3)/**',
                  'src/applications/!(v3)/**',
                ],
                message:
                  'V3 files must only import from src/commons/v3/** and src/applications/v3/** (or version-agnostic shared modules).',
              },
            ],
          },
        ],
      },
    },
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    'eol-last': ['error', 'always'],
  },
};
