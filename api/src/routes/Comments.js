const router = require("express").Router();
const {
  User,
  Post,
  Comment,
  Likes,
  User_Comment,
  Comment_Post,
  Post_User,
} = require("../db.js");
const database_Utils = require("./utils.js");

const modifiedPost = async (idPost) => {
  return await Post.findOne({
    where: { idPost },
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
  });
};

router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const comments = await database_Utils.DB_Allcomments(username);
    return res.status(202).send(comments);
  } catch (e) {
    return res.status(404).send("This user has no Comments");
  }
});

router.post("/", async (req, res) => {
  try {
    const { content, username, postid } = req.body;
    const UserAssociation = await database_Utils.DB_UserID(username);
    const PostAssociation = await database_Utils.DB_Postsearch({ id: postid });

    const comment = await Comment.create({
      content,
      userId: UserAssociation.id,
      postId: postid,
    });

    await UserAssociation.addComment(comment);
    await PostAssociation.addComment(comment);

    const post = await modifiedPost(postid);
    return res.status(202).send({ post });
  } catch (e) {
    return res.status(404).send("Invalid username for request");
  }
});

router.put("/:id", async (req, res) => {
  if (!req.body.contentData) {
    return res.status(404).send("Invalid content for editing");
  }
  try {
    const { id } = req.params;
    const { contentData } = req.body;
    const Comment = await database_Utils.DB_Commentedit(id, contentData);
    return res.status(202).send("Edited Succesfully");
  } catch (e) {
    return res.status(404).send("Invalid comment ID");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await database_Utils.DB_Commentdestroy(id);
    return res.status(200).send({ posts: Post.findAll({}) });
  } catch (e) {
    return res.status(404).send("Invalid Comment ID");
  }
});

module.exports = router;
