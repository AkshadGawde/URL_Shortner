const express = require("express");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const path = require("path");
const staticRouter = require("./routes/staticRouter");

const app = express();
const PORT = 8000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", staticRouter);

app.get("/test", async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", {
    urls: allUrls, //extra data to be passed to the view
  });
});

connectToMongoDB("mongodb://localhost:27017/url-shortener")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

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
