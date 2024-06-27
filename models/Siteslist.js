const mongoose = require("mongoose");
const { Schema } = mongoose;

const SitesSchema = new Schema({
  sites: [
    {
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
    },
  ],
});

const Sites = mongoose.model("sites", SitesSchema);
module.exports = Sites;
