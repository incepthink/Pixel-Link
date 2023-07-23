"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class merchandise extends Model {
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
  merchandise.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        foreignKey: true,
      },
      token_id: { type: DataTypes.INTEGER, allowNull: false },
      claimable: { type: DataTypes.BOOLEAN, defaultValue: false },
      nft_image_url: DataTypes.STRING(500),
      opensea_link: DataTypes.STRING(500),
      description: DataTypes.STRING(500),
      name: DataTypes.STRING(500),
      type: DataTypes.STRING(500),
      collection_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      price : {
        type: DataTypes.INTEGER,
        defaultValue : 0
      }
    },
    {
      sequelize,
      modelName: "merchandise",
    }
  );
  return merchandise;
};
