const express = require("express");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const path = require("path");
const staticRouter = require("./routes/staticRouter");

const app = express();
const PORT = 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", staticRouter);

// Set view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/url", urlRoute);

app.get("/test", async (req, res) => {
  try {
    const allUrls = await URL.find({});
    return res.render("home", { urls: allUrls });
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

connectToMongoDB("mongodb://localhost:27017/url-shortener")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.get("/:shortid", async (req, res) => {
  try {
    const { shortid } = req.params;
    const entry = await URL.findOneAndUpdate(
      { shortid },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.redirect(entry.redirectUrl);
  } catch (error) {
    console.error("Error fetching short URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
