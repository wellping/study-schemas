/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testMatch: ["**/src/__tests__/**/*.(spec|test).[jt]s?(x)"],
  setupFiles: ["<rootDir>/src/__tests__/setupGlobalVariables.js"],
};
