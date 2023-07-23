'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class merch_variations_options extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  merch_variations_options.init({
    product_variant_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    value_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'merch_variations_options',
  });
  return merch_variations_options;
};

