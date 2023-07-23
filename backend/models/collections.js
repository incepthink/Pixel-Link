"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class collections extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  collections.init(
    {
      contract_address: { type: DataTypes.STRING, allowNull: false , unique:true },
      website_link: DataTypes.STRING,
      count: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      blockchain: DataTypes.STRING,
      image: DataTypes.STRING,
      featured: DataTypes.BOOLEAN,
      sponsored: DataTypes.BOOLEAN,
      type: DataTypes.STRING,
      standard: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "collections",
    }
  );
  return collections;
};
