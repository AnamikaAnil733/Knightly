// eslint.config.js  (must be js, not json)

import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    files: ["src/**/*.ts"],
    ignores: ["dist", "node_modules"],
    ...js.configs.recommended,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin
    },
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "no-debugger": "error",
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
      "no-duplicate-imports": "error",
      "arrow-body-style": ["error", "as-needed"],
      "prefer-arrow-callback": "error",
      "object-shorthand": ["error", "always"],
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
      quotes: ["error", "double", { avoidEscape: true }],
      semi: ["error", "always"],
      indent: ["error", 2, { SwitchCase: 1 }],
      "comma-dangle": ["error", "always-multiline"],


      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off"
    }
  }
];
