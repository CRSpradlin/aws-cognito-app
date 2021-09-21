const config = {
    verbose: true,
    collectCoverageFrom: [
        "modules/**/*.{test.js,js}",
        "!**/node_modules/**",
        "!**/vendor/**",
        "!**/opt/**"
    ],
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
    coverageDirectory: './coverage'
  };
  
  module.exports = config;
  