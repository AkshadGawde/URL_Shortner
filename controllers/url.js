const shortid = require("shortid");
const Url = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ error: "URL is required" });
  }

  const shortID = shortid.generate();

  await Url.create({
    shortId: shortID,
    redirectedUrl: body.url,
    visitHistory: [],
  });

  res.json({ id: shortID });
}

module.exports = {
  handleGenerateNewShortURL,
};
