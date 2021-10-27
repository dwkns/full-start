const { build } = require("esbuild");
const production = process.env.NODE_ENV === `production` // true when NODE_ENV is production

module.exports = (eleventyConfig) => {

  // detect changes in the output folder and reload browser
  eleventyConfig.setBrowserSyncConfig({
    files: ['dist/**/*'],
    open: true,
  });

  // watch our script folder for changes. 
  eleventyConfig.addWatchTarget("./src/scripts/");
  eleventyConfig.addWatchTarget("./eleventy/");
  eleventyConfig.addWatchTarget("./tailwind.config.js");
  
  // use esbuild to compile our JavaScript
  eleventyConfig.on("beforeBuild", () => {
    build({
      entryPoints: ["./src/scripts/main.js"],
      outfile: "dist/scripts/main.js",
      bundle: true,
      minify: production,
    }).catch(() => process.exit(1));
  });

  eleventyConfig.addPassthroughCopy({
    'src/static': './',
    'src/images': './images',
    'src/styles/compiled.css': './styles/compiled.css'
  });

  eleventyConfig.setDataDeepMerge(true);

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_partials/',
      layouts: '_partials/_layouts',
      data: '_data',
    },
  };
};
