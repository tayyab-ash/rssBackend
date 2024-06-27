const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");

router.get("/fetchrss", async (req, res) => {
  const uri = "mongodb://localhost:27017/news_scrapper";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("news_scrapper");
    const collection = database.collection("scrapped_news");
    const data = await collection.find().toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  } finally {
    await client.close();
  }
});

module.exports = router;
