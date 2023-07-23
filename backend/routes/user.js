const express = require("express");

const router = express.Router();

const {
  getUser,
  verifyToken,
  getToken,
  getYourOrderHistory,
  getUserOrdersByPage,
  getYourNFTs,
  signup,
  login,
  addEmail,
  addWallet,
} = require("../controllers/user");

const { authenticate } = require("../middleware/user");

router.get("/getUser/:address", getUser);

router.post("/verifyToken", verifyToken);

router.get("/getToken", getToken);

router.post("/signup", signup);

router.post("/login", login);

router.get("/getYourOrderHistory/:id", authenticate, getYourOrderHistory);

router.get("/getUserOrdersByPage", authenticate, getUserOrdersByPage);

router.get("/getYourNFTs/:id", authenticate, getYourNFTs);

router.post("/addEmail", addEmail);

router.post("/addWallet", addWallet);

module.exports = router;
