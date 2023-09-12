const path = require("path");

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

module.exports = withNextra({
  experimental: {
    externalDir: true,
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Important: return the modified config
    return {
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          "react/jsx-runtime": "react/jsx-runtime.js",
          "react/jsx-dev-runtime": path.resolve(
            __dirname,
            "node_modules/react/jsx-dev-runtime.js"
          ),
          react: path.resolve(__dirname, "node_modules/react"),
          "react-dropzone": path.resolve(
            __dirname,
            "node_modules/react-dropzone"
          ),
        },
      },
    };
  },
});
