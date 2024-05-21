module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  setupFiles: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!**/node_modules/**'],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1" // Adjust this based on your directory structure
  }
}
