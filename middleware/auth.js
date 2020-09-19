const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //get token from the header
  const token = req.header("x-auth-token");
  //check if no token
  if (!token) {
    res.status(401).json({ message: "No token" });
  }
  //verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: "Token is not valid",
    });
  }
};
