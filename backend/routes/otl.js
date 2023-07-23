const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/user");

const {
    createLink,
    claim,
    getDetails
  } = require("../controllers/otl");

router.post("/createLink", createLink);
router.post("/claim", claim);
router.get("/getDetails", getDetails);

module.exports = router;