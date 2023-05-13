const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const authenticate = async (req, res, next) => {
  try {
    // console.log("req.cookies:", req.cookies);
    const token = req.cookies.jwtoken;
    // console.log("token:", token);
    const verifyToken = jwt.verify(token, process.env.SECRET);
    // console.log("verifyToken:", verifyToken);
    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });
    // console.log("rootUser:", rootUser);

    // console.log("test 1");

    if (!rootUser) {
      throw new Error("User Not Found");
    }

    req.token = token;
    // console.log("req.token:", req.token);
    req.rootUser = rootUser;
    // console.log("req.rootUser:", req.rootUser);
    req.userID = rootUser._id;
    // console.log("req.userID:", req.userID);

    next();
  } catch (err) {
    console.log(err);
    res.status(401).send("Unauthorized: No Token Provided");
  }
};

module.exports = authenticate;
