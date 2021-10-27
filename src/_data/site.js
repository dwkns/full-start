let siteData = {
  name:  "Under2",
  development: {
    minifyCSS: false,
    inlineCSS: true,
  },
  currentYear: new Date().getFullYear(),
  version: Math.random().toString(36).substr(2, 8),
}
module.exports = siteData
