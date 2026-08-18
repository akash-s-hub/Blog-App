const sanitizeHtml = require("sanitize-html");

const sanitizeContent = (dirty) =>
  sanitizeHtml(dirty, {
    allowedTags: [
      "p", "br", "strong", "em", "u", "s", "blockquote",
      "ul", "ol", "li", "a", "img", "h1", "h2", "h3",
      "code", "pre",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
    allowedSchemes: ["http", "https", "mailto"], // blocks javascript: hrefs
  });

module.exports = sanitizeContent;