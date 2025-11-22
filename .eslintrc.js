module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
    "react-native/react-native": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-native/all",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "react", "react-native"],
  rules: {
    // TypeScript
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],

    // React
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",

    // React Native
    "react-native/no-inline-styles": "warn",
    "react-native/no-color-literals": "warn",
    "react-native/no-raw-text": "off",

    // General
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      // Server-specific rules
      files: ["packages/server/**/*.ts"],
      env: {
        node: true,
        browser: false,
      },
      rules: {
        "react/react-in-jsx-scope": "off",
        "react-native/no-inline-styles": "off",
        "react-native/no-color-literals": "off",
      },
    },
    {
      // Test files
      files: ["**/*.test.ts", "**/*.test.tsx"],
      env: {
        jest: true,
      },
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
};
