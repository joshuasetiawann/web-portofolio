import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Note: eslint-config-next already bundles eslint-plugin-jsx-a11y, so we do not
// re-register the plugin here (doing so throws "Cannot redefine plugin"). Extra
// a11y rules can be layered as rules-only overrides in the Phase 5 a11y pass.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // `set-state-in-effect` (React Compiler-era, new in react-hooks v6) flags
    // legitimate external-system syncs (feature detection, third-party instance
    // init). We use useSyncExternalStore where it fits; the remaining cases are
    // intentional, so keep this visible as a warning rather than a hard error.
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      // React Compiler rules (react-hooks v6). This project does NOT enable the
      // React Compiler, and these flag idiomatic patterns: dynamic icon rendering
      // + MDX component compilation (static-components), and React Hook Form's
      // handleSubmit (refs). Scoped down so they stay visible without failing CI.
      "react-hooks/static-components": "off",
      "react-hooks/refs": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    ".velite/**",
    "next-env.d.ts",
    "src/components/ui/**",
  ]),
]);

export default eslintConfig;
