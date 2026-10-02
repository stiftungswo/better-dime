// Component tests run on a modern Jest + SWC, independent of the (old) react-scripts-ts build toolchain.
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.{ts,tsx}'],
  // sources import from 'src/...' (tsconfig baseUrl)
  modulePaths: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|svg|png|jpe?g|gif)$': '<rootDir>/src/testUtils/fileMock.ts',
  },
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true, decorators: true },
          transform: { legacyDecorator: true, decoratorMetadata: true, react: { runtime: 'classic' } },
          target: 'es2019',
        },
      },
    ],
  },
};
