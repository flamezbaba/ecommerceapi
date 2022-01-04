const router = require("express").Router();
const Product = require("../models/Products");
const { verifyAdmin } = require("../utils/verifyTokens");

router.post("/new", verifyAdmin, async (req, res) => {
  if (!req.body.title) {
    return res.status(500).json({ status: false, data: "title is required" });
  }

  if (!req.body.img) {
    return res.status(500).json({ status: false, data: "img is required" });
  }

  if (!req.body.price) {
    return res.status(500).json({ status: false, data: "price is required" });
  }

  const record = await Product.findOne({ title: req.body.title });
  if (record) {
    return res.status(500).json({
      status: false,
      data: `product title '${req.body.title}' already used`,
    });
  }

  try {
    const newProduct = new Product({
      title: req.body.title,
      description: req.body.description,
      img: req.body.img,
      categories: req.body.categories,
      price: req.body.price,
    });

    const r = await newProduct.save();
    return res.status(200).json({ status: true, data: r });
  } catch (err) {
    return res.status(500).json({ status: false, data: err });
  }
});


router.get("/", async (req, res) => {
  try {
    const records = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ status: true, data: records });
  } catch (err) {
    return res.status(500).json({ status: false, data: err });
  }
});

router.delete("/:id", verifyAdmin, async (req, res) => {

  try {
    Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ status: true, data: "product deleted" });
  } catch (err) {
    return res.status(500).json({ status: false, data: err });
  }
});

router.get("/:id", verifyAdmin, async (req, res) => {
  try {
    const record = await Product.findById(req.params.id);
    return res.status(200).json({ status: true, data: record });
  } catch (err) {
    return res.status(500).json({ status: false, data: err });
  }
});



module.exports = router;
