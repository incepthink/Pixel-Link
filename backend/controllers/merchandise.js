const express = require("express");

const {
  merch_variations_options,
  merch_variations,

  sku,
  merchandise,
  collections,
} = require("../models");

const { Op } = require("sequelize");

exports.addNewMerchandise = async (req, res) => {
  const {
    token_id,
    nft_image_url,
    opensea_link,
    description,
    collection_id,
    name,
    type,
    claimable,
  } = req.body;

  if (!token_id || !collection_id) {
    return res
      .status(400)
      .json({ msg: "Please send token_id and collection_id" });
  }

  try {
    // console.log(req.body);

    const merchFound = await merchandise.findOne({
      where: {
        token_id,
        collection_id,
      },
    });

    if (merchFound) {
      // const updatedMerch = await merchandise.update(
      //   {
      //     nft_image_url,
      //     opensea_link,
      //     owner_wallet,
      //     collection_id,
      //   },
      //   {
      //     where: {
      //       token_id,
      //       contract_address,
      //       collection_id,
      //     },
      //   }
      // );

      // res.json(updatedMerch);
      return res.status(400).json({ msg: "Merch for ID already exists" });
    } else {
      const newMerch = await merchandise.create({
        token_id,
        nft_image_url,
        opensea_link,
        description,
        collection_id,
        name,
        type,
        claimable,
      });
      return res.status(200).json(newMerch);
    }
  } catch (e) {
    console.log(e);
    res.json({ msg: e });
  }
};

