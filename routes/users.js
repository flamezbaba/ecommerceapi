const router = require("express").Router();

router.get("/show", () => {
  console.log("show working");
});

module.exports = router;
