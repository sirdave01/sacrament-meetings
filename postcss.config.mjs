// Configure PostCSS plugins used by the CSS build pipeline.
const config = {
  plugins: {
    // Let Tailwind process utility directives and generate the app's styles.
    "@tailwindcss/postcss": {},
  },
};

// Export the plugin map for Next's CSS processing pipeline.
export default config;