exports.editMerchandise = async (req, res) => {
  const {
    id,
    token_id,
    nft_image_url,
    opensea_link,
    description,
    collection_id,
    name,
    type,
    claimable,
    price
  } = req.body;

  console.log("prioce",price)

  if (!id || !collection_id) {
    return res
      .status(400)
      .json({ msg: "Please send id and collection_id" });
  }

  try {
    // console.log(req.body);

    const merchFound = await merchandise.findByPk(id)

    if (merchFound) {
      const updatedMerch = await merchandise.update(
        {
          name,
          description,
          nft_image_url,
          opensea_link,
          token_id,
          // owner_wallet,
          collection_id,
          name,
          description,
          claimable,
          price
        },
        {
          where: {
            id:id
          },
        }
      );

      return res.status(200).json(updatedMerch);
    } else {
      return res.status(400).json({ msg: "Merch not found" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(String(e));
  }
};

exports.addNewVariation = async (req, res) => {
  console.log("HRER", req.body);
  try {
    const { merch_id, variation, variation_options } = req.body;

    console.log("Var options", variation_options);

    const newVariation = await merch_variations.create({
      merch_id: merch_id,
      name: variation.name,
    });

    const newVariationOptions = await merch_variations_options.bulkCreate(
      variation_options.map((option, index) => ({
        product_variant_id: newVariation.id,
        name: option.name,
        value_id: index + 1,
      }))
    );

    await makeCombinations(merch_id);

    res.status(201).json({
      message: "New variation added",
      newVariation,
      newVariationOptions,
    });
  } catch (e) {
    console.log("here", e);
    res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

exports.updateValuesOfVariation = async (req, res) => {
  try {
    const { product_variant_id, name } = req.body;

    const newValueIndex = await merch_variations_options
      .findAll({
        where: {
          product_variant_id,
        },
      })
      .then((variation) => {
        return variation.map((variation) => {
          return variation.value_id;
        });
      })
      .then((variation) => {
        return (
          variation.reduce((acc, curr) => {
            return Math.max(acc, curr);
          }, -Infinity) + 1
        );
      });

    const newVariationOption = await merch_variations_options.create({
      product_variant_id,
      name,
      value_id: newValueIndex,
    });

    res.status(201).json({
      message: "New variation option added",
      newVariationOption,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

const makeCombinations = async (merch_id) => {
  try {
    const merchVariations = await merch_variations
      .findAll({
        where: {
          merch_id,
        },
      })
      .then((variations) => {
        return variations.map((variation) => {
          return variation.dataValues;
        });
      });

    console.log(merchVariations);

    // get all the options for each variation with a promise

    const variationsOptions = await Promise.all(
      merchVariations.map(async (variation) => {
        return await merch_variations_options
          .findAll({
            where: {
              product_variant_id: variation.id,
            },
          })
          .then((options) => {
            return options.map((option) => {
              return option.dataValues;
            });
          });
      })
    );

    console.log("options :", variationsOptions);

    // find all permutations of the options for each variation

    function* permute(head, ...tail) {
      let remainder = tail.length ? permute(...tail) : [[]];
      for (let r of remainder) {
        for (let h of head) {
          yield [[h.name, h.value_id, h.product_variant_id], ...r];
        }
      }
    }
    // M+merchID+optionID+optionValueID....
    var index_counter = 0;
    for (let c of permute(...variationsOptions)) {
      var sku_name = "M" + merch_id + "-";
      index_counter++;
      console.log(index_counter, c);
      for (let i = 0; i < c.length; i++) {
        sku_name += "" + c[i][2] + c[i][1] + "-";
      }
      sku_name = sku_name.slice(0, -1);

      sku_id = await sku
        .findOrCreate({
          where: {
            sku: sku_name,
          },
          defaults: {
            product_id: merch_id,
            sku: sku_name,
            sku_id: index_counter,
          },
        })
        .then((sku) => {
          return sku.dataValues.id;
        })
        .catch((err) => {
          console.log(err);
        });

      console.log(sku_id);
    }

    // res.status(201).json({
    //   message: 'New variations added',
    // });
  } catch (err) {
    console.log(err);
    throw err;
    // res.status(500).json({
    //   message: 'Internal server error',
    //   error: e,
    // });
  }
};

exports.getMerchsForTable = async (req, res) => {
  try {
    var whereStatement = {};

    const pageNo = parseInt(req.query.pageNo) || 1;

    req.query.id ? (whereStatement.id = parseInt(req.query.id)) : null;

    req.query.collectionID && req.query.collectionID !== "null"
      ? (whereStatement.collection_id = parseInt(req.query.collectionID))
      : null;

    console.log(whereStatement);

    const merchs = await merchandise.findAll({
      where: whereStatement,
      limit: 50,
      offset: (pageNo - 1) * 50,
      include: [
        {
          model: collections,
          as: "collection",
          attributes: ["name"],
        },
      ],
    });

    res.status(200).json({
      message: "Merchandise fetched",
      merchs,
      totalPages: Math.ceil(merchs.length / 50),
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

exports.getMerchForTableWithVari = async (req, res) => {
  try {
    const merch_id = req.query.id;
    console.log("Fetch nft data", merch_id);

    const merch = await merchandise.findOne({
      where: {
        id: merch_id,
      },
      include: [
        {
          model: collections,
          as: "collection",
          attributes: ["name"],
        },
        {
          model: merch_variations,
          as: "variation",
          attributes: ["name", "id"],
          include: [
            {
              model: merch_variations_options,
              as: "options",
              attributes: ["name", "value_id"],
            },
          ],
        },
        {
          model: sku,
          as: "merchandise_skus",
          attributes: ["sku", "id", "sku_id", "stock_quantity"],
        },
      ],
    });
    console.log("HERE", merch);

    res.status(200).json({
      message: "Merchandise fetched",
      merch,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

exports.updateStockQuantity = async (req, res) => {
  try {
    const { sku_id, stock_quantity } = req.body;

    const sku_update = await sku.update(
      {
        stock_quantity: stock_quantity,
      },
      {
        where: {
          id: sku_id,
        },
      }
    );

    res.status(200).json({
      message: "Stock quantity updated",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
};

// exports.getVariationsTypes = async (req, res) => {
//   try {

//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       message: "Internal server error",
//       error: e,
//     });
//   }
// };

exports.getCollectionWise = async (req, res) => {
  console.log(req.params.page);
  const collection_id = req.params.collection_id;
  const collection = await merchandise.findAll({
    limit: 28,
    offset: req.params.page ? req.params.page * 28 : 0,
    where: {
      collection_id: collection_id,
    },
  });
  if (!collection) {
    return res.status(404).send("Collection not found");
  }
  // console.log(collection)
  res.json(collection);
};

exports.getAllMerch = async (req, res) => {
  console.log(req.params.page);
  // const collection_id = req.params.collection_id;
  const collection = await merchandise.findAll({
    limit: 28,
    offset: req.params.page ? req.params.page * 28 : 0,
    include: [
      {
        model: collections,
        as: "collection",
        attributes: ["id", "contract_address", "name","type"],
      },
    ],
  });
  if (!collection) {
    return res.status(404).send("Collection not found");
  }
  // console.log(collection)
  res.status(200).json(collection);
};

exports.getAllByIDs = async (req, res) => {
  // console.log(req.params.page);
  console.log(req.body);
  const tokens = req.body;
  let nfts = [];

  console.log("Tokens", tokens);
  try {
    await Promise.all(
      tokens.map(async (token) => {
        // const collection_id = req.params.collection_id;
        const res = await merchandise.findOne({
          raw: true,
          where: {
            token_id: token.id,
            collection_id: token.contract_id,
          },
          attributes: [
            "id",
            "token_id",
            "name",
            "nft_image_url",
            "type",
            "opensea_link",
            "claimable"
          ],
          include: [
            {
              model: collections,
              as: "collection",
              attributes: ["id", "contract_address", "name","type"],
            },
          ],
        });
        console.log(res);
        nfts.push(res);
        if (!res) {
          console.log("Not Found for", token);
          // return res.status(404).send('Collection not found');
        }
      })
    );

    // console.log(nfts);

    // console.log(collection)
    res.status(200).json(nfts);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.getSingleMerch = async (req, res) => {
  console.log(req.params.id ,"HERER");
  try {
    const id = req.params.id;

    const merchandise_single = await merchandise.findByPk(id, {
      include: [
        {
          model: collections,
          as: "collection",
          attributes: ["id", "contract_address", "name","type",],
        },
      ],
    });
    if (!merchandise_single) {
      return res.status(400).json({ msg: "Merch not found for ID" });
    }
    console.log(merchandise_single)
    res.status(200).json(merchandise_single);

    // res.json(merchandise_single.data);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.deleteMerch = async (req, res) => {
  try {
    const id = req.params.id;
    const merch = await merchandise.findByPk(id);
    if (!merch) {
      return res.status(400).json({ msg: "Merch not found for ID" });
    }
    const merch_delete = await merch.destroy();
    console.log(merch_delete);
    res.status(200).json({ msg: "Merch deleted" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Error deleting merch" });
  }
}