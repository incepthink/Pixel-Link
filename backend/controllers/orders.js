const { orders, users, sku } = require("../models");

exports.getOrders = async (req, res) => {
  try {
    const userId = req.body.user.id;

    await orders
      .findAll({
        where: {
          user_id: userId,
        },
      })
      .then((orders) => {
        res.status(200).json(orders);
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const orderId = req.body.id;
    const userId = req.body.user.id;

    await orders
      .findOne({
        where: {
          id: orderId,
          user_id: userId,
        },
      })
      .then((order) => {
        res.status(200).json(order);
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    await orders.findAll().then((orders) => {
      res.status(200).json(orders);
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};


exports.getAllOrderSummary = async (req, res) => {
  try {
    const userId = req.body.userId;

    await orders
      .findAll({
        where: {
          user_id: userId,
        },
        attributes:['id','status']
      })
      .then((orders) => {
        res.status(200).json(orders);
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};


exports.createOrder = async (req, res) => {
  console.log("body",req.body)
  try {
    const userId = req.body.user_id;
    const shippingId = req.body.address_id;
    const product = req.body.product;
    const sku_local = req.body.sku;

    const nft_id = product.id;


    const sku_id = await sku.findOne({
      where: {
        product_id: nft_id,
        sku: sku_local,
      },
    });

    console.log("SKU",sku_id)

    const order = await orders.create({
      user_id: userId,
      shipping_id: shippingId,
      nft_id: nft_id,
      status: "pending",
      // variation_id: sku_id.id,
    });

    res.status(200).json(order);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

exports.updateOrder = async (req, res) => {
  try {
    console.log(req.body);

    const status = req.body.status;
    const orderId = req.body.order_id;

    await orders
      .update(
        {
          status: status,
        },
        {
          where: {
            id: orderId,
          },
        }
      )
      .then((order) => {
        res.status(200).json(order);
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.body.order_id;

    await orders
      .destroy({
        where: {
          id: orderId,
        },
      })
      .then((order) => {
        res.status(200).json(order);
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
