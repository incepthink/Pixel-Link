const express = require("express");
const router = express.Router();

const {
  createOrder,
  updateOrder,
  getOrders,
  getOrder,
  getAllOrders,
  deleteOrder,
  getAllOrderSummary,
} = require("../controllers/orders");

const { authenticate, authenticateWithAdmin } = require("../middleware/user");

router.get("/", authenticate, getAllOrders);

router.post("/getOrders", authenticate, getOrders);

router.post("/getAllOrderSummary", authenticate, getAllOrderSummary);


router.post("/createOrder", authenticate, createOrder);

router.put("/updateOrder", authenticate, updateOrder);

router.post("/getOrderById", authenticate, getOrder);

router.delete("/deleteOrder", authenticate, deleteOrder);

module.exports = router;
