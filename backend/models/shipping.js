"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class shipping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // many to one join with orders
      
    }
  }
  shipping.init(
    {
      shipping_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      country: DataTypes.STRING,
      state: DataTypes.STRING,
      city: DataTypes.STRING,
      street_address_1: DataTypes.STRING,
      street_address_2: DataTypes.STRING,
      name: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "shipping",
    }
  );
  return shipping;
};
