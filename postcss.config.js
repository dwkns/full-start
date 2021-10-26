// postcss.config.js
const production = process.env.NODE_ENV === `production` // true when NODE_ENV is production
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    cssnano: production
  }
}