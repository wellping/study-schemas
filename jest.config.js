/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/src/__tests__/**/*.(spec|test).[jt]s?(x)"],
  setupFiles: ["<rootDir>/src/__tests__/setupGlobalVariables.js"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "utility/**/*.{js,jsx,ts,tsx}",
    "!**/__tests__/**",
    "!**/node_modules/**",
  ],
};
