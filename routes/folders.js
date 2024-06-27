const express = require("express");
const router = express.Router();
const Folders = require("../models/Folders");
const { query, body, validationResult } = require("express-validator");
const Items = require("../models/Items");

//Create a Folder
router.post(
  "/createfolder",
  [
    // body("folders", "Folders should be an array").isArray(),
    body(
      "folders.*.name",
      "Each folder must have a name with at least 3 characters"
    ).isLength({ min: 3 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const folders = req.body.folders.map((item) => ({
        name: item.name,
      }));

      const newFolder = new Folders({ folders });
      const savedFolder = await newFolder.save();
      res.json(savedFolder);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error occured");
    }
  }
);


//Get folders
router.get("/getfolders", async (req, res) => {
  try {
    const folders = await Folders.find().populate("folders.items");
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//Update Folders
router.put(
    "/addfolders/:folderId",
    [
      body("folders", "Folders should be an array").isArray(),
      body("folders.*.name", "Each folder must have a name with at least 3 characters").isLength({ min: 3 }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { folderId } = req.params;
      const { folders } = req.body;
  
      try {
        const updatedFolder = await Folders.findByIdAndUpdate(
          folderId,
          { $push: { folders: { $each: folders } } },
          { new: true }
        );
  
        if (!updatedFolder) {
          return res.status(404).json({ message: "Folder not found" });
        }

        res.json(updatedFolder);
      } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred");
      }
    }
  );

module.exports = router;
