export default {
  layout: "layouts/article.njk",
  tags: "articles",
  eleventyComputed: {
    // published: false (set from the editor portal) takes the page out of the
    // build entirely — no URL, no listings, no feed.
    permalink: (data) =>
      data.published === false ? false : `/stories/${data.page.fileSlug}/`,
    eleventyExcludeFromCollections: (data) => data.published === false,
  },
};
