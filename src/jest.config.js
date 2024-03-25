module.exports = {
    setupFilesAfterEnv: ['<rootDir>/path/to/setupTests.ts'], // Adjust the path as necessary
    testEnvironment: 'jsdom', // This is important for DOM manipulation
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest', // Transform TypeScript files
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  };
  