module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coverageReporters: ["lcov"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  testEnvironment: "jest-environment-jsdom-fifteen",
  testMatch: ["**/*.test.(ts|tsx)"],
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest"
  }
};
