import { defineConfig } from "vitest/config";
export default defineConfig({
  resolve: {
    alias: [
      { find: /^react-native$/, replacement: "react-native-web" },
      {
        find: /^react-native-svg$/,
        replacement: new URL(
          "./node_modules/react-native-svg/lib/module/ReactNativeSVG.web.js",
          import.meta.url,
        ).pathname,
      },
    ],
    extensions: [
      ".web.mjs",
      ".mjs",
      ".web.js",
      ".js",
      ".web.tsx",
      ".tsx",
      ".ts",
      ".json",
    ],
  },
  // RN Primitives ships JSX in .mjs. Let Vite transform its web implementations.
  plugins: [
    {
      name: "native-jsx",
      async transform(code, id) {
        if (id.includes("/@rn-primitives/") && /\.[mc]?js$/.test(id)) {
          const { transform } = await import("esbuild");
          return transform(code, {
            loader: "jsx",
            jsx: "automatic",
            sourcemap: true,
          });
        }
      },
    },
  ],
  test: {
    environment: "jsdom",
    maxWorkers: 1,
    setupFiles: ["./scripts/test-setup-universal.ts"],
    include: ["packages/ui/universal-tests/**/*.test.tsx"],
    server: {
      deps: {
        inline: [/@rn-primitives/, /react-native-svg/, /lucide-react-native/],
      },
    },
  },
});
