module.exports = [
  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parser: require("@typescript-eslint/parser"),
      globals: {
        browser: true,
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      "prettier": require("eslint-plugin-prettier"),
    },
    rules: {
      "prettier/prettier": "error",
      // Add your custom ESLint rules here
    },
    settings: {
      // Add your custom settings here if needed
    },
  },
  {
    files: ["*.ts", "*.tsx"],
    rules: {
      // Add TypeScript-specific rules here
    },
  },
];
