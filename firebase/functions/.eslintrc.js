module.exports = {
  root: true,
  env: {
    es2017: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  parser: "@babel/eslint-parser",
  rules: {
    "quotes": ["error", "double"],
    "max-len": [2, 200, 4],
  },
};
