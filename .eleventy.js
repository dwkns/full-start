const lodash = require("lodash");
const { DateTime } = require("luxon");
const util = require('util');
const htmlmin = require("html-minifier");
const cheerio = require('cheerio');
const fs = require('fs')
const site = require('./src/_data/site.js') // load the site configuration files


// ------------- Eleventy Functions -------------
// Consider extracting these to a seperate file as you use them all the time. 


// compress the html and inline CSS & JS
const htmlminifer = (content, outputPath) => {
  const minify = site[site.currentEnv].minify_inline_HTML_CSS_JS
  if (!minify) { return content }
  if (outputPath && outputPath.endsWith(".html")) {
    let minified = htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true,
    });
    return minified;
  }
  return content;

}
  // utility function to log value to HTML & the Console
const logToHTML = (value) => {
  let str = util.inspect(value);
  console.log('-------------start console output-------------');
  console.log(str);
  console.log('-------------end-------------');
  let html = `<div style="white-space: pre-wrap;">${unescape(str)}</div>`
  return unescape(html)
}

 // return a human readable date
const readableDate = (dateObj) => {
  return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("dd LLL yyyy");
}

  // Prepend 'A' or 'An' depeding on the next word supplied
const addAnOrA = (word) => {
  firstChar = word.charAt(0)
  if (/[aeiou]/i.test(firstChar)) {
    return `An ${lodash.lowerCase(word)}`
  } else {
    return `A ${lodash.lowerCase(word)}`
  }
}


// inline SVG
// use with:  {% inlineSVG './path/to/your.svg', { class: "yourClass anotherClass" } %}
const inlineSVG = async (fileName, options) => {
  let svgOptions  = options || {}
  let className  = svgOptions.class || ''
  let id  = svgOptions.id || ''
  let title  = svgOptions.alt || ''


 



  // read the SVG 
  const svgData = fs.readFileSync(fileName, 'utf8');
  
  //parse it with cheerio
  const $ = cheerio.load(svgData, {
    xmlMode: true
  });



  // Add class if it is given. 
  $('svg').addClass(className);

  // Add ID if given
  $('svg').attr("id",id);

  $('title').remove(); // get rid of any titles. 
  $('svg').prepend(`<title>${title}</title>`);   



  // Remove height and width attributes
  $('svg').removeAttr("width");
  $('svg').removeAttr("height");
  
  return $.html();
}


// ------------- End of Eleventy Functions -------------


module.exports = (eleventyConfig) => {
 
  // inline SVG
  eleventyConfig.addAsyncShortcode('inlineSVG', inlineSVG);
  
  // compress the html and inline CSS & JS
  eleventyConfig.addTransform("htmlmin", htmlminifer);
  
  // utility function to log value to HTML
  eleventyConfig.addFilter('console', logToHTML);

  // return a human readable date
  eleventyConfig.addFilter("readableDate", readableDate);

  // Prepend 'A' or 'An' depeding on the next word supplied
  eleventyConfig.addFilter("addAnOrA", addAnOrA);


  
  // detect changes in the output folder and reload browser
  eleventyConfig.setBrowserSyncConfig({
    files: ['dist/**/*'],
    open: true,
  });

  // watch our script folder for changes. 
  eleventyConfig.addWatchTarget("./src/scripts/");
  eleventyConfig.addWatchTarget("./eleventy/");
  eleventyConfig.addWatchTarget("./tailwind.config.js");

  eleventyConfig.addPassthroughCopy({
    'src/fonts': './fonts',
    'src/images': './images',
    'src/styles/compiled.css': './styles/compiled.css',
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
