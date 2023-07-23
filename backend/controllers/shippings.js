const { shipping } = require("../models");

exports.saveNewShipping = async (req, res) => {
  try {
    const shipping_temp = await shipping.create(req.body);
    res.status(200).json(shipping_temp);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.getAllShippings = async (req, res) => {
  try {
    const shipping = await shipping.findAll();
    res.status(200).json(shipping);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.getShippingById = async (req, res) => {
  try {
    const shipping_temp = await shipping.findOne({
      where: {
        shipping_id: req.params.id,
      },
    });
    res.status(200).json(shipping_temp);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.getAllShippingsByUserId = async (req, res) => {
  try {
    const shipping_temp = await shipping.findAll({
      where: {
        user_id: req.params.id,
      },
    });
    res.status(200).json(shipping_temp);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.updateShipping = async (req, res) => {
  try {
    const shipping_temp = await shipping.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(shipping_temp);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.deleteShipping = async (req, res) => {
  try {
    const shipping_temp = await shipping.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(shipping_temp);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
