module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "**/*.{html,js,xml,json,css,woff2,woff,mp4,jpeg,png,svg,ico,jpg}"
  ],
  "swDest": "public\\sw.js",
  "swSrc": "sw.js",
  "globIgnores": [
    "../workbox-config.js"
  ],
};