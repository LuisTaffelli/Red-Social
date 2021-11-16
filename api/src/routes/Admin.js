const { Router } = require("express");
const {Privileges} = require("../db.js");
const fn = require("./utils.js");
const router = Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRE_TIME, JWT_COOKIE_EXPIRE } = process.env;

router.post('/login', async (req, res) => {
    const {email, username, password} = req.body;

    try{
      if ((!username && !email) || (username === null && email === null)) {
        res.status(400).send(`Error, you must provide an email or username`);
      }
      else{
        let userLogin = await fn.DB_userSearch(username, email, password);
        if (userLogin.error) throw new Error(userLogin.error);

        const admin = await Privileges.findOne({ where:{userId:userLogin.id}});
        if(admin === null){
            return res.status(400).send('Error your not admin')
        }else{
            let sanitized = {
                username: userLogin.username,
                name: userLogin.name,
                lastname: userLogin.lastname,
                email: userLogin.email,
                gitaccount: userLogin.gitaccount,
                image: userLogin.image,
                about: userLogin.about,
                tags: userLogin.tags,
            };
            const id = userLogin.id;
            const token = jwt.sign({ id: id }, JWT_SECRET, {
              expiresIn: JWT_EXPIRE_TIME,
            });
            const cookiesOptions = {
              expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 3600 * 1000),
              httponly: true,
              Secure: true,
            };

            res.cookie("codenet", token, cookiesOptions);
            res.status(200).send({ user: sanitized, success: true , admin:true});
        }
        }
    }catch(e){
        console.log(e);
        res.status(404).send({ errors: e, success: false, admin: false });
    }
})

  router.post("/register", async (req, res) =>{
    try {
      const {username, password,email} =req.body;      
      const user = await fn.DB_userSearch(username, email, password);
      if(user.error) return res.send({Error:user.error}).status(400);

      const isAdmin = await fn.BD_searchAdmin(user);
      if(isAdmin === null){
        const privileges = await fn.BD_createPrivileges(user);
        const admin ={
          username:privileges.username,
          checked:privileges.checked,
        }
        res.status(200).send(admin)
      }
      else{
        res.send({Error: "Your is admin"}).status(404);
      }
    } catch (e) {
      console.log('Error created Admin',e)
      res.status(404).send({Error:'Error created Admin'});
    }
  })


  router.post('/banPost', async (req, res) => {
    try{
      const {idPost} = req.body;
      const post = await fn.BD_searchPost(idPost)
      if(post === null){
        res.send({Error: "Post not exits"}).status(404);
      }else{
        post.ban = true
        post.save()
        res.status(200).send({succes:"The BAN was applied successfully", post})
      }
    }catch(e){
      console.log('Error, BAN could not be applied',e)
      res.status(404).send({Error:'Error, BAN could not be applied'});
    }
  })

  router.post('/banUser', async (req, res) => {
    try{
      const {username} = req.body;
      const user = await fn.BD_banUser(username);
      user.error ?
        res.status(404).send(user.error) :
        res.status(200).send(user)
    }catch(e){
      console.log('Error, STRIKE could not be applied',e)
      res.status(404).send({Error:'Error, STRIKE could not be applied'});
    }
  })

  router.post('/banComment', async (req, res) =>{
    try{
      const {idComment} = req.body;
      const comment = await fn.BD_banComment(idComment);
      comment.error ?
        res.status(404).send(user.error) :
        res.status(200).send(comment)
    }catch(e){
      console.log('Error in ban comment', e)
      res.status(404).send({error:'Error, BAN could not be applied'})
    }
  })

  module.exports = router;
