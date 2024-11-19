import nextra from "nextra";

import path from "path";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
  defaultShowCopyCode: true,
});

export default withNextra({
  experimental: {
    externalDir: true,
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    // Important: return the modified config
    return {
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          "react/jsx-runtime": "react/jsx-runtime.js",
          "react/jsx-dev-runtime": path.resolve(
            import.meta.dirname,
            "node_modules/react/jsx-dev-runtime.js",
          ),
          react: path.resolve(import.meta.dirname, "node_modules/react"),
          "react-dropzone": path.resolve(
            import.meta.dirname,
            "node_modules/react-dropzone",
          ),
        },
      },
    };
  },
});
