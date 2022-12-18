const config = {
    verbose: true,
    collectCoverageFrom: [
        "modules/**/*.{test.js,js}",
        "!**/devonly_*.{test.js,js}",
        "!**/node_modules/**",
        "!**/vendor/**",
        "!**/opt/**",
        "!**/**/devonly_*.{test.js,js}"
    ],
    collectCoverage: true,
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    coverageDirectory: './coverage'
  };
  
  module.exports = config;
  