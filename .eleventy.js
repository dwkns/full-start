const lodash = require("lodash");
const { DateTime } = require("luxon");
const util = require('util');
const htmlmin = require("html-minifier");
const cheerio = require('cheerio');
const fs = require('fs')
const slugify = require('slugify');
const pluralize = require("pluralize");
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


// **********
// Create a collection of posts that have the content.isPost flag set to true
// Posts are grouped by content.category
// Each category is paginated.
// Additional data is returned to make UI easier to build such as:
//  - isFirstPage/isLastPage/currentPage — which page of results you are on.
//  - numberOfPages — how many results pages there are
//  - numberOfPosts — total number of posts in a current category
//  - categoryData — meta info about all the categories

const blogPostsByCategories = (collectionApi) => {

  // how many items per page should we load
  let numberOfresultsPerPage = site.paginationItemsPerPage

  // Create an array of all the catefory and types names
  let categories = []
  let types = [] // not currently using types.


  // Filter all the posts using getAall() returning those that have content.isPost key
  let allPosts = collectionApi.getAll().filter((item) => {

    // check the content object is present to avoid trying to read non-existant properties
    if (item.data.contentMetadata) {
      categories.push(item.data.contentMetadata.category) // record the category
      types.push(item.data.contentMetadata.type) // record the type
      return (item.data.contentMetadata.isPost) ? item : false
    }
  }).sort((a, b) => {
    //sort the results. Latest date at the top.
    return b.data.contentMetadata.publishDate - a.data.contentMetadata.publishDate;
  });;


  // Make the categories uniquie
  let uniqueCategories = [...new Set(categories)];
  let uniqueTypes = [...new Set(types)]; // not currently using types


  uniqueCategories.push('All') // Add and All Category 

  // Remove any null /empty values — avoids errors if contentMeta.category is blank
  uniqueCategories = uniqueCategories.filter(n => n)


  // Build a list of all posts sorted into categories.
  let pageDataForAllCategories = []
  let categoryData = []

  // loop over the unique catefories
  uniqueCategories.forEach((categoryName) => {

    let allPostinCurrentCategory = [];

    // add all the posts that are in the current category.
    allPosts.forEach((post) => {
      if (post.data.contentMetadata.category == categoryName || categoryName == 'All') {
        allPostinCurrentCategory.push(post);
      }
    });

    // chunk up all the posts in this category by the number of results/page we want. 
    let chunks = lodash.chunk(allPostinCurrentCategory, numberOfresultsPerPage)

    // create a slug for the category
    let slug = (categoryName != 'All') ? `/${slugify(categoryName, { lower: true })}` : '/'


    // create an array of pageSlugs for each chunk of posts
    let pagesSlugs = [];
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

    // construct an simple categoryData object to be passed to page to make UI easier.
    categoryData.push(
      {
        name: categoryName,
        slug: slug,
        numberOfPosts: allPostinCurrentCategory.length
      }
    )

    pageDataForAllCategories.push({
      name: categoryName,
      posts: allPostinCurrentCategory,
      chunkedPosts: chunks,
      numberOfPosts: allPostinCurrentCategory.length,
      numberOfPagesOfPosts: chunks.length,
      pagesSlugs: pagesSlugs,

    })


  });


  // Sort the categoryData alphabetically ensuring All is first.

  // Store the All Category
  var allCategory = categoryData.find(obj => {
    return obj.name === 'All'
  })

  // Remove the All Category so it doesn't get sorted.
  let sortedCategoryData = lodash.reject(categoryData, (item) => {
    return item.name === "All"
  })

  //sort the rest of the categories alphabetically 
  sortedCategoryData.sort((a, b) => a.name.localeCompare(b.name));

  // Add the All Category back in at the start of the list
  sortedCategoryData.unshift(allCategory)

  // we need a deep copy of the array to avoid circular references.
  let deepCloneSortedCategoroes = JSON.parse(JSON.stringify(sortedCategoryData));

  allcategoryData = {};
  sortedCategoryData.forEach(category => {
    category['sort'] = deepCloneSortedCategoroes
    allcategoryData[category.name] = category
  })

  // console.log(allcategoryData);


  let blogPostsByCategories = [];


  pageDataForAllCategories.forEach((category) => {

    let pagesSlugs = category.pagesSlugs;

    // loop each of the chunked posts
    category.chunkedPosts.forEach((post, index) => {

      // set some properties useful in the UI
      isFirstPage = (index == 0) ? true : false;
      isLastPage = (category.numberOfPagesOfPosts == index + 1) ? true : false;

      // contruct the pagination object and add to blogPostsByCategories Arrau
      blogPostsByCategories.push({
        name: category.name,

        // contructs the pageslugs needed for pagination controls.
        pageSlugs: {
          all: pagesSlugs,
          next: pagesSlugs[index + 1] || null,
          previous: pagesSlugs[index - 1] || null,
          first: pagesSlugs[0] || null,
          last: pagesSlugs[pagesSlugs.length - 1] || null,
          count: pagesSlugs.length,
        },
        slug: pagesSlugs[index],
        totalPages: category.numberOfPagesOfPosts, // total number of pages of posts
        numberOfPosts: category.numberOfPosts, // total number of posts in this category
        isFirstPage: isFirstPage, // true if this is first chunk/page of results.
        isLastPage: isLastPage, // true if this is last chunk/page of results.
        currentPage: index + 1, // the current page (useful for UI)
        categoryData: allcategoryData, // data about all the categories
        items: post, // the posts in this chunk
        allPosts: category.posts // all the posts in this category.
      })
    })
  })

  return blogPostsByCategories
}


// ------------- End of Eleventy Functions -------------


module.exports = (eleventyConfig) => {




  // custom collection with pagination for every category
  eleventyConfig.addCollection("allPosts", blogPostsByCategories)

  eleventyConfig.addFilter('pluralizeAfterNumber', (number, word) => {
    return (number == 1) ? `${number} ${word}` : `${number} ${pluralize(word)}`
  });



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
    'src/styles/compiled.css': './styles/compiled.css',
  });

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.setServerOptions({
 // Show local network IP addresses for device testing
    showAllHosts: true,

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
