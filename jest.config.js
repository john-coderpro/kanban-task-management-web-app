module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(jsx|js)', '**/?(*.)+(spec|test).+(js|jsx)'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  testEnvironment: 'jsdom',
  // the following option ensures that code from nanoid is transformed
  // by jest to avoid errors with ES6 import statement
  // here is the link to the jest documentation for configuration options
  // in case I forget something https://jestjs.io/docs/configuration
  
  transformIgnorePatterns: ['node_modules/(.?!nanoid.+)'],
}
