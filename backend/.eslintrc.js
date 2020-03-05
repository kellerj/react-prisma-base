module.exports = {
  plugins: ['sonarjs'],
  extends: ['airbnb-base', 'plugin:sonarjs/recommended'],
  rules: {
    'semi': ['error', 'always'],
    'no-console': 'error',
    'spaced-comment': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': ['error', {
      'props': false
    }],
    'no-plusplus': ['error', {
      'allowForLoopAfterthoughts': true
    }],
    'no-unused-vars': [ 'error', {
      vars: 'all',
      args: 'after-used',
      argsIgnorePattern: 'called|data|loading|error',
    }],
    'max-len': ['warn', 100, 2, {
      ignoreUrls: true,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreTrailingComments: true,
    }],
  },
  env: {
    node: true,
    // mocha: true,
  }
}
