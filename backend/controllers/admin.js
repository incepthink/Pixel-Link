const express = require("express");

const {
  user,
  orders,
  merchandise,
  shipping,
  collections,
} = require("../models");

exports.getOverview = async (req, res) => {
  const users = await user
    .findAll({
      attributes: ["id", "wallet_address", "admin"],
    })
    .then((users) => {
      return users.slice(0, 5);
    });

  const ordersCount = await orders.count();
  const merchandiseCount = await merchandise.count();
  const shippingCount = await shipping.count();
  const collectionCount = await collections.count();

  res.status(200).json({
    users,
    ordersCount,
    merchandiseCount,
    shippingCount,
    collectionCount,
  });
};

exports.makeAdmin = async (req, res) => {
  const { user_id } = req.body;

  await user.update(
    {
      admin: true,
    },
    {
      where: {
        id: user_id,
      },
    }
  );

  res.status(200).json({
    message: "Admin successfully added",
  });
};

exports.removeAdmin = async (req, res) => {
  const { user_id } = req.body;

  await user.update(
    {
      admin: false,
    },
    {
      where: {
        id: user_id,
      },
    }
  );

  res.status(200).json({
    message: "Admin successfully removed",
  });
};

exports.getUsers = async (req, res) => {
  const users = await user
    .findAll({
      attributes: ["id", "wallet_address", "admin"],
    })
    .then((users) => {
      return users;
    });

  res.status(200).json({
    users,
  });
};
