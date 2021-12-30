const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const Admin = require("../models/Admins");

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ status: false, data: "Not authenticated" });

      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ status: false, data: "Not authenticated" });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, async () => {
    if (req.user) {
      const admin = await Admin.findById(req.user.id);
      if (admin) {
        next();
      } else {
        return res.status(403).json({ status: false, data: "Not Authorized" });
      }
    } else {
      return res.status(401).json({ status: false, data: "Not authenticated" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
