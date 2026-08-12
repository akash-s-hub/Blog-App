const mongoose = require("mongoose");
const slugify = require("slugify")

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  }
});

categorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
})

const Category = mongoose.model("Category", categorySchema)
module.exports = Category;