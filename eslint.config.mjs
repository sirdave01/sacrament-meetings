// Use ESLint's flat-config helpers to compose the project rules.
import { defineConfig, globalIgnores } from "eslint/config";
// Include Next.js rules for common web and framework-specific issues.
import nextVitals from "eslint-config-next/core-web-vitals";
// Include the framework's TypeScript-specific lint rules.
import nextTs from "eslint-config-next/typescript";

// Combine framework presets and explicit generated-output exclusions.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override the default ignore list so generated files are excluded explicitly.
  globalIgnores([
    // Next.js production build output.
    ".next/**",
    // Static export output.
    "out/**",
    // Generic build output from project tooling.
    "build/**",
    // Generated environment type declarations should not be linted as source.
    "next-env.d.ts",
  ]),
]);

// Give the ESLint CLI the completed flat configuration.
export default eslintConfig;
