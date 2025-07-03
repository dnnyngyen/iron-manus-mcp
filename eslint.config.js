import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescript
    },
    rules: {
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'off',
      'no-console': 'warn',
      'no-undef': 'off',
      'no-redeclare': 'off',
      'no-useless-escape': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': 'error'
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '__tests__/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '*.js',
      '*.mjs'
    ]
  }
];