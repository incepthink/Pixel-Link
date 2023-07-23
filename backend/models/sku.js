"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class sku extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  sku.init(
    {
      product_id: DataTypes.INTEGER,
      sku_id: DataTypes.INTEGER,
      sku: DataTypes.STRING,
      stock_quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "sku",
    }
  );
  return sku;
};
