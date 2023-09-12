/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./lib/**/*.tsx"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
  experimental: {
    optimizeUniversalDefaults: true,
  },
};
