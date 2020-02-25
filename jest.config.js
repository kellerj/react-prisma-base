module.exports = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/coverage',
  ],
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '.*': 'babel-jest',
    '^.+\\.js?$': 'babel-jest'
  },
  roots: [
    '<rootDir>/pages', '<rootDir>/lib', '<rootDir>/components',
  ],
  projects: [
    {
      displayName: 'test',
    }, {
      displayName: 'lint',
      runner: 'jest-runner-eslint',
      testMatch: ['<rootDir>/**/*.js'],
    },
  ],
  verbose: true,
  collectCoverage: false,
  testEnvironment: 'node',
  testResultsProcessor: 'jest-bamboo-reporter',
  coverageReporters: ['lcov', 'text-summary', 'text', 'html'],
};
