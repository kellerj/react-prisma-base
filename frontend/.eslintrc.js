module.exports = {
  extends: 'airbnb/hooks',
  plugins: [ 'import', 'react', 'react-hooks', 'jsx-a11y' ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    ecmaFeatures: {
      jsx: true,
    }
  },
  rules: {
    'semi': ['error', 'always'],
    'no-console': 'off',
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
      argsIgnorePattern: 'called|data',
    }],
    'max-len': ['warn', 100, 2, {
      ignoreUrls: true,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreTrailingComments: true,
    }],
    'jsx-a11y/anchor-is-valid': 'off',
    'react/jsx-uses-react' : 'error',
    'react/jsx-uses-vars' : 'error',
    'react/jsx-indent': ['warn', 2],
    'react/jsx-indent-props': ['warn', 2],
    'react/jsx-no-literals': 'off',
    'react/jsx-child-element-spacing': 'off',
    'react/forbid-prop-types': 'off',
    'class-methods-use-this': ['warn', { exceptMethods: [ 'render', 'shouldComponentUpdate' ] } ],
    'react/no-set-state': 'off',
    'react/destructuring-assignment': 'off',
    'react/no-access-state-in-setstate': 'off',
    'react/jsx-handler-names': 'off',
    'react/jsx-max-props-per-line': ['warn', { 'maximum': 2, 'when': 'always' }],
    'react/jsx-one-expression-per-line': 'off',
    'react/forbid-component-props': 'off',
    'react/jsx-max-depth': [ 'warn', { max: 4 }],
    'react/prefer-stateless-function': 'off',
  },
  env: {
    node: true,
    mocha: true,
    browser: true,
  }
}
