module.exports = {
    collectCoverage: true,
    coverageReporters: ['lcov'],
    collectCoverageFrom: [
        '**/*.{js,jsx,ts}',
        '!**./node_modules/**',
        '!**./dist/**',
        '!**./test/**',
        '!**/vendor/**',
    ],
    coverageDirectory: '../tests/coverage',
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\](?!lodash-es/).+\\.js$',
    ],
    reporters: [
        'default',
        [
            './node_modules/jest-html-reporter',
            {
                pageTitle: 'Console Access Library Test Report',
                outputPath: '../tests/reports/report.html',
                includeFailureMsg: false,
            },
        ],
    ],
};
