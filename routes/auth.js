const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/Users");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  if (!req.body.username) {
    res.status(500).json({ status: false, data: "username is required" });
    return;
  }

  if (!req.body.email) {
    res.status(500).json({ status: false, data: "email is required" });
    return;
  }

  if (!req.body.password) {
    res.status(500).json({ status: false, data: "password is required" });
    return;
  }

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json({ status: true, data: savedUser });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  !req.body.username &&
    res.status(500).json({ status: false, data: "username is required" });

  !req.body.password &&
    res.status(500).json({ status: false, data: "password is required" });

  try {
    const user = await User.findOne({ username: req.body.username });

    !user && res.status(500).json({ status: false, data: "Wrong Username" });

    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET);

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password && res.status(500).json({ status: false, data: "Wrong Password" });

    const accessToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "3d"});

    const {password, ...others} = user._doc;
    res.status(200).json({status: true, data: {...others, accessToken}});
  } catch (err) {
    res.status(500).json({ status: false, data: err });
  }
});

module.exports = router;
