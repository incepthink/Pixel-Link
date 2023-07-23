const jwt = require("jsonwebtoken");

const { user } = require("../models/");

const cookie = require("cookie");

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    console.log("VERIFY TOKEN",token);

    if (token == null) return res.status(401).json({msg:"No Token Found"});

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      try {
        if (err) return res.status(403).json({msg:"Not Authorized"});
        req.user = user;
        next();
      } catch (err) {
        console.log(err);
        res.status(403).json(err)
      }
    });
  } catch (e) {
    console.log(err);
    res.status(403).json(err);
  }
};

exports.authenticateWithAdmin = async (req, res, next) => {
  try {
    console.log(req.headers);
    const cookies = cookie.parse(req.headers.cookie);

    const user_instance = JSON.parse(cookies.user);

    const userJ = user_instance.user_instance;

    // console.log(userJ);

    // const user = await User.findOne({
    //   where: {

    const userDB = await user.findOne({
      where: { id: userJ.id },
    });

    if (!userDB.admin) {
      return res.sendStatus(403);
    }

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      try {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      } catch (err) {
        console.log(err);
        res.sendStatus(403);
      }
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(403);
  }
};
