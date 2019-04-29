module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  plugins: ['react', 'react-hooks', 'jsx-a11y'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
  },
};
