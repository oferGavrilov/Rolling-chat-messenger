import type { Config } from '@jest/types'
import { defaults } from 'jest-config'

const config: Config.InitialOptions = {
  ...defaults,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['./jest.setup.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/mocks/cssMock.js',
  },
}

export default config