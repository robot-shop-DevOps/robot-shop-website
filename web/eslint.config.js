export default [
  {
    files: ["**/*.js"],

    languageOptions: {
      ecmaVersion: 12,
      sourceType: "script",
      globals: {
        angular: "readonly",
        browser: true,
        es2021: true,
      }
    },

    extends: ["eslint:recommended"],

    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": "off",
      "no-var": "off",
      "no-extra-semi": "warn",
      "eqeqeq": "warn",
      "curly": "warn",
      "no-empty": "warn"
    }
  }
];