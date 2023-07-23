"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class otl_claimables extends Model {
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
  otl_claimables.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id : { type: DataTypes.INTEGER, foreignKey: true },
      email: DataTypes.STRING,
      nft_id: { type: DataTypes.INTEGER, foreignKey: true },
      number: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "otl_claimables",
    }
  );
  return otl_claimables;
};
