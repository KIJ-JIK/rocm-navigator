const postcss = require('postcss');
const tailwind = require('@tailwindcss/postcss');

const cssInput = `
@import "tailwindcss";
.test {
  @apply text-red-500;
}
`;

console.log("Compiling CSS with postcss + tailwind...");
postcss([tailwind])
  .process(cssInput, { from: 'input.css' })
  .then(result => {
    console.log("CSS compiled successfully!");
    console.log("Output CSS length:", result.css.length);
  })
  .catch(err => {
    console.error("Error compiling CSS:", err);
  });
