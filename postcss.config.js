// postcss.config.js
const tailwindcss = require('tailwindcss') 
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const  site  = require('./src/_data/site.js') // import our site data

const minifyCSS = site[site.currentEnv].minifyCSS

console.log('minifyCSS',minifyCSS);

// load some plugins
const postCSSplugins = [
  tailwindcss,
  autoprefixer,
    ...( minifyCSS ? [cssnano()] : []) // minify based on site config
]

module.exports = {
  plugins: postCSSplugins,
}