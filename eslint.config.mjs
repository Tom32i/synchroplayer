import js from '@eslint/js';
import json from '@eslint/json';
import stylistic from '@stylistic/eslint-plugin';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default [
    {
        files: ['src/**/*.js'],
        ...js.configs.recommended,
    },
    {
        files: ['src/**/*.js'],
        ...react.configs.flat.recommended,
    },
    {
        files: ['src/**/*.js'],
        ...react.configs.flat['jsx-runtime'],
    },
    {
        files: ['src/**/*.js'],
        plugins: { '@stylistic': stylistic },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: { ecmaFeatures: { jsx: true } },
            globals: {
                ...globals.browser,
                ...globals.node,
                YT: 'readonly',
            },
        },
        settings: { react: { version: 'detect' } },
        rules: {
            '@stylistic/indent': ['error', 4, { SwitchCase: 1, ignoredNodes: ['TemplateLiteral'] }],
            '@stylistic/template-curly-spacing': 'off',
            '@stylistic/linebreak-style': ['error', 'unix'],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/spaced-comment': ['error', 'always'],
            'no-unused-vars': ['warn', { caughtErrors: 'none' }],
            'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
            'no-inline-comments': 'warn',
        },
    },
    {
        files: ['src/**/*.json'],
        plugins: { json },
        language: 'json/json',
        ...json.configs.recommended,
    },
];
