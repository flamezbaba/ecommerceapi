const router = require("express").Router();
const {verifyAdmin} = require("../utils/verifyTokens");

router.post("/add", verifyAdmin,  async (req,res) => {
//   console.log("show working");
  res.status(200).json("yeah")
});

module.exports = router;
