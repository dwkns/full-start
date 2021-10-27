let siteData = {
  name: "dwkns",
  legalName: "dwkns ltd",
  development: {
    baseURL: 'http://localhost:8080',
    createSitemap: true,
    allowIndexing: false,
    allowRobots: true,
    minifyCSS: false,
    inlineCSS: true,
  },
  currentYear: new Date().getFullYear(),
  version: Math.random().toString(36).substr(2, 8),
}

module.exports = siteData


// "name": "Under2",
//   "legalName": "Under2 Limited",
//   "url": "https://under2.global",
//   "logo": "https://under2.global/images/u2-logo-for-white.png",
//   "foundingDate": "2019",
//   "privacyEmail": "privacy@under2.global",
//   "companyAddress": "7 Bell Yard, London, United Kingdom, WC2A 2JR",
//   "address": { 
//      "type": "PostalAddress", 
//      "streetAddress": "7 Bell Yard", 
//      "addressRegion": "London", 
//      "postalCode": "WC2A 2JR", 
//      "addressCountry": "UK" },
//   "twitterURL" : "https://twitter.com/under2global",
//   "linkedInURL" : "https://www.linkedin.com/company/under2/",
//   "author": {
//     "handle": "@dwkns",
//     "name": "dwkns"
//   },
//   "googleAnalyticsID": "G-YW7QMHS01K",
//   "actOnID": "44267",
//   "linkedInID": "3949985",
//   "urls": {
//     "production": "https://under2.global",
//     "staging": "https://staging.under2.global",
//     "development": "http://localhost:8080"
//   },
//   "development": {
//     "baseURL":  "http://localhost:8080",
//     "debug": false,
//     "debugScreens": false,
//     "showDefaultTextInForms": true,
//     "formsActive": false,
//     "linkedInActive": false,
//     "googleAnalyticsActive": false,
//     "actOnActive": false,
//     "createSitemap" : false,
//     "allowIndexing" : false,
//     "allowRobots" : true,
//     "inlineCSS" : false,
//     "compressCSS" : false,
//     "compressHTML": false
//   },