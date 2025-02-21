const express = require("express");
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
