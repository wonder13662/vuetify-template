const { resolve } = require('path');

module.exports = {
  // https://github.com/vuejs/vue-cli/blob/v4.5.12/packages/%40vue/cli-plugin-unit-jest/presets/default/jest-preset.js
  preset: '@vue/cli-plugin-unit-jest',
  setupFilesAfterEnv: [
    resolve(__dirname, './tests/jest.setup.js'),
  ],
  transform: {
    // process *.gql files
    '\\.(gql|graphql)$': 'jest-transform-graphql',
  },
};
