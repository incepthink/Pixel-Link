const express = require("express");

const router = express.Router();

const axios = require("axios");

const { authenticate } = require("../middleware/user");

const {
  toggleFeatured,
  getFeatured,
  merchFromFeaturedCollection,
  getLatest,
  toggleSponsored,
  deleteCollection,
  getSponsored,
  addNewCollection,
  getCollection,
  editCollection,
  test,
  getAllCollectionNames
} = require("../controllers/collection");

const { collections, merchandise } = require("../models");

function range(start, end) {
  end = end - 1;
  let token_string = "";
  for (let i = start; i <= end; i++) {
    token_string += "&" + "token_ids=" + i;
  }
  token_string = token_string.substring(1);
  return token_string;
}

router.get("/", async (req, res) => {
  // get all the collections

  collections.findAll({}).then((collections) => {
    res.json(collections);
  });
});

router.get("/byId/:collection_id", async (req, res) => {
  // get collection with id
  const collection_id = req.params.collection_id;
  const collection = await collections.findOne({
    where: {
      id: collection_id,
    },
  });
  if (!collection) {
    return res.status(404).send("Collection not found");
  }
  res.json(collection);
});

router.post("/addNewCollection", authenticate, addNewCollection);
router.post("/editCollection", authenticate, editCollection);
router.post("/test", authenticate, test);

router.post("/toggleFeatured", authenticate, toggleFeatured);

router.get("/getFeatured", getFeatured);
router.get("/getallNames", getAllCollectionNames);

router.get("/merchFromFeaturedCollection", merchFromFeaturedCollection);

router.post("/toggleSponsored", authenticate, toggleSponsored);

router.get("/getSponsored", getSponsored);

router.get("/getLatest", getLatest);

router.post("/deleteCollection", authenticate, deleteCollection);

module.exports = router;
