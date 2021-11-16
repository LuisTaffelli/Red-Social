const axios = require("axios");
const {
  User,
  Post,
  Comment,
  User_Comment,
  Comment_Post,
  Post_User,
  Likes,
  User_Follow,
  Support,
  Privileges,
} = require("../db.js");
const db = require("../db.js");
const { Sequelize, where } = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

const likeUserPost = {
  model: Likes,
  as: "postLikes",
  attributes: ["postIdPost"],
  include: { model: Post, attributes: ["title"] },
};
const likePostUser = {
  model: Likes,
  as: "userLikes",
  attributes: ["userId"],
  include: { model: User, attributes: ["username"] },
};
const followersInfo = {
  model: User,
  as: "followers",
  attributes: ["id", "username", "image", "name", "lastname"],
};
const followedInfo = {
  model: User,
  as: "following",
  attributes: ["id", "username", "image", "name", "lastname"],
};

//fn
const DB_findUsersEmail = async (email) => {
  if (email == null || email == undefined) return null;
  const findUserEmail = await User.findOne({ where: { email } }).catch(
    (e) => null
  );
  return findUserEmail;
};
const DB_findUsersUsername = async (username) => {
  if (username == null || username == undefined) return null;
  const findUsername = await User.findOne({ where: { username } }).catch(
    (e) => null
  );
  return findUsername;
};
const DB_findUserAll = async (query) => {
  const findUserAll = await User.findAll({
    //attributes:["id","name","username","lastname","image","gitaccount"],
    include: [
      likeUserPost,
      Comment,
      { model: Post, include: likePostUser },
      followersInfo,
      followedInfo,
    ],
  });
  return findUserAll;
};
const DB_findUserCreated = async (date) => {
  const { username, email } = date;
  let errors = {};
  const byEmail = await User.findOne({ where: { email } });
  const byUsername = await User.findOne({ where: { username } });
  if (byEmail) errors = { ...errors, email: "Is already in use" };
  if (byUsername) errors = { ...errors, username: "Is already in use" };
  return errors;
};
const DB_findUserQuery = async (query) => {
  console.log(query);
  const findUser = await User.findAll({
    where: {
      [Op.or]: [
        {
          username: { [Op.iLike]: query.username + "%" },
        },
        {
          email: { [Op.iLike]: query.email },
        },
      ],
    },
    //attributes:["id","name","username","lastname","image","gitaccount"],
    include: [
      { model: Post, include: likePostUser },
      Comment,
      "postLikes",
      followersInfo,
      followedInfo,
      { model: User, as: "Friends", attributes: ["username", "image"] },
    ],
  });
  return findUser;
};
const DB_findUserParams = async (params) => {
  const findUser = await User.findOne({
    where: {
      username: params,
    },
    //attributes:["id","name","username","lastname","image","gitaccount"],
    include: [
      { model: Post, include: likePostUser },
      Comment,
      likeUserPost,
      followersInfo,
      followedInfo,
      { model: User, as: "Friends", attributes: ["username", "image"] },
    ],
  });
  return findUser;
};
const DB_UserID = async (username) => {
  const UserID = await User.findOne({
    where: {
      username,
    },
    //attributes:["id","name","username","lastname","image","gitaccount"],
    include: [{ model: Post, include: likePostUser }, Comment],
  });
  return UserID;
};
const DB_findUserEmailOrUsername = async (data) => {
  const findUser = await User.findOne({
    where: {
      [Op.or]: [
        {
          username: data,
        },
        {
          email: data,
        },
      ],
    },
  });
  return findUser;
};
const DB_Allcomments = async (username) => {
  user = await DB_UserID(username);
  const final = user.comments.map((comment) => {
    if (comment.ban === false) return comment.dataValues;
  });
  return final;
};

const DB_Commentedit = async (id, content_data) => {
  const updatedComment = await Comment.findOne({ where: { id: id } });
  updatedComment.content = content_data;
  await updatedComment.save();
  return updatedComment;
};

const DB_Commentdestroy = async (id) => {
  try {
    const eraseComment = await Comment.findOne({ where: { id: id } });
    await eraseComment.destroy();
    return "Deleted Succesfully";
  } catch (e) {
    throw new Error("We had a problem with your Delete");
  }
};

