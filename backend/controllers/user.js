const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const express = require("express");
const { recoverPersonalSignature } = require("eth-sig-util");
const rug = require("random-username-generator");
const bcrypt = require("bcrypt")


const { user, orders, merchandise, shipping, sku } = require("../models");

const axios = require("axios");

exports.getToken = (req, res) => {
  try {
    req.session.token = crypto.randomBytes(32).toString("hex");

    req.session.save((err) => {
      console.log(err);
    });

    // console.log("token",req.session.token)

    res.status(200).json({
      message:
        "Hey, Sign this message to prove you have access to this wallet, this is your token " +
        req.session.token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.verifyToken = async (req, res) => {
  const nounce =
    "Hey, Sign this message to prove you have access to this wallet, this is your token " +
    req.session.token;

  console.log("TOKEN, VERIFY",req.body);

  const signature = recoverPersonalSignature({
    data: nounce,
    sig: req.body.signature,
  });

  console.log(signature)

  // if (signature.toLowerCase() != req.body.address.toLowerCase()) {
  if (false) {
    res.status(401).json({
      message: "Invalid signature",
    });
  } else {
    // save user in data base if not exist

    const userExist = await user.findOne({
      where: {
        wallet_address: req.body.address,
      },
    });
    if (!userExist) {
      var new_username = rug.generate();

      const newUser = await user.create({
        wallet_address: req.body.address,
        username: new_username,
      });
    }

    const token = jwt.sign(
      { address: req.body.address },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      message: "Token verified",
      token,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    console.log(req.params);
    const user_instance = await user.findOne({
      where: {
        wallet_address: req.params.address,
      },
    });
    res.status(200).json(
      user_instance
    );
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// add this to the below function
// SELECT orders.id,orders.size,orders.color,shippings.city,shippings.country,shippings.name,shippings.phone_number,shippings.state,shippings.street_address_1,merchandises.token_id
// FROM orders
// INNER JOIN shippings on orders.user_id=shippings.user_id

// inner join merchandises on orders.nft_id=merchandises.id;

exports.getYourOrderHistory = async (req, res) => {
  try {
    const user_id = req.params.id;

    const orders_instance = await orders.findAll({
      where: {
        user_id,
      },

      include: [
        {
          model: merchandise,
          attributes: ["token_id", "nft_image_url", "name"],
          as: "merchandise",
        },
        {
          model: shipping,

          attributes: [
            "city",
            "country",
            "name",
            "phone_number",
            "state",
            "street_address_1",
          ],
          as: "shipping",
        },
        {
          model: sku,

          attributes: ["sku"],
          as: "sku",
        },
      ],
    });

    console.log(orders_instance);

    res.status(200).json({
      orders_instance,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};


exports.getUserOrdersByPage = async (req, res) => {
  const { user_id, page, limit } = req.query;
  const offset = ((page - 1) * limit);
  try {
    const order = await orders.findAll({
      where: {
        user_id: user_id,
      },
      limit: Number(limit),
      offset: offset,
      include: [
        {
          model: merchandise,
          attributes: ["token_id", "nft_image_url", "name"],
          as: "merchandise",
        },
        {
          model: shipping,
          attributes: [
            "city",
            "country",
            "name",
            "phone_number",
            "state",
            "street_address_1",
          ],
          as: "shipping",
        },
        {
          model: sku,
          attributes: ["sku"],
          as: "sku",
        },
      ],
    });

    const allOrders = await orders.count();

    const totalPages = Math.ceil(allOrders / limit);

    res.status(200).json({
      message: "Orders fetched",
      order,
      totalPages: totalPages,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: "Error Fetching Orders",
    });
  }
}

// this method is temporary, need to shift this to sql
exports.getYourNFTs = async (req, res) => {
  try {
    const user_id = req.params.id;

    const wallet_address = await user
      .findOne({
        where: {
          id: user_id,
        },
      })
      .then((user) => {
        return user.wallet_address;
      });

    console.log(wallet_address);

    const options = {
      method: "GET",
      url:
        "https://api.opensea.io/api/v1/assets?owner=" +
        wallet_address +
        "&order_direction=desc&offset=0&limit=20",
    };

    const response = await axios(options).then((response) => {
      return response.data;
    });

    // console.log(response);

    res.status(200).json({
      response,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

exports.signup = async (req, res) => {
  let {  email, password } = req.body;
  const password_hash = await bcrypt.hash(password,10);
  try {
    const userExist = await user.findOne({
      where: {
        email: email,
      },
    });
    if (userExist) throw {message: "User already exist"}

    const user_instance = await user.create({
      email,
      password_hash,
    });

    const token = jwt.sign(
      { email: email },
      process.env.JWT_SECRET
    );
    // console.log("token",token, user_instance);

    res.status(200).json({
      token,
      user_instance
    });
    
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

exports.login = async (req, res) => {
  let {  email, password } = req.body;
  const password_hash = await bcrypt.hash(password,10);
  try {

    const user_instance = await user.findOne({
      where: {
        email: email,
      },
    });
    if (!user_instance) throw {message: "User does not exist"}

    if( !(await bcrypt.compare(password,user_instance.password_hash) ))  throw {message: "Wrong Password"}


    const token = jwt.sign(
      { email: email },
      process.env.JWT_SECRET
    );
    // console.log("token",token, user_instance);

    res.status(200).json({
      token,
      user_instance
    });
    
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

exports.addEmail = async (req, res) => {
  let { user_Id, email, password } = req.body;
  console.log(user_Id, email, password);

  if(!user_Id){
    console.log("No User Id");
    throw {message: "No User Id"};
  }

  const password_hash = await bcrypt.hash(password,10);
  try {
    const userExist = await user.findOne({
      where: {
        email: email,
      },
    });
    
    if (userExist){
      console.log("User already exist");
      throw {message: "User already exist"};
    }

    const user_update = await user.update(
      {
        email,
        password_hash,
      },
      {
        where: {
          id: user_Id,
        },
      },
    );
    
    if (!user_update){
      console.log("No Such User");
      throw {message: "No Such User"};
    }

    const token = jwt.sign(
      { email: email },
      process.env.JWT_SECRET
    );
    
    const user_instance = await user.findOne({
      where: {
        id: user_Id,
      },
    });
    return res.status(200).json({
      token,
      user_instance
    });
    
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

exports.addWallet = async (req, res) => {
  const {user_Id, wallet_address} = req.body;
  try {
    const user_exists = await user.findOne(
      {
        where: {
          wallet_address: wallet_address,
        }
      }
    )

    if(user_exists){
      console.log(wallet_address, "The wallet address exists on some other account");
      throw {message: "The wallet address exists on some other account"};
    }

    const user_update = await user.update(
      {
        wallet_address: wallet_address,
      },
      {
        where: {
          id: user_Id,
        },
      },
    );

    if (!user_update){
      console.log("No Such User");
      throw {message: "No Such User"};
    }

    const token = jwt.sign(
      { wallet_address: wallet_address },
      process.env.JWT_SECRET
    );
    
    const user_instance = await user.findOne({
      where: {
        id: user_Id,
      },
    });
    return res.status(200).json({
      token,
      user_instance
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: e.message,
    });
  }
};