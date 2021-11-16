require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const BulkTags = require("../Bulk.json");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`,
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
const {
  User,
  Post,
  Comment,
  Privileges,
  Tags,
  Post_User,
  Comment_Post,
  User_Comment,
  Likes,
  Message,
  Conversation,
  Support,
  Msg,
  Conver,
  ChallengeComment,
  ChallengePost,
} = sequelize.models;

//Comentar para no floodear la base de datos con tags :*
//Tags.bulkCreate(BulkTags, { returning: true });

// Aca vendrian las relaciones
//Usuario
// Relacion 1 a M  - User -> Post
User.hasMany(Post, { onDelete: "CASCADE" });
Post.belongsTo(User, { onDelete: "CASCADE" });

//Relacion 1 a M - User -> ChallengePost
User.hasMany(ChallengePost, { onDelete: "CASCADE" });
ChallengePost.belongsTo(User, { onDelete: "CASCADE" });

//Relacion 1 a 1 - User -> Privileges
User.hasOne(Privileges);

//Relacion 1 a M - User -> Comment
User.belongsToMany(Comment, { through: User_Comment, onDelete: "CASCADE" });
Comment.belongsTo(User, { through: User_Comment, onDelete: "CASCADE" });

//Challenge
//Relacion M a 1 - ChallengePost -> ChallengeComment

ChallengePost.belongsToMany(ChallengeComment, {
  through: "Challenge_PC",
  onDelete: "CASCADE",
});
ChallengeComment.belongsTo(ChallengePost, {
  through: "Challenge_PC",
  onDelete: "CASCADE",
});

//Relacion M a M - ChallengePost -> Tags
ChallengePost.belongsToMany(Tags, {
  through: "Challenge_PT",
  onDelete: "CASCADE",
});
Tags.belongsToMany(ChallengePost, {
  through: "Challenge_PT",
  onDelete: "CASCADE",
});

//Relacion 1 a M User -> ChallengeComment

User.hasMany(ChallengeComment, { onDelete: "CASCADE" });
ChallengeComment.belongsTo(User, { onDelete: "CASCADE" });

//Post
//Relacion M a 1 - Post -> Comment
Post.belongsToMany(Comment, { through: Comment_Post, onDelete: "CASCADE" });
Comment.belongsTo(Post, { through: Comment_Post, onDelete: "CASCADE" });

//Relacion M a M - Post -> Tags
Post.belongsToMany(Tags, { through: "Post_Tags", onDelete: "CASCADE" });
Tags.belongsToMany(Post, { through: "Post_Tags", onDelete: "CASCADE" });

// //Conversaciones
Conversation.belongsToMany(User, {
  through: "User_Conversations",
  onDelete: "CASCADE",
});
User.belongsToMany(Conversation, {
  through: "User_Conversations",
  onDelete: "CASCADE",
});

// //Messages
User.hasMany(Message, { as: "usserMessanges" });
Message.belongsTo(User);
// Conversation.hasMany(Message, { as: "conversationMessages" })
// Message.belongsTo(Conversation);

//Likes
User.hasMany(Likes, { as: "postLikes" });
Post.hasMany(Likes, { as: "userLikes" });
Likes.belongsTo(User);
Likes.belongsTo(Post);

//Follow

User.belongsToMany(User, {
  foreignKey: "userId",
  as: "followers",
  through: "User_Follow",
});
User.belongsToMany(User, {
  foreignKey: "followerId",
  as: "following",
  through: "User_Follow",
});

//Support 1 a M 'Un mensaje pertenece a un usuario'
User.belongsToMany(Support, { through: "Support_User", onDelete: "CASCADE" });
Support.belongsTo(User, { through: "Support_User", onDelete: "CASCADE" });

// prueba de mensajes y conversaciones
Msg.belongsTo(User);
// User Conversation
Conver.belongsToMany(User, { through: "User_Convers" });
User.belongsToMany(Conver, { through: "User_Convers" });
// Conversation
Msg.belongsTo(Conver);
Conver.hasMany(Msg);

//Friends
User.belongsToMany(User, { as: "Friends", through: "friends" });
User.belongsToMany(User, {
  as: "send",
  through: "friendRequests",
  foreignKey: "receivedId",
  onDelete: "CASCADE",
});
User.belongsToMany(User, {
  as: "received",
  through: "friendRequests",
  foreignKey: "sendId",
  onDelete: "CASCADE",
});

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
