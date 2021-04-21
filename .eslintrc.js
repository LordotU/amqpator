module.exports = {
  extends: 'airbnb-base',
  globals: {
    global: true,
    console: true,
    window: true,
    require: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'arrow-parens': [
      'error',
      'as-needed',
    ],
    camelcase: 0,
    'guard-for-in': 0,
    'import/extensions': 0,
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'import/no-unresolved': 0,
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
      },
    ],
    'import/prefer-default-export': 0,
    'linebreak-style': [
      'error',
      'unix',
    ],
    'max-len': [
      'error',
      {
        code: 120,
      },
    ],
    'no-await-in-loop': 0,
    'no-console': 0,
    'no-extra-boolean-cast': 0,
    'no-mixed-operators': 0,
    'no-multiple-empty-lines': ['error', {
      max: 2,
    }],
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'no-template-curly-in-string': 0,
    'no-useless-escape': 0,
    'no-underscore-dangle': 0,
    'operator-linebreak': ['error', 'after', {
      overrides: {
        '?': 'ignore',
        ':': 'ignore',
      },
    }],
    'padded-blocks': 0,
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'never',
    ],
    'space-before-function-paren': [
      'error',
      'always',
    ],
    'space-unary-ops': [
      'error',
      {
        overrides: {
          '!': true,
        },
      },
    ],
    '@typescript-eslint/member-ordering': 'error',
  },
}
