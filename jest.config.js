module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js'
    },
    testMatch: [
      "**/tests/**/*.test.js"
    ]
  };