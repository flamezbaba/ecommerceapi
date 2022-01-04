const router = require("express").Router();
const Product = require("../models/Products");
const Order = require("../models/Orders");
const { verifyAdmin, verifyToken } = require("../utils/verifyTokens");

// create
router.post("/", verifyToken, async (req, res) => {
  if (!req.body) {
    return res
      .status(500)
      .json({ status: false, data: "order details is required" });
  }

  try {
    const newOrder = new Order(req.body);

    const r = await newOrder.save();
    return res.status(200).json({ status: true, data: r });
  } catch (err) {
    return res.status(500).json({ status: false, data: err });
  }
});

// DELETE
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json({ status: true, data: "order deleted" });
  } catch (err) {
    return res.status(500).json({ status: false, data: err });
  }
});

// GET USER ORDERS
router.get("/find/:userId", verifyToken, async (req, res) => {
  try {
    const record = await Order.find({ userId: req.params.id });
    return res.status(200).json({ status: true, data: record });
  } catch (err) {
    return res.status(500).json({ status: false, data: err });
  }
});

//   ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const records = await Orders.find().sort({ createdAt: -1 });
    return res.status(200).json({ status: true, data: records });
  } catch (err) {
    return res.status(500).json({ status: false, data: err });
  }
});

// GET SINGLE ORDER
router.get("/single/:id", verifyAdmin, async (req, res) => {
  try {
    const record = await Order.findById(req.params.id);
    return res.status(200).json({ status: true, data: record });
  } catch (err) {
    return res.status(500).json({ status: false, data: err });
  }
});

module.exports = router;
