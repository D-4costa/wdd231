Chamber Discover Page — project files
Structure:
chamber/
  discover.html
  styles/styles.css
  scripts/main.js
  data/places.mjs
  images/place1.webp ... place8.webp

Notes:
- The data file (places.mjs) exports a default array `places` and a named export `places`.
- The main.js file imports the places array with an ES module import and dynamically builds 8 cards.
- Images are saved as webp in images/ and use loading="lazy" for lazy loading.
- Grid layout uses named grid areas for small (320-640), medium (641-1024), and large (1025+) screen sizes.
- Image hover effect is applied only on screens wider than 1025px via media query.
- localStorage is used to store the last visit timestamp and display an appropriate message in the message area.
