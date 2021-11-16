const { Router } = require("express");
const { DB_userSearch, BD_loginBan } = require("./utils.js");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRE_TIME, JWT_COOKIE_EXPIRE } = process.env;
const router = Router();

router.post("/", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    if ((!username && !email) || (username === null && email === null)) {
      res.status(400).send(`Error, you must provide an email or username`);
    }

    let userLogin = await DB_userSearch(username, email, password);
    if (userLogin.error) throw new Error(userLogin.error);

    let userStrike = await BD_loginBan(username)
    console.log(userStrike, "strikes")
    if(userStrike.error) res.status(400).send(userStrike.error)



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
    res.status(200).send({ user: sanitized, success: true });
  } catch (e) {
    console.log(e, "error")
    res.status(500).send({ errors: e, success: false });
  }
});
module.exports = router;
