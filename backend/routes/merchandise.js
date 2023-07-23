const express = require("express");
const router = express.Router();

const { collections, merchandise } = require("../models");

const {
  getMerchsForTable,
  getMerchForTableWithVari,
  addNewMerchandise,
  editMerchandise,
  getCollectionWise,
  getAllMerch,
  getAllByIDs,
  getSingleMerch,
  deleteMerch
} = require("../controllers/merchandise");

router.get("/", async (req, res) => {
  const collectionsAll = await collections.findAll({
    limit: 30,
    offset: req.params.offset ? req.params.offset : 0,
  });
  res.json(collectionsAll);
});

router.post("/addNewMerch", addNewMerchandise);
router.post("/editMerch", editMerchandise);

router.get("/getAll/:page", getAllMerch);
router.post("/getallbyIDs", getAllByIDs);

router.get("/collectionWise/:collection_id/:page", getCollectionWise);

router.get("/collectionWise/:collection_id/:token_id", async (req, res) => {
  const collection_id = req.params.collection_id;
  const token_id = req.params.token_id;
  const collection = await collections.findOne({
    where: {
      id: collection_id,
    },
  });
  if (!collection) {
    return res.status(404).send("Collection not found");
  }

  const merchandise_single = await merchandise.findAll({
    where: {
      collection_id: collection_id,
      token_id: token_id,
    },
  });
  res.json(merchandise_single);
});

router.get("/singleMerch/:id", getSingleMerch);

router.get("/forTable", getMerchsForTable);

router.get("/forTableWithVari", getMerchForTableWithVari);

router.delete("/deleteMerch/:id", deleteMerch);

module.exports = router;
