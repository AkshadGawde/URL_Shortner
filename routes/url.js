const express = require("express");
const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);
router.post("/analytics", handleGetAnalytics);
router.get("/analytics/:shortid", handleGetAnalytics);

module.exports = router;
