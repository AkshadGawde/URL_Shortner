const express = require("express");
const URL = require("../models/url");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allUrls = await URL.find({});
    res.render("home", { urls: allUrls, error: null });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.render("home", { urls: [], error: "Failed to fetch URLs" });
  }
});

router.post("/url", async (req, res) => {
  try {
    const { url } = req.body;

    // Generate a short ID (you can use nanoid or a hash function)
    const shortid = Math.random().toString(36).substring(2, 4);

    const newUrl = new URL({
      shortid,
      redirectUrl: url,
      visitHistory: [],
    });

    await newUrl.save();

    res.redirect("/");
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.redirect("/");
  }
});

router.get("/:shortid", async (req, res) => {
  try {
    const urlData = await URL.findOne({ shortid: req.params.shortid });

    if (!urlData) {
      return res.status(404).send("URL Not Found");
    }

    urlData.visitHistory.push({ timestamp: new Date() });
    await urlData.save();

    res.redirect(urlData.redirectUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
