/** @type {import('jest').Config} */
const config = {
  projects: [
    {
      displayName: 'unit',
      testMatch: ['**/tests/unit/**/*.test.js'],
    },
    {
      displayName: 'integration',
      testMatch: ['**/tests/integration/**/*.test.js'],
    },
    {
      displayName: 'e2e',
      testMatch: ['**/tests/e2e/**/*.test.js'],
      setupFilesAfterEnv: ['./tests/e2e/setup.js']
    },
  ],
  
  testEnvironment: 'node',
  verbose: true
};

module.exports = config;