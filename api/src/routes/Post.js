const { Router } = require("express");
const { Sequelize, Model } = require("sequelize");
const { User, Post, Comment, Likes } = require("../db.js");
const {
  DB_UserID,
  validateUpdatePost,
  DB_Postsearch,
  DB_Postdestroy,
  DB_Postedit,
} = require("./utils.js");
const Op = Sequelize.Op;
const router = Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// router.use("/", );

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

const paginate = (page = 0, arr) => {
  const postsPerPage = 15;
  const to = page * postsPerPage + postsPerPage;

  let posts = arr
    .slice(page * postsPerPage, to < arr.length ? to : arr.length)
    .map((post) => {
      if (post.imageData) {
        const image = post.imageData.toString("base64");
        post["imageData"] = image;
      }
      return post;
    });

  const totalPages = Math.ceil(arr.length / postsPerPage);

  return {
    posts,
    totalPages,
  };
};

function ordenarTags(todos, tags, orden){
  let arr;
  let conTags = [];
  let sinTags= []
  arr = todos.map((post, i, arr)=>{
    let cant = tags.filter((tag)=>{
      if (post.tag.includes(tag)) {
        return post.idPost
      }
    })
    let c = 0
    if (cant.length !== 0) {
      while(c < tags.length){
        if(cant.length === tags.length - c){
          while (!conTags[c]) {
            conTags.push([])
          }
          conTags[c] = [...conTags[c], post]
        }
        c++
      }
    }else {
      sinTags.push(post)
    }
  })
  let ordenadosPorTags = []
  for (let arr of conTags){
    if(orden==="cronologico"){ordenadosPorTags = [...ordenadosPorTags, ...arr];}else{
        ordenadosPorTags = [...ordenadosPorTags, ...ordenar(orden, arr)]
    }
  }
  let ordenadosSinTags;
  if (orden === "cronologico") {
    ordenadosSinTags = sinTags
  }else {
    ordenadosSinTags = ordenar(orden, sinTags)
  }
  return [...ordenadosPorTags, ...ordenadosSinTags]
}

function ordenamiento(arr, orden){
  console.log(arr, orden)
  return arr.sort(function (a, b) {
    if (a[orden]?.length < b[orden]?.length) {
      return 1;
    }
    if (a[orden]?.length > b[orden]?.length) {
      return -1;
    }
    return 0;
  })
}

const ordenar = (how, arr) => {
  if (how === "combinados") {
    return arr.sort(function (a, b) {
      if (a.userLikes.length + a.comments.length < b.userLikes.length + b.comments.length) {
        return 1;
      }
      if (a.userLikes.length + a.comments.length > b.userLikes.length + b.comments.length) {
        return -1;
      }
      return 0;
    })
  }else{
    return ordenamiento(arr, how)
  }
}
//Devuelve post de una categoria o si no todos los post
router.get("/", async (req, res) => {
  // const posts = await Post.findAll({order: [['createdAt', 'DESC']]})
  // return res.send(posts)


  const { tag, page, orden } = req.query;
  const tags = tag.split(",")
  const allPosts = await DB_Postsearch({});
  let finalPosts = ordenarTags(allPosts, tags, orden)
  // let postCategoria = allPosts.filter((e) =>
  //   e.tag
  //     .map((postTag) => postTag && postTag.toLowerCase())
  //     .includes(tag.toLowerCase())
  // );
  // if (!postCategoria.length)
  //   res.status(404).send(paginate(page, allPosts));

  let { posts, totalPages } = paginate(page, finalPosts);
  res.status(200).send({ posts, totalPages });
});

//Trae todos los posteos que hizo un usuario
router.get("/", async (req, res, next) => {
  console.log("holaaaaaa")
  try {
    const { username } = req.body;
    if (!!Number(username)) {
      return next();
    }
    const postName = await DB_Postsearch({ username: username });
    console.log(postName)
    postName ? res.send(postName) : res.send("This user has no Post");
  } catch (e) {
    res.status(404).send("Error with the username");
  }
});

//Filtra por id post
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    // if(Number(id).toString() === 'NaN'){
    //     return next()
    // }
    const postId = await DB_Postsearch({ id: id });
    postId
      ? res.status(200).send(postId.dataValues)
      : res.send("No post with that id");
  } catch (e) {
    res.status(404).send("Error with the id");
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  let { title, content, tag, username, type } = req.body;
  let orden = req.query.orden
  let tags = req.query.tags.split(",")

  try {
    let userDB = await DB_UserID(username);

    if (typeof tag === "string" && tag.length) tag = tag.split(",");

    let image = {};
    if (req.file) {
      image["imageType"] = req.file.mimetype;
      image["imageName"] = req.file.originalname;
      image["imageData"] = req.file.buffer;
    }

    let createPost = await Post.create({
      ...image,
      content,
      tag: tag || [],
      type,
      title,
      userId: userDB.id,
    });

    await userDB.addPost(createPost);

    const allPosts = await DB_Postsearch({});
    let finalPosts = ordenarTags(allPosts, tags, orden)
    res.status(200).send({...paginate(0, finalPosts), success:true});
  } catch (e) {
    console.log(e);
    res.status(404).send({ success: false, error: e });
  }
});

//Eliminacion de un Post
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletePost = await DB_Postdestroy(id);
    const allPosts = await DB_Postsearch({});
    const { posts, totalPages } = paginate(0, allPosts);
    res.status(200).send({ posts, totalPages, success: true });
  } catch (e) {
    res.status(404).send({ success: false, error: "Cant delete post" });
  }
});

//Edicion de post
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body)
    await DB_Postedit(id, req.body);

    const post = await modifiedPost(id);
    res.status(200).send({ post, success: true });
  } catch (e) {
    console.log(e);
    res.status(404).send({ success: false, error: "Cant apply changes" });
  }
});

module.exports = router;
