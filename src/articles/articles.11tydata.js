import { existsSync } from "node:fs";

// A story is held back if it is unpublished (editor portal toggle) or its
// artwork file does not exist yet — CI generates missing artwork and the
// story appears on the next build, instead of going live with a broken image.
const isLive = (data) =>
  data.published !== false && existsSync(`src${data.image}`);

export default {
  layout: "layouts/article.njk",
  tags: "articles",
  eleventyComputed: {
    image: (data) =>
      data.image || `/assets/images/${data.page.fileSlug}.png`,
    permalink: (data) =>
      isLive(data) ? `/stories/${data.page.fileSlug}/` : false,
    eleventyExcludeFromCollections: (data) => !isLive(data),
  },
};
