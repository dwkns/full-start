const lodash = require("lodash");
const { DateTime } = require("luxon");
const util = require('util');
const htmlmin = require("html-minifier");
const cheerio = require('cheerio');
const fs = require('fs')
const site = require('./src/_data/site.js') // load the site configuration files
const slugify = require('slugify')


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
  let svgOptions = options || {}
  let className = svgOptions.class || ''
  let id = svgOptions.id || ''
  let title = svgOptions.alt || ''






  // read the SVG 
  const svgData = fs.readFileSync(fileName, 'utf8');

  //parse it with cheerio
  const $ = cheerio.load(svgData, {
    xmlMode: true
  });



  // Add class if it is given. 
  $('svg').addClass(className);

  // Add ID if given
  $('svg').attr("id", id);

  $('title').remove(); // get rid of any titles. 
  $('svg').prepend(`<title>${title}</title>`);



  // Remove height and width attributes
  $('svg').removeAttr("width");
  $('svg').removeAttr("height");

  return $.html();
}


// ------------- End of Eleventy Functions -------------


module.exports = (eleventyConfig) => {


  // custom collection with pagination for every category
  eleventyConfig.addCollection("allPosts", (collectionApi) => {

    // how many items per page should we load
    let numberOfresultsPerPage = site.paginationItemsPerPage

    // Create a collection of posts that have the content.isPost flag set to true
    // Could use any method to choose which posts you include.

    // Create an array of all the catefory and types names
    let categories = []
    let types = [] // not currently using types.

    // Filter all the posts getAall() returning those that have content.isPost key
    let allPosts = collectionApi.getAll().filter((item) => {
      // check the content object is present
      if (item.data.contentMetadata) {
        categories.push(item.data.contentMetadata.category) // record the category
        types.push(item.data.contentMetadata.type) // record the type
        return (item.data.contentMetadata.isPost) ? item : false
      }
    }).sort( (a, b) => {
      //sort the results. Latest date at the top.
      return b.data.contentMetadata.publishDate - a.data.contentMetadata.publishDate; // sort by date - descending
    });;



    // Make the categories uniquie
    let uniqueCategories = [...new Set(categories)];
    let uniqueTypes = [...new Set(types)];

    // Add All to both Categories and Types
    uniqueCategories.push('all')
    uniqueCategories = uniqueCategories.filter(n => n) // remove any null /empty values


    // Build a list of all posts sorted into categories.

    let categoryData = []
    uniqueCategories.forEach((categoryName) => {
      let allPostinCurrentCategory = [];
      allPosts.forEach((post) => {
        // console.log(`${categoryName} >> ${post.data.contentMetadata.category}`);
        if (post.data.contentMetadata.category == categoryName) {
          //add post to list
          allPostinCurrentCategory.push(post);
        } else if (categoryName == 'all') {
          allPostinCurrentCategory.push(post);
        }
      });

      let chunks = lodash.chunk(allPostinCurrentCategory, numberOfresultsPerPage)

      let slug = (categoryName != 'all') ? `/${slugify(categoryName, { lower: true })}` : '/'
      let pagesSlugs = [];
      // add those slugs to the pseudoCategory object.
      for (let i = 0; i < chunks.length; i++) {
        let pageSlug = '';
        // If there is more than one page of results.
        if (i > 0) {
          pageSlug = (slug == '/') ? `/${i + 1}` : `${slug}/${i + 1}`;
        } else {
          pageSlug = `${slug}`;
        }

        pagesSlugs.push(`${pageSlug}`);
      }

      categoryData.push({
        name: categoryName,
        posts: allPostinCurrentCategory,
        chunkedPosts: chunks,
        numberOfArticles: allPostinCurrentCategory.length,
        numberOfPagesOfArticles: chunks.length,
        pagesSlugs: pagesSlugs
      })
    });

    let blogpostsByCategories = [];
    // loop over each category
    categoryData.forEach((category) => {
      let pagesSlugs = category.pagesSlugs;

      // loop each set of chunked posts
      category.chunkedPosts.forEach((post, index) => {
        isFirstPage = (index == 0) ? true : false;
        isLastPage = (category.numberOfPagesOfArticles == index + 1) ? true : false;

        // contruct the output object
        blogpostsByCategories.push({
          name: category.name,

          pageSlugs: {
            all: pagesSlugs,
            next: pagesSlugs[index + 1] || null,
            previous: pagesSlugs[index - 1] || null,
            first: pagesSlugs[0] || null,
            last: pagesSlugs[pagesSlugs.length - 1] || null,
            count: pagesSlugs.length,
          },
          slug: pagesSlugs[index],
          pageNumber: index,
          totalPages: category.numberOfPagesOfArticles,
          isFirstPage: isFirstPage,
          isLastPage: isLastPage,
          currentPage: index + 1,
          items: post
        })
      })
    })

    return blogpostsByCategories
  })


  eleventyConfig.addFilter('createOGImageFileName', (permalink) => {
    let filename = `${permalink == "/" ? "/index/" : permalink}-og`
    let slugifiyedFilename = eleventyConfig.getFilter("slugify")(filename);
    return `${slugifiyedFilename}.svg`
  });

  eleventyConfig.addFilter('splitlines', function (input) {
    const parts = input.split(' ');
    const lines = parts.reduce(function (prev, current) {

      if (!prev.length) {
        return [current];
      }

      let lastOne = prev[prev.length - 1];

      if (lastOne.length + current.length > 8) {
        return [...prev, current];
      }

      prev[prev.length - 1] = lastOne + ' ' + current;

      return prev;
    }, []);

    return lines;
  });



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
