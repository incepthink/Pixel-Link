"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  orders.init(
    {
      order_id: {
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
      },
      user_id: DataTypes.INTEGER,
      nft_id: DataTypes.INTEGER,
      shipping_id: DataTypes.INTEGER,
      variation_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "orders",
    }
  );
  return orders;
};
