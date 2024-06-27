const express = require("express");
const router = express.Router();
const Folders = require("../models/Folders");
const Items = require("../models/Items");
const { body, validationResult } = require("express-validator");
const mongoose = require('mongoose')

// Add items to the folder
router.post(
  "/additem",
  [
    body("items", "Items should be an array").isArray(),
    body("items.*.key").isLength({ min: 3 }),
    body("items.*.title").isLength({ min: 3 }),
    body("items.*.siteLink").isLength({ min: 3 }),
    body("items.*.siteDesc").isLength({ min: 3 }),
    body("items.*.iconLink").isLength({ min: 3 }),
    body("items.*.rssLink").isLength({ min: 3 }),
    body("items.*.folder", "Folder ID must be provided").isMongoId()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const itemsData = req.body.items;


    try {
      const savedItems = [];

      // Process each item individually
      for (const itemData of itemsData) {
        const newItem = new Items({
        key: itemData.key,
        title: itemData.title,
        siteLink: itemData.siteLink,
        siteDesc: itemData.siteDesc,
        iconLink: itemData.iconLink,
        rssLink: itemData.rssLink,
        folder: itemData.folder
        });

        // Save the new Item
        const savedItem = await newItem.save();
        savedItems.push(savedItem);

        // Find the folder and update items array
        const folder = await Folders.findOneAndUpdate(
          { "folders._id": itemData.folder },
          { $push: { "folders.$.items": savedItem._id } },
          { new: true }
        );

        if (!folder) {
          return res.status(404).json({ message: "Folder not found" });
        }
      }

      res.status(201).json(savedItems);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
