const shortid = require("shortid");
const Url = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const shortid = shortid.generate().slice(0, 2);
  try {
    const newUrl = await Url.create({
      shortid: shortid,
      redirectUrl: url,
      visitHistory: [],
    });

    return res.json({ id: shortid, message: "Short URL created successfully" });
  } catch (error) {
    console.error("Error creating short URL:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const { shortid } = req.params;
    const result = await Url.findOne({ shortid });

    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
