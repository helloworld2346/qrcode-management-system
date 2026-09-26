/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: [
    "dist",
    "vite.config.js",
    "vite.config.d.ts",
    "*.tsbuildinfo",
  ],
  env: { browser: true, es2021: true, node: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
  settings: {
    "import/resolver": {
      typescript: { project: "./tsconfig.json" },
      node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    },
  },
  plugins: ["@typescript-eslint", "react-hooks", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling", "index"],
        ],
        pathGroups: [{ pattern: "@/**", group: "internal", position: "after" }],
        pathGroupsExcludedImportTypes: ["builtin"],
        "newlines-between": "always",
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
    "import/prefer-default-export": "off",
    "import/no-default-export": "error",
    "no-console": "error",
  },
  overrides: [
    {
      files: [
        "src/**/pages/**/*.tsx",
        "src/**/*Page.tsx",
        "*.config.ts",
        "*.config.js",
        "vite.config.ts",
        "tailwind.config.js",
        "postcss.config.js",
      ],
      rules: { "import/no-default-export": "off" },
    },
    {
      files: ["*.cjs", "*.js", "*.config.js", "*.config.ts", "vite.config.ts"],
      parserOptions: { project: null },
      rules: { "import/no-default-export": "off", "no-console": "off" },
    },
  ],
};
