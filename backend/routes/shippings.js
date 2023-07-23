const express = require("express");
const router = express.Router();

const {
  saveNewShipping,
  getAllShippings,
  getShippingById,
  updateShipping,
  deleteShipping,
  getAllShippingsByUserId,
} = require("../controllers/shippings");

const { authenticate, authenticateWithAdmin } = require("../middleware/user");

router.get("/allAllShipping", authenticate, getAllShippings);

router.post("/newShipping", authenticate, saveNewShipping);

router.get("/shipping/:id", authenticate, getShippingById);

router.get("/shipping/user/:id", authenticate, getAllShippingsByUserId);

router.put("/shipping/:id", authenticate, updateShipping);

router.delete("/shipping/:id", authenticate, deleteShipping);

module.exports = router;
