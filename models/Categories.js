const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategoriesSchema = new Schema({
  categories: [
    {
      key: { type: String, required: true },
      catName: { type: String, required: true },
      catImgUrl: { type: String, required: true },
    },
  ],
});

const Category = mongoose.model("category", CategoriesSchema);
// User.createIndexes();
module.exports = Category;
