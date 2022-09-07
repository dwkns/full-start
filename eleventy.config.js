const site = require('./src/_data/site.js') // load the site configuration files
const { logToConsole, inlineSVG , readableDate, prependAnOrA, htmlMinifer } = require('dwkns-eleventy-plugins')
// const { logToConsole, inlineSVG, htmlMinifer, readableDate, prependAnOrA } = require('../dwkns-eleventy-plugins') // local version

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(logToConsole, {
    logToHtml: false,
    logToConsole: false,
    colorizeConsole: true,
  });
  
  eleventyConfig.addPlugin(htmlMinifer, { 
    minify: site[site.currentEnv].minify_html,
    minifyCSS: true,
    minifyJS: true,
  });

  eleventyConfig.addPlugin(inlineSVG);
  eleventyConfig.addPlugin(readableDate);
  eleventyConfig.addPlugin(prependAnOrA);

  // watch our script folder for changes. 
  eleventyConfig.addWatchTarget("./src/scripts/");
  eleventyConfig.addWatchTarget("./tailwind.config.js");

  eleventyConfig.addPassthroughCopy({
    'src/fonts': './fonts',
    'src/images': './images',
    'src/styles/compiled.css': './styles/compiled.css',
  });

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.setServerOptions({
    domdiff: false, // reload instead of domdiff
    port: 8080,
    showAllHosts: false, 
    showVersion: false,
  });

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







// const lodash = require("lodash");
// const { DateTime } = require("luxon");
// const util = require('util');

// const cheerio = require('cheerio');
// const fs = require('fs')
// const slugify = require('slugify');
// const pluralize = require("pluralize");


// const { logToConsole, inlineSVG, htmlMinifer, readableDate, prependAnOrA } = require('../dwkns-eleventy-plugins') // local version



// module.exports = (eleventyConfig) => {


//   // // minify defaults to true if no options are passed in.


 


//   // // // custom collection with pagination for every category
//   // // eleventyConfig.addCollection("allPosts", blogPostsByCategories)

//   // // eleventyConfig.addFilter('pluralizeAfterNumber', (number, word) => {
//   // //   return (number == 1) ? `${number} ${word}` : `${number} ${pluralize(word)}`
//   // // });



//   // // eleventyConfig.addFilter('createOGImageFileName', (permalink) => {
//   // //   let filename = `${permalink == "/" ? "/index/" : permalink}-og`
//   // //   let slugifiyedFilename = eleventyConfig.getFilter("slugify")(filename);
//   // //   return `${slugifiyedFilename}.svg`
//   // // });

//   // // eleventyConfig.addFilter('splitlines', function (input) {
//   // //   const parts = input.split(' ');
//   // //   const lines = parts.reduce(function (prev, current) {

//   // //     if (!prev.length) {
//   // //       return [current];
//   // //     }

//   // //     let lastOne = prev[prev.length - 1];

//   // //     if (lastOne.length + current.length > 8) {
//   // //       return [...prev, current];
//   // //     }

//   // //     prev[prev.length - 1] = lastOne + ' ' + current;

//   // //     return prev;
//   // //   }, []);

//   // //   return lines;
//   // // });




//   // // watch our script folder for changes. 
//   // eleventyConfig.addWatchTarget("./src/scripts/");
//   // eleventyConfig.addWatchTarget("./eleventy/");
//   // eleventyConfig.addWatchTarget("./tailwind.config.js");

//   // eleventyConfig.addPassthroughCopy({
//   //   'src/assets/fonts': './fonts',
//   //   'src/images/favicons': './favicons',
//   //   'src/images': './images',
//   //   'src/styles/compiled.css': './styles/compiled.css',
//   // });

//   // eleventyConfig.setDataDeepMerge(true);

//   // eleventyConfig.setServerOptions({
//   //   // Show local network IP addresses for device testing
//   //   showAllHosts: true,

//   // });

//   return {
//     dir: {
//       input: 'src',
//       output: 'dist',
//       includes: '_partials/',
//       layouts: '_partials/_layouts',
//       data: '_data',
//     },
//   };
// };
