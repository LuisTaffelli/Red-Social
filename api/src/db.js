require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);
const basename = path.basename(__filename);

const modelDefiners = [];

fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// Importacion de modelos
const { User, 
  Post, 
  Comment, 
  Privileges,
  Tags, 
  Post_User,
  Comment_Post,
  User_Comment } = sequelize.models;


// Aca vendrian las relaciones
//Usuario
// Relacion 1 a M  - User -> Post
User.hasMany(Post, {onDelete: 'CASCADE'})
Post.belongsTo(User, {as:"user",onDelete: 'CASCADE'})

//Relacion 1 a 1 - User -> Privileges
User.hasOne(Privileges)

//Relacion 1 a M - User -> Comment
User.hasMany(Comment, {onDelete: 'CASCADE'})
Comment.belongsTo(User, {onDelete: 'CASCADE'})

//Post
//Relacion M a 1 - Post -> Comment
Post.hasMany(Comment, { onDelete: 'CASCADE'})
Comment.belongsTo(Post, {onDelete: 'CASCADE'})

//Relacion M a M - Post -> Tags
Post.belongsToMany(Tags, {through:'Post_Tags', onDelete: 'CASCADE'})
Tags.belongsToMany(Post, {through:'Post_Tags', onDelete: 'CASCADE'})

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
