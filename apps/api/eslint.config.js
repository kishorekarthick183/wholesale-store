import { config } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
    { files: ["**/*.ts"] },
    ...config,
    {
        rules: {
            // The Babel-based parser strips TypeScript types before linting,
            // so these two rules produce false positives on anything used
            // only in a type position (imported types, Node/DOM globals,
            // etc). `tsc --noEmit` (with noUnusedLocals/noUnusedParameters)
            // already covers both, with full type information.
            "no-undef": "off",
            "no-unused-vars": "off",
        },
    },
    { ignores: ["node_modules/**", "dist/**"] },
];