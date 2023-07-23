"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.shipping.hasMany(db.orders, { as: "order", foreignKey: "shipping_id" });
db.orders.belongsTo(db.shipping, { as: "shipping", foreignKey: "shipping_id" });

db.merchandise.hasMany(db.orders, {
  as: "order",
  foreignKey: "id",
});

db.orders.belongsTo(db.merchandise, {
  as: "merchandise",
  foreignKey: "nft_id",
});

db.collections.hasMany(db.merchandise, {
  as: "collection",
  foreignKey: "collection_id",
});

db.merchandise.belongsTo(db.collections, {
  as: "collection",
  foreignKey: "collection_id",
});

db.merch_variations.belongsTo(db.merchandise, {
  as: "variation",
  foreignKey: "merch_id",
});

db.merchandise.hasMany(db.merch_variations, {
  as: "variation",
  foreignKey: "merch_id",
});

// bridge between merch_variations_options and merch_variations

db.merch_variations_options.belongsTo(db.merch_variations, {
  as: "options",
  foreignKey: "product_variant_id",
});



db.merch_variations.hasMany(db.merch_variations_options, {
  as: "options",
  foreignKey: "product_variant_id",
});


db.sku.belongsTo(db.merchandise, {
  as: "merchandise_skus",
  foreignKey: "product_id",
});

db.merchandise.hasMany(db.sku, {
  as: "merchandise_skus",
  foreignKey: "product_id",
});

db.orders.belongsTo(db.sku,{
  as: "sku",
  foreignKey: "variation_id",
})


db.sku.hasMany(db.orders, {
  as: "orders",
  foreignKey: "id",
});

db.merchandise.hasMany(db.localnfts, {
  as: "localnft",
  foreignKey: "id",
});

db.localnfts.belongsTo(db.merchandise, {
  as: "merchandise",
  foreignKey: "nft_id",
});

db.merchandise.hasMany(db.otl_claimables, {
  as: "otl_claimables",
  foreignKey: "id",
});

db.otl_claimables.belongsTo(db.merchandise, {
  as: "merchandise",
  foreignKey: "nft_id",
});

db.user.hasMany(db.otl_claimables, {
  as: "otl_claimables",
  foreignKey: "id",
});

db.otl_claimables.belongsTo(db.user, {
  as: "user",
  foreignKey: "user_id",
});


db.sequelize = sequelize;

module.exports = db;
