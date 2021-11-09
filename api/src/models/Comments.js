// Modelo de comentarios
const { DataTypes, Sequelize } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('comment',{
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    checked: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		}
  },{
    timestamps: false,
  });
};