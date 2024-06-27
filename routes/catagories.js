const express = require("express");
const router = express.Router();
const Categories = require("../models/Categories");
const Category = require("../models/Categories");
const { query, body, validationResult } = require("express-validator");

router.post(
  "/addcategory",
  [body("key").isLength({ min: 3 }), body("catName").isLength({ min: 3 }), body("catImg").isLength({ min: 3 })],
  async (req, res) => {
    try {
    const categories = req.body.categories.map(item => ({
        key: item.key,
        catName: item.catName,
        catImgUrl: item.catImgUrl
      }));

      const newCategoryDocument = new Category({ categories });
      const savedCategory = await newCategoryDocument.save();
      res.json(savedCategory);


    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//Fetch data
router.get('/fetchcategory', async (req, res) => {
    try {
      const categories = await Categories.find();
      res.json(categories);
    } catch (err) {
      res.status(500).send(err);
    }
  });

module.exports = router;
