const { collections, merchandise } = require("../models/");

exports.test = async (req, res) => {
  return res.status(200).json({ msg: "Collection updated" });
};

exports.addNewCollection = async (req, res) => {
  try {
    console.log(req.body);
    const {
      contract_address,
      website_link,
      blockchain,
      name,
      description,
      image,
      type,
      standard
    } = req.body;

    if (!contract_address || !name) {
      return res.status(400).json({ msg: "Missing Required fields" });
    }

    const collectionFound = await collections.findOne({
      where: {
        contract_address,
      },
    });

    if (collectionFound) {
      // const collection = await collections.update(
      //   {
      //     contract_address,
      //     website_link,
      //     count,
      //     name,
      //     description,
      //     image,
      //     banner_image,
      //   },
      //   {
      //     where: {
      //       contract_address,
      //     },
      //   }
      // );

      return res.status(400).json({ msg: "Collection Exists" });
    }

    const collection = await collections.create({
      contract_address,
      website_link,
      blockchain,
      name,
      description,
      image,
      type,
      standard
    });

    return res.status(200).json({ msg: "Collection created" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: err });
  }
};

exports.editCollection = async (req, res) => {

  console.log(req.body);
  const {
    id,
    contract_address,
    website_link,
    blockchain,
    name,
    description,
    image,
  } = req.body;

  if (!contract_address || !name) {
    return res.status(400).json({ msg: "Missing Required fields" });
  }

  try {
    const collectionFound = await collections.findByPk(id);

    if (collectionFound) {
      const collection = await collections.update(
        {
          contract_address,
          website_link,
          blockchain,
          name,
          description,
          image,
        },
        {
          where: {
            id,
          },
        }
      );

      return res.status(200).json({ msg: "Collection updated" });
    } else {
      return res.status(400).json({ msg: "Collection was not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(String(err));
  }
};

exports.toggleFeatured = async (req, res) => {
  const { id } = req.body;
  const collection = await collections.findOne(id);
  collection.featured = collection.featured ? false : true;
  await collection.save();
  res.status(200).json({ msg: "success" });
};

exports.getFeatured = async (req, res) => {
  const collection = await collections.findOne({ featured: true });
  res.status(200).json(collection);
};

exports.merchFromFeaturedCollection = async (req, res) => {
  const collection = await collections.findOne({
    where: { featured: true },
  });

  // check if collection is null
  if (collection === null) {
    return res.status(200).json({ msg: "No featured collection" });
  }

  // return random 5 merch from collection
  var merch = await merchandise.findAll({
    limit: 3,
    where: {
      collection_id: collection.id,
    },
  });

  const ans = {
    merch,
    collection_name: collection.name,
    description: collection.description,
  };

  res.status(200).json(ans);
};

exports.getLatest = async (req, res) => {
  const collection = await collections.findOne({}).sort({ createdAt: -1 });
  res.status(200).json(collection);
};

exports.getAllCollectionNames = async (req, res) => {
  const collection = await collections.findAll({
    attributes: ["id", "contract_address", "name"],
  });
  res.status(200).json(collection);
};

exports.toggleSponsored = async (req, res) => {
  const { id } = req.body;
  const collection = await collections.findOne(id);
  collection.sponsored = collection.sponsored ? false : true;
  await collection.save();
  res.status(200).json({ msg: "success" });
};

exports.getSponsored = async (req, res) => {
  const collection = await collections.findOne({
    where: { sponsored: true },
  });
  res.status(200).json(collection);
};

exports.deleteCollection = async (req, res) => {
  console.log(req.body);
  const { id } = req.body.data;
  console.log(id);
  try {
    const collection = await collections.findOne({
      where: {
        id,
      },
    });

    if (!collection) {
      return res.status(404).send("Collection not found");
    }

    const merch = await merchandise.findAll({
      where: {
        collection_id: collection.dataValues.id,
      },
    });

    for (let i = 0; i < merch.length; i++) {
      await merch[i].destroy();
    }
    await collection.destroy();

    res.status(200).json({ message: "Collection deleted" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Unable to Delete Collection" });
  }
};
