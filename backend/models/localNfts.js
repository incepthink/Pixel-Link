"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class localnfts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // one to one join with orders
    }
  }
  localnfts.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        foreignKey: true,
      },
      user_id: DataTypes.INTEGER,
      nft_id: DataTypes.INTEGER,
      number: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "localnfts",
    }
  );
  return localnfts;
};
