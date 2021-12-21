const lodash = require("lodash");
const { DateTime } = require("luxon");
const util = require('util');
module.exports = (eleventyConfig) => {


    // utility function to log value to HTML
    eleventyConfig.addFilter('console', function (value) {
      let str = util.inspect(value);
      console.log('-------------start console output-------------');
      console.log(str);
      console.log('-------------end-------------');
      let html = `<div style="white-space: pre-wrap;">${unescape(str)}</div>`
      return unescape(html)
    });




  // detect changes in the output folder and reload browser
  eleventyConfig.setBrowserSyncConfig({
    files: ['dist/**/*'],
    open: true,
  });

  // watch our script folder for changes. 
  eleventyConfig.addWatchTarget("./src/scripts/");
  eleventyConfig.addWatchTarget("./eleventy/");
  eleventyConfig.addWatchTarget("./tailwind.config.js");

  // return a readable date
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("dd LLL yyyy");
  });

  // Prepend 'A' or 'An' depeding on the next word supplied
  eleventyConfig.addFilter("addAnOrA", word => {
    firstChar = word.charAt(0)
    if (/[aeiou]/i.test(firstChar)) {
      return `An ${lodash.lowerCase(word)}`
    } else {
      return `A ${lodash.lowerCase(word)}`
    }
  });


  eleventyConfig.addPassthroughCopy({
    'src/fonts': './fonts',
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
