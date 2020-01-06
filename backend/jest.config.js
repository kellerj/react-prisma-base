module.exports = {
  //setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: [
    '<rootDir>/database/',
    '<rootDir>/doc/',
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
  ],
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '.*': 'babel-jest',
    '^.+\\.js?$': 'babel-jest',
  },
  roots: [
    '<rootDir>/src',
    '<rootDir>/test',
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
  collectCoverage: true,
  testEnvironment: 'node',
  coverageReporters: ['lcov', 'text-summary', 'text', 'html'],
  testResultsProcessor: 'jest-bamboo-reporter',
  coveragePathIgnorePatterns: [
    '<rootDir>/coverage', '<rootDir>/.next', '<rootDir>/node_modules',
  ],
};