const DB_Postsearch = async ({ username, id }) => {
  try {
    if (username === undefined && id === undefined) {
      var post_search = await Post.findAll({
        where: {
          ban: false,
        },
        include: [
          { model: User, attributes: ["image", "username"] },
          {
            model: Comment,
            include: [{ model: User, attributes: ["image", "username"] }],
          },
          {
            model: Likes,
            as: "userLikes",
            include: [{ model: User, attributes: ["username"] }],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      console.log(post_search.length);
      return post_search;
    }
    if (username === undefined && id) {
      var post_search = await Post.findOne({
        where: {
          idPost: id,
          ban: false,
        },
        include: [
          { model: User, attributes: ["image", "username"] },
          { model: Comment, where: { ban: false } },
        ],
        order: [["createdAt", "DESC"]],
      });
      return post_search;
    } else if (id === undefined && username) {
      let userDB = await DB_UserID(username);
      var post_search = await Post.findAll({
        where: {
          userId: userDB.id,
          ban: false,
        },
        include: [
          { model: User, attributes: ["image", "username"] },
          { model: Comment, where: { ban: false } },
        ],
        order: [["createdAt", "DESC"]],
      });
      return post_search;
    } else {
      return "Post not found";
    }
  } catch (e) {
    throw new Error("We had a problem with the search");
  }
};

const DB_Postdestroy = async (id) => {
  try {
    const erasePost = await Post.findOne({ where: { idPost: id } });
    await erasePost.destroy();
    return "Deleted Succesfully";
  } catch (e) {
    throw new Error("We had a problem with your Delete");
  }
};

const DB_Postedit = async (id, { title, content, tag, image, likes }) => {
  // console.log(id, title, content, tag, image, likes, 'Entre a utils')
  const updatedPost = await Post.findOne({ where: { idPost: id } });

  content ? (updatedPost.content = content) : null;
  title ? (updatedPost.title = title) : null;
  tag ? (updatedPost.tag = tag) : null;
  image ? (updatedPost.image = image) : null;
  likes ? (updatedPost.likes = likes) : null;

  await updatedPost.save();
  return updatedPost;
};

const validateUpdateUser = (update, userID) => {
  let obj = {};
  for (prop in update) {
    if (userID[prop] || userID[prop] === null) {
      if (prop == "name") {
        obj[prop] = update[prop];
      }
      if (prop == "lastname") {
        obj[prop] = update[prop];
      }
      if (prop == "password") {
        obj[prop] = update[prop];
      }
      if (prop == "image") {
        obj[prop] = update[prop];
      }
      if (prop == "gitaccount") {
        obj[prop] = update[prop];
      }
      if (prop == "mail") {
        obj[prop] = update[prop];
      }
      if (prop == "username") {
        obj[prop] = update[prop];
      }
      //////////////// verificar lo de abajo
      if (prop == "Avatar") {
        obj[prop] = update[prop];
      }
      if (prop == "About") {
        obj[prop] = update[prop];
      }
      if (prop == "Tags") {
        obj[prop] = update[prop];
      }
    }
  }
  return obj;
};

const DB_createUser = async (date) => {
  let errors = {};
  let validateDate = await User.create(date).catch((e) => {
    e.errors.forEach((e) => {
      errors = { ...errors, [e.path]: e.message };
    });
  });
  if (Array.isArray(validateDate)) return validateDate;
  else return errors;
};

const DB_updateUser = async (date, id) => {
  let errors = {};
  let validateDate = await User.update(date, { where: { id: id } }).catch(
    (e) => {
      console.log(e);
      e.errors.forEach((e) => {
        errors = { ...errors, [e.path]: e.message };
      });
    }
  );
  if (Array.isArray(validateDate)) return [];
  else return errors;
};
const DB_userCreates = async (date) => {
  //DESCOMENTAR LAS SIGUIENTES LINEAS SIII SE QUIERE VER LOS STATUS EN LA TERMINAL Y COMENTAR LA DE ABAJO
  if (typeof date == "object") {
    await date.forEach(async (e) => {
      await axios
        .post("http://localhost:3001/user/register", e)
        .catch((e) => e);
    });

    //DESCOMENTAR LAS SIGUIENTES LINEAS NOOO SE QUIERE VER LOS STATUS EN LA TERMINAL Y COMENTAR LA DE ARRIBA
    // date.forEach(async e=>{
    // 	return await User.create(e)
    // })
  }

  return;
};

const DB_postCreates = async (data) => {
  if (typeof data == "object") {
    await data.forEach(async (e) => {
      var obj = {};
      const user = await User.findAll({ attributes: ["username"] });
      var index = Math.floor(Math.random() * 100);
      // console.log(user[index].username)
      obj = {
        title: e.title,
        content: e.text,
        image: e.image,
        tag: e.tags,
        likes: 0,
        username: user[index].username,
      };

      // console.log(obj);
      await axios.post("http://localhost:3001/post", obj).catch((e) => e);
    });
  }
};

const DB_userSearch = async (username, email, password) => {
  // const hashPassword =  bcrypt.hashSync(password,saltRounds)
  // console.log(hashPassword)
  try {
    if (username && username != null) {
      var user = await User.findOne({
        where: {
          username: username,
        },
      });
      
      if (!user) return { error: "username" };
      
      console.log(password)
      console.log(user.password)
      var isValid = await bcrypt.compare(password, user.password);

      if (!isValid) return { error: "password" };

      return user;
    } else {
      var user = await User.findOne({
        where: {
          email: email,
        },
      });
      if (user === null) {
        return { error: "email" };
      }
      var validate = await bcrypt.compare(password, user.password);
      if (!validate) {
        return { error: "password" };
      }
      return user;
    }
  } catch (e) {
    return console.log("Error login", e);
  }
};
const DB_validatePassword = (password) => {
  const validate = password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
  if (validate == null) {
    return {
      password:
        "The password must have a minimum of eight characters, at least one letter and one number.",
    };
  } else return {};
};

const BD_searchSupport = async () => {
  try {
    const allMessage = await Support.findAll();
    return allMessage;
  } catch (e) {
    return console.log("Error search message support", e);
  }
};

const BD_createPrivileges = async (user) => {
  var privileges = await Privileges.create({
    userId: user.id,
    username: user.username,
    checked: true,
    title: "Admin",
  });

  return privileges;
};

const BD_searchAdmin = async (user) => {
  var privileges = await Privileges.findOne({
    where: { username: user.username },
  });
  return privileges;
};

const BD_searchPost = async (idPost) => {
  var post = await Post.findOne({ where: { idPost: idPost } });
  return post;
};

const BD_banUser = async (username) => {
  var user = await User.findOne({ where: { username: username } });
  if (user === null) return { error: "User not exits" };
  if (user.strike === null) {
    user.strike = ["X"];
    var dayBan = new Date(Date.now() + 168 * 3600 * 1000);
    user.dayBan = dayBan;
    user.save();
    return {
      Succes: "The STRIKE was applied successfully",
      Strike: user.strike.length,
    };
  } else {
    if (user.strike.length === 1) {
      user.strike = ["X", "X"];
      var dayBan = new Date(Date.now() + 168 * 3600 * 1000);
      user.save();
    } else {
      if (user.strike.length === 2) {
        user.strike = ["X", "X", "X"];
        user.save();
      }
    }
    return {
      Succes: "The STRIKE was applied successfully",
      Strike: user.strike.length,
    };
  }
};

const BD_loginBan = async (username) => {
  const user = await User.findOne({ where: { username: username } });
  const day = new Date();
  if (user.strike?.length === 3) {
    return { error: "You are temporarily suspended" };
  }
  if (user.dayBan !== null) {
    if (day < user.dayBan) {
      return {};
    }
  }
  user.dayBan = null;
  return {};
};

const BD_banComment = async (idComment) => {
  const comment = await Comment.findOne({ where: { id: idComment } });
  if (comment === null) return { error: "Error, comment not found" };
  comment.ban = true;
  comment.save();
  return { Succes: "The BAN was applied successfully" };
};

const DB_AdminSignUp = async () =>{
  const user = {
    "username": "admin",
    "name":"admin",
    "lastname":"admin",
    "password":"Contr1234",
    "email":"admin@gmail.com",
    "image":"http://pm1.narvii.com/6750/8ac0676013474827a00f3dde5dd83009ec20f6ebv2_00.jpg",
  }

  const userRegister =await axios
        .post("http://localhost:3001/user/register", user)
        .catch((e) => e);

  const admin = await axios
      .post("http://localhost:3001/admin/register", user)
      .catch((e) => e);

  return admin;

}


module.exports = {
  DB_findUserEmailOrUsername,
  DB_findUserAll,
  DB_findUserQuery,
  DB_findUserParams,
  DB_validatePassword,
  DB_findUserCreated,
  DB_createUser,
  DB_updateUser,
  DB_UserID,
  DB_Allcomments,
  DB_Commentedit,
  DB_Commentdestroy,
  DB_Postsearch,
  DB_Postdestroy,
  DB_Postedit,
  validateUpdateUser,
  validateUpdateUser,
  DB_userCreates,
  DB_postCreates,
  DB_userSearch,
  DB_findUsersEmail,
  DB_findUsersUsername,
  BD_searchSupport,
  BD_createPrivileges,
  BD_searchAdmin,
  BD_searchPost,
  BD_banUser,
  BD_loginBan,
  BD_banComment,
  DB_AdminSignUp
};
