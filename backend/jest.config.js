export default {
  testEnvironment: "node",
  transform: {},
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",
    "!src/app.js",
    "!src/**/__tests__/**",
  ],
  coverageDirectory: "coverage",
  verbose: true,
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: false,
};
