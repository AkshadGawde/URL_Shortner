const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: { type: String, required: true, unique: true },
    redirectedUrl: {
      type: String,
      required: true,
    },
    visitHistory: [{ timestapm: { type: Number } }],
  },
  { timestamps: true }
);

const URL = mongoose.model("URL", urlSchema);

module.exports = URL;
