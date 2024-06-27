const express = require("express");
const router = express.Router();
const Sites = require("../models/Siteslist");
const Site = require("../models/Siteslist");
const { query, body, validationResult } = require("express-validator");

router.post(
  "/addsite",
  [
    body("key").isLength({ min: 3 }),
    body("title").isLength({ min: 3 }),
    body("siteLink").isLength({ min: 3 }),
    body("iconLink").isLength({ min: 3 }),
    body("rssLink").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      const sites = req.body.sites.map((item) => ({
        key: item.key,
        title: item.title,
        siteLink: item.siteLink,
        siteDesc: item.siteDesc,
        iconLink: item.iconLink,
        rssLink: item.rssLink,
      }));

      const newSitesDocument = new Site({ sites });
      const savedSite = await newSitesDocument.save();
      res.json(savedSite);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//Fetch data
router.get('/fetchsites', async (req, res) => {
    try {
      const sites = await Sites.find();
      res.json(sites);
    } catch (err) {
      res.status(500).send(err);
    }
  });

module.exports = router;
