module.exports = {
    testEnvironment: 'node',
    testPathIgnorePatterns: ['node_modules'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
    }
}