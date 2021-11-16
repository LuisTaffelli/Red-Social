const { Router } = require("express");
const router = Router();

//Controladores de sesion

const AuthControllers = require('../controllers/AuthControllers.js')

// importar todas las routes
const Users = require("./Users.js")
const Comments = require("./Comments.js")
const Post = require("./Post.js")
const Login = require("./Login.js")
const Likes = require("./Likes.js")
const Tags = require("./Tags.js")
const Support = require("./Support.js")
const Challenge = require("./Challenge.js")
const Conversation = require("./Conversation.js")
const Message = require("./Message.js")
const Prueba = require("./PRUEBA.js")
const Admin = require("./Admin.js")
const Register = require("./newRegister.js")
const Friends = require("./Friends.js")
const Follows = require("./Follows.js")




router.get('/', (req,res)=>{
	res.status(202).send({
		"Post":` GET -> /post - /post?q=username - /post/:id
		POST -> /post
		PUT -> /post/:id
		DELETE -> /post/:id`,
		"Comment": `GET -> /comment/:username
		PUT -> /comment - /comment/:id
		DELETE -> /comment/:id`,
		"Users":`GET -> /user - /user/:username - /user/:username/posts
		POST -> /user/register`,
		"Sesion": "/login - /register - /logout"
	})
})

//Middlewares
router.use("/user", Users);
router.use("/comment", Comments);
router.use("/post", Post);
router.use("/login", Login);
router.use("/admin", Admin);
// router.use("/tags", Tags)
// router.use("/likes", Likes);
// router.use("/support",Support);
router.use("/conversation",Conversation);
router.use("/message",Message);
router.use("/follow", Follows)

router.use("/challenge", Challenge);

router.use("/tags", Tags)
router.use("/likes", Likes);
router.use("/support",  AuthControllers.isAuthenticated, Support);
router.get('/logout', AuthControllers.logout)

router.use("/auth", Register)
router.use("/friends", Friends)
module.exports = router;
