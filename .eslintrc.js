module.exports = {
    env: {
        es6: true,
        node: true,
        jest: true,
    },
    extends: [
        'airbnb-base',
        'plugin:jest/recommended',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        module: 'readonly',
        process: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules: {
        'class-methods-use-this': 'off',
        'no-underscore-dangle': 'off',
        'no-unused-vars': [
            'error', { ignoreRestSiblings: true, argsIgnorePattern: '^_' },
        ],
        'import/prefer-default-export': 'off',
    },
    plugins: [
        'jest',
    ],
};