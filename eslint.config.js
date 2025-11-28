import { defineConfig } from 'eslint/config';
import jsPkg from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import * as globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

const jsConfigs = jsPkg.configs;

export default [
   // Ignorar archivos generados y dependencias
   {
      ignores: ['dist/**', 'node_modules/**', '**/*.d.ts', 'build/**', 'coverage/**'],
   },
   // Configuración para archivos JavaScript
   {
      files: ['**/*.{js,mjs,cjs}'],
      ...jsConfigs.recommended,
      languageOptions: {
         parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
         },
         globals: {
            ...globals.browser,
            ...globals.node,
         },
      },
      rules: {},
   },
   // Configuración para archivos TypeScript
   {
      files: ['**/*.{ts,mts,cts}'],
      languageOptions: {
         parser: tsParser,
         parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            project: './tsconfig.json',
         },
         globals: {
            ...globals.browser,
            ...globals.node,
         },
      },
      plugins: {
         '@typescript-eslint': tseslint,
         prettier: prettierPlugin,
      },
      rules: {
         // Reglas recomendadas de TypeScript
         ...tseslint.configs.recommended.rules,
         // Prettier como error
         'prettier/prettier': 'error',
         // Permitir parámetros no usados que empiecen con _
         '@typescript-eslint/no-unused-vars': [
            'error',
            {
               argsIgnorePattern: '^_',
               varsIgnorePattern: '^_',
            },
         ],
         '@typescript-eslint/no-explicit-any': 'off',
      },
   },
];
