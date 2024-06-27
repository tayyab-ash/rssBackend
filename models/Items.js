const mongoose = require("mongoose");
const { Schema } = mongoose;
const Folders = require("./Folders");

const ItemsSchema = new Schema({
  key: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  siteLink: {
    type: String,
    required: true,
  },
  siteDesc: {
    type: String,
    required: true,
  },
  iconLink: {
    type: String,
    required: true,
  },
  rssLink: {
    type: String,
    required: true,
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folders",
  }
});

const Items = mongoose.model("items", ItemsSchema);
module.exports = Items;
