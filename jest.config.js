module.exports = {
  collectCoverage: true,
  coverageDirectory: '<rootDir>/__tests__/coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/__tests__/',
  ],
  coverageReporters: [
    'json',
    'lcov',
    'text',
    'html',
  ],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/__tests__/coverage/',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  verbose: false,
}
