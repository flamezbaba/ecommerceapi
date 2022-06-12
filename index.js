const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/products");
const orderRoute = require("./routes/orders");

if (process.env.NODE_ENV === "test") {
  var DBUrl = process.env.MONGO_TEST_URL;
} else {
  var DBUrl = process.env.MONGO_URL;
}

mongoose
  .connect(DBUrl)
  .then(() => {
    console.log("mongo DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products/", productRoute);
app.use("/api/orders/", orderRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => `Backend Server running on port ${port} 🔥`);

module.exports = app;
