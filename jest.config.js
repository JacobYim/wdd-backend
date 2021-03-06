module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverage: true,
  collectCoverageFrom: ['**/{lib,middleware,models,routes}/*.{ts,js}'],
  globalSetup: '<rootDir>/src/__tests__/drop-database.ts',
  transform: {
    '\\.ts$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageReporters: ['text', 'text-summary'],
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testPathIgnorePatterns: [
    'api-helper.ts',
    'drop-database.ts',
    '/node_modules/',
    '/@types/',
    '/build/',
    '/coverage/',
  ],
};
