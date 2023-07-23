const express = require("express");
const router = express.Router();
const {
  getOverview,
  makeAdmin,
  removeAdmin,
  getUsers,
} = require("../controllers/admin");

const {
  addNewVariation,
  // makeCombinations,
  updateValuesOfVariation,
  updateStockQuantity,
} = require("../controllers/merchandise");

const { authenticate } = require("../middleware/user");

router.get("/", authenticate, getOverview);

router.post("/makeAdmin", authenticate, makeAdmin);

router.post("/removeAdmin", authenticate, removeAdmin);

router.get("/getUsers", authenticate, getUsers);

router.post("/addNewVariation", authenticate, addNewVariation);

// router.post("/makeCombinations", authenticate, makeCombinations);

router.post("/updateValuesOfVariation", authenticate, updateValuesOfVariation);

router.post("/updateStockQuantity", authenticate, updateStockQuantity);

module.exports = router;
