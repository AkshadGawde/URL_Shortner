const express = require("express");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");

const app = express();
const PORT = 8000;

app.use(express.json()); //middleware

connectToMongoDB("mongodb://localhost:27017/url-shortener")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  // Make the function async
  try {
    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } }, // Correct push syntax
      { new: true } // Return the updated document
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" }); // Handle missing entry
    }

    res.redirect(entry.redirectedUrl);
  } catch (error) {
    console.error("Error fetching short URL:", error);
    res.status(500).json({ error: "Internal server error" }); // Handle errors
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
