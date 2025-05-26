/* eslint-disable max-lines */

import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import cypress from 'eslint-plugin-cypress';
import _import from 'eslint-plugin-import';
import mocha from 'eslint-plugin-mocha';
import react from 'eslint-plugin-react';
import { configs as reactHooksConfigs } from 'eslint-plugin-react-hooks';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// eslint-disable-next-line no-restricted-exports
export default defineConfig([
  globalIgnores([
    '**/bin/*.js',
    '**/build/**/*',
    '**/coverage/**/*',
    '**/dist/**/*',
    '**/node_modules/**/*',
    '**/*.d.ts',
    '**/.eslintrc.js',
    '**/babel.config.js',
    '**/bump-version.js',
    '**/jest.config.js',
    '**/jest.setup.js',
    'packages/scrabble-solver/next.config.js',
    'packages/logger/scripts/stats.js',
    'packages/scrabble-solver/public/service-worker.js',
  ]),
  reactHooksConfigs['recommended-latest'],
  {
    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended-type-checked',
      'prettier',
      'plugin:cypress/recommended',
    ),

    plugins: {
      '@typescript-eslint': typescriptEslint,
      react,
      import: fixupPluginRules(_import),
      cypress,
      mocha,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
        ...globals.jquery,
        RequestInfo: true,
        RequestInit: true,
        ServiceWorkerGlobalScope: true,
        beforeAll: true,
        cy: true,
        define: true,
        describe: true,
        expect: true,
        globalThis: true,
        it: true,
        jest: true,
      },

      ecmaVersion: 6,
      sourceType: 'commonjs',

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          impliedStrict: true,
          jsx: true,
        },
      },
    },

    ignores: [
      '**/.next/**',
      '**/bin/*.js',
      '**/build/**/*',
      '**/coverage/**/*',
      '**/dist/**/*',
      '**/node_modules/**/*',
      '*.d.ts',
      '.eslintrc.js',
      'babel.config.js',
      'bump-version.js',
      'jest.config.js',
      'jest.setup.js',
      'packages/scrabble-solver/next.config.js',
      'packages/logger/scripts/stats.js',
      'packages/scrabble-solver/public/service-worker.js',
    ],

    settings: {
      react: {
        version: '19',
      },

      'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
      'import/external-module-folders': ['node_modules'],
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: 'packages/scrabble-solver/tsconfig.json',
        },
      },
    },

    rules: {
      'import/default': 'error',
      'import/newline-after-import': 'error',
      'import/no-absolute-path': 'error',
      'import/no-cycle': 'error',
      'import/no-dynamic-require': 'error',
      'import/no-unresolved': [
        'error',
        {
          ignore: ['^styles/.*\\.scss'],
        },
      ],
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },

          groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],

      'comma-dangle': ['error', 'always-multiline'],
      'no-cond-assign': 'error',
      'no-console': 'warn',
      'no-constant-condition': 'error',
      'no-control-regex': 'error',
      'no-debugger': 'warn',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-empty-character-class': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-parens': 'off',
      'no-extra-semi': 'error',
      'no-func-assign': 'error',
      'no-inner-declarations': 'error',
      'no-invalid-regexp': 'error',

      'no-irregular-whitespace': [
        'error',
        {
          skipStrings: true,
          skipTemplates: true,
        },
      ],

      'no-negated-in-lhs': 'error',
      'no-obj-calls': 'error',
      'no-regex-spaces': 'error',
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'off',
      'no-unexpected-multiline': 'error',
      'no-unreachable': 'error',
      'no-unsafe-finally': 'error',
      'use-isnan': 'error',
      'valid-jsdoc': 'off',
      'valid-typeof': 'error',
      'accessor-pairs': 'error',
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      complexity: 'off',
      'consistent-return': 'error',
      curly: ['error', 'all'],
      'default-case': 'error',
      'dot-location': ['error', 'property'],
      'dot-notation': 'error',
      eqeqeq: 'error',
      'guard-for-in': 'error',
      'no-alert': 'error',
      'no-caller': 'error',
      'no-case-declarations': 'error',
      'no-div-regex': 'error',
      'no-else-return': 'error',
      'no-empty-function': 'error',
      'no-empty-pattern': 'error',
      'no-eq-null': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-label': 'error',
      'no-fallthrough': 'error',
      'no-floating-decimal': 'error',
      'no-implicit-coercion': 'error',
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      'no-invalid-this': 'off',
      'no-iterator': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',

      'no-magic-numbers': [
        'off',
        {
          enforceConst: true,
          detectObjects: true,
        },
      ],

      'no-multi-spaces': 'error',
      'no-multi-str': 'error',
      'no-native-reassign': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': 'error',
      'no-proto': 'error',
      'no-redeclare': [
        'error',
        {
          builtinGlobals: false,
        },
      ],
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-self-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'off',
      'no-unmodified-loop-condition': 'error',
      'no-unused-expressions': 'error',
      'no-unused-labels': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
      'no-void': 'error',
      'no-warning-comments': 'warn',
      'no-with': 'error',
      radix: 'error',
      'vars-on-top': 'error',
      'wrap-iife': 'error',
      yoda: ['error', 'never'],
      strict: ['error', 'never'],
      'init-declarations': ['off', 'always'],
      'no-catch-shadow': 'error',
      'no-delete-var': 'error',
      'no-label-var': 'error',
      'no-restricted-globals': 'error',
      'no-shadow': 'error',
      'no-shadow-restricted-names': 'error',
      'no-undef': 'error',
      'no-undef-init': 'error',
      'no-undefined': 'off',
      'no-unused-vars': 'error',
      'no-use-before-define': 'off',
      'callback-return': 'off',
      'global-require': 'off',
      'handle-callback-err': 'off',
      'no-mixed-requires': 'off',
      'no-new-require': 'off',
      'no-path-concat': 'off',
      'no-process-env': 'off',
      'no-process-exit': 'error',
      'no-restricted-modules': 'off',
      'no-sync': 'off',
      'array-bracket-spacing': ['error', 'never'],
      'block-spacing': ['error', 'always'],
      'brace-style': ['error', '1tbs'],

      camelcase: [
        'error',
        {
          properties: 'always',
        },
      ],

      'comma-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],

      'comma-style': ['error', 'last'],
      'computed-property-spacing': ['error', 'never'],
      'consistent-this': ['error', 'this'],
      'eol-last': 'error',
      'func-style': 'off',
      'id-blacklist': 'off',

      'id-length': [
        'off',
        {
          min: 3,
          exceptions: ['_', 'id', 'to', 'x', 'y'],
        },
      ],

      'id-match': 'off',
      indent: ['error', 2],
      'jsx-quotes': ['error', 'prefer-double'],

      'key-spacing': [
        'error',
        {
          beforeColon: false,
          afterColon: true,
          mode: 'strict',
        },
      ],

      'keyword-spacing': [
        'error',
        {
          before: true,
          after: true,
        },
      ],

      'linebreak-style': ['error', 'unix'],
      'lines-around-comment': 'off',
      'max-depth': ['error', 4],
      'max-len': ['error', 120],
      'max-lines': ['warn', 200],
      'max-nested-callbacks': ['error', 4],
      'max-params': ['error', 4],
      'max-statements': ['warn', 20],

      'max-statements-per-line': [
        'error',
        {
          max: 1,
        },
      ],

      'new-cap': [
        'error',
        {
          newIsCap: true,
          capIsNew: false,
          properties: true,
        },
      ],

      'new-parens': 'error',
      'newline-after-var': 'off',
      'newline-before-return': 'off',
      'newline-per-chained-call': 'off',
      'no-array-constructor': 'error',
      'no-bitwise': 'error',
      'no-continue': 'off',
      'no-inline-comments': 'off',
      'no-lonely-if': 'error',
      'no-mixed-operators': 'off',
      'no-mixed-spaces-and-tabs': 'error',
      'no-multiple-empty-lines': 'error',
      'no-negated-condition': 'error',
      'no-nested-ternary': 'error',
      'no-new-object': 'error',
      'no-plusplus': 'off',
      'no-restricted-syntax': ['error', 'WithStatement'],
      'no-restricted-exports': [
        'error',
        {
          restrictDefaultExports: {
            direct: true,
            named: true,
            defaultFrom: true,
            namedFrom: true,
            namespaceFrom: true,
          },
        },
      ],
      'no-spaced-func': 'off',
      'func-call-spacing': ['error', 'never'],
      'no-ternary': 'off',
      'no-trailing-spaces': 'error',

      'no-underscore-dangle': [
        'error',
        {
          allow: ['_', '__dirname', '__filename'],
        },
      ],

      'no-unneeded-ternary': 'error',
      'no-whitespace-before-property': 'error',
      'object-curly-newline': 'off',
      'object-curly-spacing': ['error', 'always'],

      'object-property-newline': [
        'error',
        {
          allowMultiplePropertiesPerLine: true,
        },
      ],

      'one-var': ['error', 'never'],
      'one-var-declaration-per-line': ['error', 'always'],
      'operator-assignment': ['error', 'always'],

      'operator-linebreak': [
        'off',
        'none',
        {
          overrides: {
            '?': 'before',
            ':': 'before',
          },
        },
      ],

      'padded-blocks': ['error', 'never'],
      'quote-props': ['error', 'as-needed'],

      quotes: [
        'error',
        'single',
        {
          allowTemplateLiterals: true,
          avoidEscape: true,
        },
      ],

      'require-jsdoc': 'off',
      semi: ['error', 'always'],

      'semi-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],

      'sort-vars': 'error',
      'space-before-blocks': ['error', 'always'],

      'space-before-function-paren': [
        'error',
        {
          anonymous: 'never',
          named: 'never',
          asyncArrow: 'always',
        },
      ],

      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'spaced-comment': 'off',
      'unicode-bom': ['error', 'never'],
      'wrap-regex': 'off',
      'arrow-body-style': 'off',
      'arrow-parens': ['error', 'always'],

      'arrow-spacing': [
        'error',
        {
          before: true,
          after: true,
        },
      ],

      'constructor-super': 'error',

      'generator-star-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],

      'no-class-assign': 'error',
      'no-confusing-arrow': 'off',
      'no-const-assign': 'error',
      'no-dupe-class-members': 'error',
      'no-duplicate-imports': 'error',
      'no-new-symbol': 'error',
      'no-restricted-imports': 'off',
      'no-this-before-super': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': 'error',
      'no-var': 'error',

      'object-shorthand': [
        'error',
        'always',
        {
          avoidQuotes: true,
        },
      ],

      'prefer-arrow-callback': [
        'error',
        {
          allowNamedFunctions: true,
        },
      ],
      'prefer-const': 'error',
      'prefer-reflect': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'require-yield': 'error',
      'rest-spread-spacing': ['error', 'never'],
      'sort-imports': 'off',
      'template-curly-spacing': ['error', 'never'],

      'yield-star-spacing': [
        'error',
        {
          before: false,
          after: true,
        },
      ],

      'react/display-name': 'off',

      'react/forbid-prop-types': [
        'off',
        {
          forbid: ['any'],
        },
      ],

      'react/jsx-no-comment-textnodes': 'error',
      'react/no-danger': 'error',
      'react/no-deprecated': 'error',
      'react/no-did-mount-set-state': 'error',
      'react/no-did-update-set-state': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-is-mounted': 'error',

      'react/no-multi-comp': [
        'error',
        {
          ignoreStateless: true,
        },
      ],

      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-unknown-property': 'error',
      'react/prefer-es6-class': 'error',
      'react/prop-types': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/require-render-return': 'error',
      'react/self-closing-comp': 'error',

      'react/sort-comp': [
        'error',
        {
          order: [
            'static-methods',
            'instance-variables',
            'lifecycle',
            '/^on.+$/',
            'everything-else',
            'render',
            '/^render.+/',
          ],
        },
      ],

      'react/sort-prop-types': [
        'error',
        {
          ignoreCase: true,
          callbacksLast: true,
        },
      ],

      'react/no-unused-prop-types': 'error',
      'react/jsx-wrap-multilines': 'error',
      'react/jsx-boolean-value': ['error', 'never'],

      'react/jsx-closing-bracket-location': [
        'error',
        {
          nonEmpty: 'tag-aligned',
          selfClosing: 'tag-aligned',
        },
      ],

      'react/jsx-curly-spacing': ['error', 'never'],
      'react/jsx-equals-spacing': ['error', 'never'],

      'react/jsx-filename-extension': [
        'error',
        {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],

      'react/jsx-first-prop-new-line': ['error', 'multiline'],

      'react/jsx-handler-names': [
        'error',
        {
          eventHandlerPrefix: 'on',
          eventHandlerPropPrefix: 'on',
        },
      ],

      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-key': 'error',
      'react/jsx-max-props-per-line': 'off',
      'react/jsx-no-bind': 'off',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-literals': 'off',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-pascal-case': 'error',
      'react/jsx-sort-props': 'off',

      'react/jsx-tag-spacing': [
        'error',
        {
          closingSlash: 'never',
          beforeSelfClosing: 'always',
          afterOpening: 'never',
          beforeClosing: 'never',
        },
      ],

      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-skipped-tests': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      'no-unused-vars': 'off',
      'no-shadow': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off', // incompatible with next-image typing for *.svg files
      '@typescript-eslint/no-unsafe-return': 'off', // gives false positives
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],

    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    files: ['**/*.spec.cy.ts'],

    rules: {
      'max-statements': 'off',
    },
  },
  {
    files: ['packages/scrabble-solver/src/pages/**'],

    rules: {
      'no-restricted-exports': 'off',
    },
  },
]);
